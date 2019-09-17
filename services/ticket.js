import { observable, action, computed } from 'mobx';
import debounce from 'debounce';

class TicketService {
  @observable ticketList = [
    {
      id: 0,
    },
    {
      id: 1,
    },
  ];

  @action async loadTickets() {
  }

  debounceLoadTickets = debounce(() => {
    this.loadTickets();
  }, 500);
}

export default TicketService;