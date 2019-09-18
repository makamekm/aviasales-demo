import { formatTransition, formatDuration, formatTime, formatPrice } from '../utils/formatters';
import filterTypes from '../models/transition';
import TicketService from './ticket.provider';

const service = new TicketService();

const filterKeys = filterTypes.map(v => v.key).filter(k => k !== 'all');

function filterTicketList({ list, isAllTransitionSelected, transition }) {
  return list.filter(ticket => {
    let result = true;
    if (!isAllTransitionSelected) {
      const lengths = filterKeys.filter(key => transition[key]);
      result = result
        && ticket.segments.reduce((acc, s) => acc || lengths.indexOf(s.stops.length) >= 0, false);
    }
    return result;
  });
}

function sortTicketList({ list, isCheapest }) {
  return list.sort((a, b) => {
    if (isCheapest) {
      return a.price < b.price ? -1 : 1;
    } else {
      const durationA = a.segments.reduce((acc, s) => acc + s.duration, 0);
      const durationB = b.segments.reduce((acc, s) => acc + s.duration, 0);
      return durationA < durationB ? -1 : 1;
    }
  });
}

function extendTicketSegmentList(segments) {
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

function extendTicketList(list) {
  return list.map(ticket => {
    ticket.priceFormatted = formatPrice(ticket.price);
    ticket.segments = extendTicketSegmentList(ticket.segments);
    return ticket;
  });
}

let ticketList = [];

function processData({
  isAllTransitionSelected,
  transition,
  isCheapest,
}) {
  let list = ticketList;

  list = filterTicketList({ list, isAllTransitionSelected, transition });
  list = sortTicketList({ list, isCheapest });
  list = extendTicketList(list);

  return list.slice(0, 5);
}

self.addEventListener('message', async (event) => {
  switch (event.data.type) {
    case 'process':
      // Skip any preprocessing
      break;
    case 'load':
      ticketList = await service.loadTicketList$.toPromise();
      break;
  }
  const data = processData(event.data);
  self.postMessage(data);
});