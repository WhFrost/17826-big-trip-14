import {createElement} from '../utils/utils';

const createEventsBord = () => {
  return `<ul class="trip-events__list">
  </ul>`;
};

export default class EventsBoard {
  constructor() {
    this._element = null;
  }
  getTemplate() {
    return createEventsBord();
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
