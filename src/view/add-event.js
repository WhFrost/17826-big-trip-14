import he from 'he';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import SmartView from './smart';
import {humanizeDate} from '../utils/event';
import {availableOffers, availableDestinations} from '../main';
import {BLANK_EVENT} from '../const';

const createEventTypesTemplate = (currentType, defaultTypes) => {
  return defaultTypes.map((type) => `<div class="event__type-item">
    <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
    value="${type.toLowerCase()}"
    ${currentType === type ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
  </div>`).join('');
};

const createCitiesListTemplate = (defaultDestinations) => {
  return `<datalist id="destination-list-1">
    ${defaultDestinations.map((item) => `<option value="${item.name}"></option>`).join('')}
        </datalist>`;
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
  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}" required>
</div>`;
};

const createOffers = (offers, offersByType, isDisabled) => {
  if (offersByType.length > 0) {
    return offersByType.map((offer) => {
      const isChecked = (offers.some((item) => item.title === offer.title));
      const id = offer.title + '-' + offer.price;
      return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="${id}" ${isDisabled ? 'disabled' : ''}
      ${isChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="${id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
      </label>
      </div>`;}).join('');
  }
  return '';
};

const createOffersTemplate = (offers, type, offersByType, isDisabled) => {
  const newAvailableOffers = offersByType.get(type.toLowerCase());
  const newOffers = createOffers(offers, newAvailableOffers, isDisabled);

  if (!newAvailableOffers.length || !newAvailableOffers) {
    return `<section class="event__section  event__section--offers visually-hidden">
      </section>`;
  }

  return `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
     ${newOffers}
  </div>
</section>`;
};

const createDestinationTemplate = (destination) => {
  const {description, pictures} = destination;
  if (description.length > 0 || pictures.length > 0) {
    let str = `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>`;
    if (description.length > 0) {
      str += `<p class="event__destination-description">${description}</p>`;
    }
    if (pictures.length > 0) {
      str += pictures.reduce((total, current) =>
        total + `<img class="event__photo" src="${current.src}.jpg" alt="${current.description}"></img>`, `<div class="event__photos-container">
        <div class="event__photos-tape">`) +
        `</div>
        </div>`;
    }
    return str += '</section>';
  }
  return '';
};

const createAddEventForm = (event) => {
  const {type, timeStart, timeEnd, cost, offers, destination} = event;
  const {name} = event.destination;
  const types = Array.from(availableOffers.keys());
  const eventTypesTemplate = createEventTypesTemplate(type, types);
  const citiesListTeplate = createCitiesListTemplate(availableDestinations);
  const timesTemplate = createTimesTemplate(timeStart, timeEnd);
  const costTemplate = createCostTemplate(cost);
  const offersTemplate = createOffersTemplate(offers, type, availableOffers);
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
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(name)}" list="destination-list-1" required>
        ${citiesListTeplate}
      </div>
        ${timesTemplate}
        ${costTemplate}
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>

    </header>
    <section class="event__details">

        ${offersTemplate}

        ${destinationTemplate}

    </section>
  </form>
</li>`;
};

export default class AddEvent extends SmartView {
  constructor(event = BLANK_EVENT) {
    super();
    this._data = AddEvent.parseEventToData(event);
    this._timeStartPicker = null;
    this._timeEndPicker = null;

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._timeStartChangeHandler = this._timeStartChangeHandler.bind(this);
    this._timeEndChangeHandler = this._timeEndChangeHandler.bind(this);
    this._costInputHandler = this._costInputHandler.bind(this);
    this._offersCheckHandler = this._offersCheckHandler.bind(this);
    this._addFormSubmitClickHandler = this._addFormSubmitClickHandler.bind(this);
    this._addFormDeleteClickHandler = this._addFormDeleteClickHandler.bind(this);

    this._setInnerHandlers();
    this._setTimeStartPicker();
    this._setTimeEndPicker();
  }
  getTemplate() {
    return createAddEventForm(this._data);
  }

  reset(event) {
    this.updateData(
      AddEvent.parseEventToData(event),
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
    this.setAddFormSubmitClickHandler(this._callback.addFormSubmitClick);
    this.setAddFormDeleteClickHandler(this._callback.addFormDeleteClick);
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
    const destination = availableDestinations.find((item) => item.name === city);
    if (!destination) {
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
      const newAvailableOffers = availableOffers.get(type);
      const addedOffer = newAvailableOffers.filter((item) => item.id === offer.id);
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
  _addFormSubmitClickHandler(evt) {
    evt.preventDefault();
    this._callback.addFormSubmitClick(AddEvent.parseDataToEvent(this._data));
  }
  _addFormDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.addFormDeleteClick(AddEvent.parseDataToEvent(this._data));
  }

  setAddFormSubmitClickHandler(callback) {
    this._callback.addFormSubmitClick = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._addFormSubmitClickHandler);
  }
  setAddFormDeleteClickHandler(callback) {
    this._callback.addFormDeleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._addFormDeleteClickHandler);
  }
}
