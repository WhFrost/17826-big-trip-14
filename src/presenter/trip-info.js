import TripInfoView from '../view/info';
import {render, replace, remove, RenderPosition} from '../utils/render';

export default class TripInfo {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._tripInfoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const events = this._getTripInfo();

    const prevTripInfoComponent = this._tripInfoComponent;
    this._tripInfoComponent = new TripInfoView(events);

    if (prevTripInfoComponent === null) {
      render(this._container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _getTripInfo() {
    const events = this._eventsModel.getEvents();
    return events;
  }
}
