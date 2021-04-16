import {createElement} from '../utils/utils';

const createTripCost = (events) => {
  let tripCost = 0;
  let offersCost = 0;
  events.forEach((event) => {
    tripCost += event.cost;
    const {offers} = event;
    if (offers.length !== 0) {
      offers.forEach((offer) => {
        offersCost += offer.cost;
        return offersCost;
      });
      return tripCost;
    }
  });

  const totalCost = tripCost + offersCost;
  return `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span></p>`;
};

export default class TripCost {
  constructor(events) {
    this._element = null;
    this._events = events;
  }
  getTemplate() {
    return createTripCost(this._events);
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    this._element = null;
  }
}
