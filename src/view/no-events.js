import AbstractView from './abstract';

const createNoEvents = () => {
  return `<p class="trip-events__msg">
  Click New Event to create your first point
  </p>`;
};

export default class NoEvents extends AbstractView {
  getTemplate() {
    return createNoEvents();
  }
}
