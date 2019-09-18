import { observable, observe, action, toJS } from 'mobx';
import debounce from 'debounce';
import { Inject } from 'react-ioc';
import FilterService from './filter';
import TicketService from './ticket';
import FilterTicketWorker from './filter-ticket.worker';

class TicketFilteredService {
  @observable handling = false;
  @observable loading = true;
  @observable aggregatedTicketList = [];

  @Inject(TicketService) ticketService;
  @Inject(FilterService) filterService;

  constructor() {
    observe(this.filterService.transition, this.updateTicketList);
    observe(this.filterService.direction, this.updateTicketList);

    if (process.browser) {
      this.worker = new FilterTicketWorker();
      this.worker.addEventListener('message', this.onWorkerMessage);
      this.loadTicketList();
    }
  }

  onWorkerMessage = debounce(event => {
    this.aggregatedTicketList.replace(event.data);
    this.loading = false;
    this.handling = false;
  }, 100);

  processTicketList() {
    this.worker.postMessage({
      type: 'process',
      isAllTransitionSelected: this.filterService.isAllTransitionSelected,
      transition: toJS(this.filterService.transition),
      isCheapest: this.filterService.isCheapest,
    });
  }

  updateTicketList = () => {
    this.handling = true;
    this.processTicketList();
  }

  @action async loadTicketList() {
    this.loading = true;
    this.worker.postMessage({
      type: 'load',
      isAllTransitionSelected: this.filterService.isAllTransitionSelected,
      transition: toJS(this.filterService.transition),
      isCheapest: this.filterService.isCheapest,
    });
  }
}

export default TicketFilteredService;