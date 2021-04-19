import AbstractView from './abstract';

const createEventsBord = () => {
  return `<ul class="trip-events__list">
  </ul>`;
};

export default class EventsBoard extends AbstractView {
  getTemplate() {
    return createEventsBord();
  }
}
