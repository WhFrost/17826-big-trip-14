import AbstractView from './abstract';
import {humanizeDate} from '../utils/utils';

const createOffersTemplate = (offers) => {
  if (offers.length > 0) {
    return offers.map((offer) => `<li class="event__offer">
    <span class="event__offer-title">${offer.name}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.cost}</span>
  </li>`).join('');
  }
  return '';
};

const createEvent = (event) => {
  const {date, type, city, timeStart, timeEnd, duration, cost, offers, isFavorite} = event;
  const formatedDate = humanizeDate('MMM D', date);
  const formatedTimeStart = humanizeDate('HH:mm', timeStart);
  const formatedTimeEnd = humanizeDate('HH:mm', timeEnd);

  const getFormatedDuration = (duration) => {
    if (duration % 60 <= 0) {
      return duration + 'M';
    }
    return Math.trunc(duration / 60) + 'H ' + duration % 60 + 'M';
  };
  const formatedDuration = getFormatedDuration(duration);

  const offersTemplate = createOffersTemplate(offers);

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn--active'
    : '';

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="2019-03-18">${formatedDate}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${city}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="2019-03-18T10:30">${formatedTimeStart}</time>
        &mdash;
        <time class="event__end-time" datetime="2019-03-18T11:00">${formatedTimeEnd}</time>
      </p>
      <p class="event__duration">${formatedDuration}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${cost}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offersTemplate}
    </ul>
    <button class="event__favorite-btn ${favoriteClassName}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

export default class Event extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }
  getTemplate() {
    return createEvent(this._events);
  }
}
