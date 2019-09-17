import { observable, action } from 'mobx';
import fetch from '../utils/fetch';
import { from, of } from 'rxjs';
import { retry, map, switchMap, mapTo, tap } from 'rxjs/operators';

const SEARCH_URL = `https://front-test.beta.aviasales.ru/search`;
const TICKET_URL = `https://front-test.beta.aviasales.ru/tickets`;

class TicketService {

  async loadSearchIdRequest() {
    const res = await fetch(SEARCH_URL, {
      method: 'GET',
    });
    const { searchId } = await res.json();
    if (!searchId) {
      throw new Error(`searchId can't be null`);
    }
    return searchId;
  }

  async loadTicketBatchRequest(searchId) {
    const res = await fetch(TICKET_URL, {
      method: 'GET',
      queryParams: {
        searchId,
      },
    });
    return await res.json();
  }

  loadTicketBatch$(searchId) {
    return of(null).pipe(
      switchMap(async () => await this.loadTicketBatchRequest(searchId)),
      retry(5),
    )
  }

  async loadTicketBatchList(searchId) {
    let list = [];
    let stop = false;
    while (!stop) {
      stop = await this.loadTicketBatch$(searchId).pipe(
        map(({tickets, stop}) => {
          list = [...list, ...tickets];
          return stop;
        }),
      ).toPromise();
    }
    return list;
  }

  get loadTicketList$() {
    return of(null).pipe(
      switchMap(async () => await this.loadSearchIdRequest()),
      retry(3),
      switchMap(async searchId => await this.loadTicketBatchList(searchId)),
    );
  }
}

export default TicketService;