import { observable, observe, action } from 'mobx';
import debounce from 'debounce';
import { Inject } from 'react-ioc';
import FilterService from './filter';
import TicketService from './ticket';
import filterTypes from '../models/transition'
import { formatTransition, formatDuration, formatTime, formatPrice } from '../utils/formatters';

const filterKeys = filterTypes.map(v => v.key).filter(k => k !== 'all');

class TicketFilteredService {
  @observable handling = false;
  @observable loading = true;
  @observable ticketList = [];
  @observable aggregatedTicketList = [];

  @Inject(TicketService) ticketService;
  @Inject(FilterService) filterService;

  constructor() {
    if (process.browser) {
      this.loadTicketList();
    }

    observe(this.filterService.transition, this.updateTicketList);
    observe(this.filterService.direction, this.updateTicketList);
  }

  filterTicketList(list) {
    return list.filter(ticket => {
      let result = true;
      if (!this.filterService.isAllTransitionSelected) {
        const lengths = filterKeys.filter(key => this.filterService.transition[key]);
        result = result
          && ticket.segments.reduce((acc, s) => acc || lengths.indexOf(s.stops.length) >= 0, false);
      }
      return result;
    });
  }

  sortTicketList(list) {
    return list.sort((a, b) => {
      if (this.filterService.isCheapest) {
        return a.price < b.price ? -1 : 1;
      } else {
        const durationA = a.segments.reduce((acc, s) => acc + s.duration, 0);
        const durationB = b.segments.reduce((acc, s) => acc + s.duration, 0);
        return durationA < durationB ? -1 : 1;
      }
    });
  }

  extendTicketSegmentList(segments) {
    return segments.map(segment => {
      segment.dateStart = new Date(Date.parse(segment.date));
      segment.dateFinish = new Date(segment.dateStart.getTime());
      segment.dateFinish.setMinutes(segment.dateFinish.getMinutes() + segment.duration);
      segment.timeStartFormatted = formatTime(segment.dateStart);
      segment.timeFinishFormatted = formatTime(segment.dateFinish);
      segment.durationFormatted = formatDuration(segment.duration);
      segment.transitionFormatted = formatTransition(segment.stops.length);
      return segment;
    });
  }

  extendTicketList(list) {
    return list.map(ticket => {
      ticket.priceFormatted = formatPrice(ticket.price);
      ticket.segments = this.extendTicketSegmentList(ticket.segments);
      return ticket;
    });
  }

  processTicketList() {
    let list = this.ticketList;
    list = this.filterTicketList(list);
    list = this.sortTicketList(list);
    list = this.extendTicketList(list);
    this.aggregatedTicketList.replace(list.slice(0, 5));
  }

  debounceUpdateTicketList = debounce(() => {
    this.processTicketList();
    this.handling = false;
  }, 200);

  updateTicketList = () => {
    this.handling = true;
    this.debounceUpdateTicketList();
  }

  @action async loadTicketList() {
    this.loading = true;
    try {
      const tickets = await this.ticketService.loadTicketList$.toPromise();
      this.ticketList.replace(tickets);
      this.processTicketList();
    } catch (error) {
      throw error;
    } finally {
      this.loading = false;
    }
  }
}

export default TicketFilteredService;