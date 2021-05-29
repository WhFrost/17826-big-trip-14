import AbstractView from './abstract';
import {humanizeDate} from '../utils/event';

const createTripCities = (events) => {
  if (events.length >= 3) {
    return `<h1 class="trip-info__title">
    ${events[0].destination.name + ' &mdash; ... &mdash; ' + events[events.length - 1].destination.name}
    </h1>`;
  }
  if (events.length > 0 && events.length < 3) {
    return `<h1 class="trip-info__title">
    ${events.map((event) => event.destination.name).join(' &mdash; ')}
    </h1>`;
  }
  return '';
};

const createTripDates = (events) => {
  if (events.length > 0) {
    const dateBegin = humanizeDate('MMM DD', events[0].timeStart);
    const dateEnd = humanizeDate('MMM DD', events[events.length - 1].timeStart);
    return `<p class="trip-info__dates">${dateBegin}&nbsp;&mdash;&nbsp;${dateEnd}</p>`;
  }
  return '';
};

const createTripCost = (events) => {
  let tripCost = 0;
  let offersCost = 0;
  events.forEach((event) => {
    tripCost += event.cost;
    const {offers} = event;
    if (offers.length !== 0) {
      offers.forEach((offer) => {
        offersCost += offer.price;
        return offersCost;
      });
      return tripCost;
    }
  });

  const totalCost = tripCost + offersCost;
  return `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span></p>`;
};

const createTripInfo = (events) => {
  const cities = createTripCities(events);
  const tripDates = createTripDates(events);
  const cost = createTripCost(events);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
    ${cities}
    ${tripDates}
    </div>
    ${cost}
    </section>`;
};

export default class TripInfo extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }
  getTemplate() {
    return createTripInfo(this._events);
  }
}
