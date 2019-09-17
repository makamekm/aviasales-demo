import { observable, action } from 'mobx';
import fetch from '../utils/fetch';

const SEARCH_URL = `https://front-test.beta.aviasales.ru/search`;
const TICKET_URL = `https://front-test.beta.aviasales.ru/tickets`;

class TicketService {
  @observable loading = true;
  @observable searchId = null;
  @observable ticketList = [];

  constructor() {
    if (process.browser) {
      this.loadTicketList();
    }
  }

  async loadSearchIdRequest() {
    const res = await fetch(SEARCH_URL, {
      method: 'GET',
    });
    return await res.json();
  }

  @action async loadSearchId() {
    const { searchId } = await this.loadSearchIdRequest();
    this.searchId = searchId;
    if (this.searchId == null) {
      throw new Error(`searchId can't be null`);
    }
  }

  @action async checkSearchId() {
    if (this.searchId == null) {
      await this.loadSearchId();
    }
  }

  async loadTicketListRequest() {
    const res = await fetch(TICKET_URL, {
      method: 'GET',
      queryParams: {
        searchId: this.searchId,
      },
    });
    return await res.json();
  }

  @action updateTicketModel({ tickets, stop }) {
    this.ticketList.replace(tickets);
    if (stop) {
      this.searchId = null;
    }
  }

  @action async loadTicketList() {
    this.loading = true;
    try {
      await this.checkSearchId();
      const response = await this.loadTicketListRequest();
      this.updateTicketModel(response);
    } catch (error) {
      throw error;
    } finally {
      this.loading = false;
    }
  }
}

export default TicketService;