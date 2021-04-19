import AbstractView from './abstract';

const createLoading = () => {
  return `<p class="trip-events__msg">
  Loading...
  </p>`;
};

export default class Loading extends AbstractView {
  getTemplate() {
    return createLoading();
  }
}
