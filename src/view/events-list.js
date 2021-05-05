import AbstractView from './abstract';

const createEventsList = () => {
  return `<ul class="trip-events__list">
  </ul>`;
};

export default class EventsList extends AbstractView {
  getTemplate() {
    return createEventsList();
  }
}
