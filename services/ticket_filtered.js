import { observable, observe } from 'mobx';
import debounce from 'debounce';
import { Inject } from 'react-ioc';
import FilterService from './filter';
import TicketService from './ticket';

class TicketFilteredService {
  @observable filtered_ticket_list = [];

  @Inject(TicketService) ticketService;
  @Inject(FilterService) filterService;

  constructor() {
    observe(this.ticketService.ticketList, this.debounceUpdateTickets);
    observe(this.filterService.transition, this.debounceUpdateTickets);
    observe(this.filterService.direction, this.debounceUpdateTickets);
  }

  debounceUpdateTickets = debounce(() => {
    console.log('Need to be updated');
  }, 500);
}

export default TicketFilteredService;