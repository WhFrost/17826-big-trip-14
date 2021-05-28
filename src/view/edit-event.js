import he from 'he';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import SmartView from './smart';
import {TYPES, CITIES, offersByTypes, destinationsByCities} from '../mock/event';
import {BLANK_EVENT} from '../const';
import {humanizeDate} from '../utils/event';

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

const createOffersTemplate = (offers, type, offersByTypes) => {
  const availableOffers = offersByTypes.get(type.toLowerCase());
  if (availableOffers.length > 0) {
    return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">` +
      availableOffers.map((offer) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="${offer.id}"
      ${offers.includes(offer) ? 'checked' : ''}>
      <label class="event__offer-label" for="${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.cost}</span>
      </label>
      </div>`).join('') +
    `</div>
    </section>`;
  }
  return '';
};

const createDestinationTemplate = (destination) => {
  const {description, photos} = destination;
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
  const eventTypesTemplate = createEventTypesTemplate(type, TYPES);
  const citiesListTeplate = createCitiesListTemplate(CITIES);
  const timesTemplate = createTimesTemplate(timeStart, timeEnd);
  const costTemplate = createCostTemplate(cost);
  const offersTemplate = createOffersTemplate(offers, type, offersByTypes);
  const destinationTemplate = createDestinationTemplate(destination);

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
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(city)}" list="destination-list-1">
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

export default class EditEvent extends SmartView {
  constructor(event = BLANK_EVENT) {
    super();
    this._data = EditEvent.parseEventToData(event);
    this._timeStartPicker = null;
    this._timeEndPicker = null;

    this._editFormClickHandler = this._editFormClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._timeStartChangeHandler = this._timeStartChangeHandler.bind(this);
    this._timeEndChangeHandler = this._timeEndChangeHandler.bind(this);
    this._costInputHandler = this._costInputHandler.bind(this);
    this._offersCheckHandler = this._offersCheckHandler.bind(this);
    this._editFormSubmitClickHandler = this._editFormSubmitClickHandler.bind(this);
    this._editFormDeleteClickHandler = this._editFormDeleteClickHandler.bind(this);

    this._setInnerHandlers();
    this._setTimeStartPicker();
    this._setTimeEndPicker();
  }
  getTemplate() {
    return createEditEventForm(this._data);
  }

  reset(event) {
    this.updateData(
      EditEvent.parseEventToData(event),
    );
  }
  removeElement() {
    super.removeElement();
    if (this._timeStartPicker) {
      this._timeStartPicker.destroy();
      this._timeStartPicker = null;
    }
    if (this._timeEndPicker) {
      this._timeEndPicker.destroy();
      this._timeEndPicker = null;
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setTimeStartPicker();
    this._setTimeEndPicker();
    this.setEditFormClickHandler(this._callback.editFormSubmitClick);
    this.setEditFormSubmitClickHandler(this._callback.editFormSubmitClick);
    this.setEditFormDeleteClickHandler(this._callback.editFormDeleteClick);
  }
  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-list').addEventListener('change', this._typeChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._destinationChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._costInputHandler);
    this.getElement().querySelector('.event__available-offers').addEventListener('change', this._offersCheckHandler);
  }

  static parseEventToData(event) {
    return Object.assign({},event);
  }
  static parseDataToEvent(data) {
    data = Object.assign({}, data);
    return data;
  }

  _editFormClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }
  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: [],
    });
  }
  _destinationChangeHandler(evt) {
    evt.preventDefault();
    const city = evt.target.value.toLowerCase();
    const destination = destinationsByCities.get(city);
    if (!destinationsByCities.has(city)) {
      evt.target.setCustomValidity('Choose city from the list');
      return;
    }
    evt.target.setCustomValidity('');
    this.updateData({
      city: evt.target.value,
      destination,
    });
  }

  _timeStartChangeHandler([userDate]) {
    this.updateData({
      date: userDate,
      timeStart: userDate,
    });
  }

  _timeEndChangeHandler([userDate]) {
    this.updateData({
      timeEnd: userDate,
    });
  }

  _setTimeStartPicker() {
    if (this._timeStartPicker) {
      this._timeStartPicker.destroy();
      this._timeStartPicker = null;
    }
    this._timeStartPicker = flatpickr(this.getElement().querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: humanizeDate('DD/MM/YY HH:mm', this._data.timeStart),
        enableTime: true,
        maxDate: humanizeDate('DD/MM/YY HH:mm', this._data.timeEnd),
        onChange: this._timeStartChangeHandler,
      },
    );
  }
  _setTimeEndPicker() {
    if (this._timeEndPicker) {
      this._timeEndPicker.destroy();
      this._timeEndPicker = null;
    }
    this._timeEndPicker = flatpickr(this.getElement().querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: humanizeDate('DD/MM/YY HH:mm', this._data.timeEnd),
        enableTime: true,
        minDate: humanizeDate('DD/MM/YY HH:mm', this._data.timeStart),
        onChange: this._timeEndChangeHandler,
      },
    );
  }
  _costInputHandler(evt) {
    evt.preventDefault();
    const cost = evt.target.value;

    if (!Number.isInteger(parseInt(cost))) {
      evt.target.setCustomValidity('Cost must be an integer');
      return;
    }
    evt.target.setCustomValidity('');
    this.updateData({
      cost: parseInt(cost),
    }, true);
  }
  _offersCheckHandler(evt) {
    const offer = evt.target;
    const type = this._data.type.toLowerCase();
    const eventOffers = this._data.offers;
    if (offer.checked) {
      const availableOffers = offersByTypes.get(type);
      const addedOffer = availableOffers.filter((item) => item.id === offer.id);
      const newOffers = eventOffers.concat(addedOffer);
      this.updateData({
        offers: newOffers,
      }, true);
    }
    if (!offer.checked) {
      const newOffers = eventOffers.filter((item) => item.id !== offer.id);
      this.updateData({
        offers: newOffers,
      }, true);
    }
  }
  _editFormSubmitClickHandler(evt) {
    evt.preventDefault();
    this._callback.editFormSubmitClick(EditEvent.parseDataToEvent(this._data));
  }
  _editFormDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.editFormDeleteClick(EditEvent.parseDataToEvent(this._data));
  }

  setEditFormClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editFormClickHandler);
  }
  setEditFormSubmitClickHandler(callback) {
    this._callback.editFormSubmitClick = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._editFormSubmitClickHandler);
  }
  setEditFormDeleteClickHandler(callback) {
    this._callback.editFormDeleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._editFormDeleteClickHandler);
  }
}
