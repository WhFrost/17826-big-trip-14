import {TYPES, CITIES, OFFERS_LIST} from '../mock/event';
import {humanizeDate, createElement} from '../utils/utils';

const createEventTypesTemplate = (currentType, defaultTypes) => {
  return defaultTypes.map((type) => `<div class="event__type-item">
    <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
    value="${type.toLowerCase()}"
    ${currentType === type ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
  </div>`).join('');
};

const createCitiesListTemplate = (defaultDestinations) => {
  return defaultDestinations.reduce((total, current) => total + `<option value="${current}"></option>`, '<datalist id="destination-list-1">') + '</datalist>';
};

const createTimesTemplate = (timeStart, timeEnd) => {
  return `<div class="event__field-group  event__field-group--time">
  <label class="visually-hidden" for="event-start-time-1">From</label>
  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
  value="${humanizeDate('DD/MM/YY HH:mm', timeStart)}">
  &mdash;
  <label class="visually-hidden" for="event-end-time-1">To</label>
  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
  value="${humanizeDate('DD/MM/YY HH:mm', timeEnd)}">
</div>`;
};

const createCostTemplate = (cost) => {
  return `<div class="event__field-group  event__field-group--price">
  <label class="event__label" for="event-price-1">
    <span class="visually-hidden">Price</span>
    &euro;
  </label>
  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}">
</div>`;
};

const createOffersTemplate = (offers, availableOffers) => {
  if (offers.length > 0) {
    return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">` +
      availableOffers.map((offer) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-${offer.id}"
      ${offers.includes(offer) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
      <span class="event__offer-title">${offer.name}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.cost}</span>
      </label>
      </div>`).join('') +
    `</div>
    </section>`;
  }
  return '';
};

const createDestinationTemplate = (description, photos) => {
  if (description.length > 0 || photos.length > 0) {
    let str = `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>`;
    if (description.length > 0) {
      str += description.reduce((total, current) =>
        total + current + ' ', '<p class="event__destination-description">') + '</p>';
    }
    if (photos.length > 0) {
      str += photos.reduce((total, current) =>
        total + `<img class="event__photo" src="${current}.jpg" alt="Event photo"></img>`, `<div class="event__photos-container">
        <div class="event__photos-tape">`) +
        `</div>
        </div>`;
    }
    return str += '</section>';
  }
  return '';
};

const createEditEventForm = (event) => {
  const {type, city, timeStart, timeEnd, cost, offers, destination} = event;
  const {description, photos} = destination;
  const eventTypesTemplate = createEventTypesTemplate(type, TYPES);
  const citiesListTeplate = createCitiesListTemplate(CITIES);
  const timesTemplate = createTimesTemplate(timeStart, timeEnd);
  const costTemplate = createCostTemplate(cost);
  const offersTemplate = createOffersTemplate(offers, OFFERS_LIST);
  const destinationTemplate = createDestinationTemplate(description, photos);

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${eventTypesTemplate}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
        ${citiesListTeplate}
      </div>
        ${timesTemplate}
        ${costTemplate}
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">

        ${offersTemplate}

        ${destinationTemplate}

    </section>
  </form>
</li>`;
};

export default class EditEvent {
  constructor(events) {
    this._element = null;
    this._events = events;
  }
  getTemplate() {
    return createEditEventForm(this._events);
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
