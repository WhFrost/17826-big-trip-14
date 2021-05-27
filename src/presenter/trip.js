import TripInfoView from '../view/info';
import TripNavView from '../view/navigation';
import NoEventsView from '../view/no-events';
import EventsSortingView from '../view/sorting';
import EventsListView from '../view/events-list';
import EventPresenter from './event';
import {render, RenderPosition, remove} from '../utils/render';
import {
  sortingEventsByDate,
  sortingEventsByTime,
  sortingEventsByPrice
} from '../utils/event';
import {
  tripMainContainer,
  tripNavContainer,
  SortTypes,
  UpdateType,
  UserAction,
  FilterType
} from '../const';
import {filter} from '../utils/filters';
import EventNewPresenter from './new-event.js';

export default class Trip {
  constructor(tripBoardContainer, eventsModel, filtersModel) {
    this._tripBoardContainer = tripBoardContainer;
    this._eventsModel = eventsModel;
    this._filtersModel = filtersModel;

    this._tripNavComponent = new TripNavView();
    this._noEventsComponent = new NoEventsView();
    this._eventsListComponent = new EventsListView();
    this._eventPresenter = {};
    this._currentSortType = SortTypes.DAY;
    this._eventsSortingComponent = null;
    this._eventNewPresenter = new EventNewPresenter(this._eventsListComponent, this._handleViewAction);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTripNav();
    this._tripInfoComponent = new TripInfoView(this._getEvents());
    this._renderTrip();
  }

  createEvent() {
    this._currentSortType = SortTypes.DAY;
    this._filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init();
  }

  _getEvents() {
    const filterType = this._filtersModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filtredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortTypes.DAY:
        return filtredEvents.sort(sortingEventsByDate);
      case SortTypes.TIME:
        return filtredEvents.sort(sortingEventsByTime);
      case SortTypes.PRICE:
        return filtredEvents.sort(sortingEventsByPrice);
    }
    return this._eventsModel.getEvents();
  }

  _renderTripInfo() {
    render(tripMainContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }
  _renderTripNav() {
    render(tripNavContainer, this._tripNavComponent, RenderPosition.BEFOREEND);
  }
  _renderNoEvents() {
    render (this._tripBoardContainer, this._noEventsComponent, RenderPosition.BEFOREEND);
  }
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }
  _renderEventsSorting() {
    if (this._eventsSortingComponent !== null) {
      this._eventsSortingComponent = null;
    }
    this._eventsSortingComponent = new EventsSortingView(this._currentSortType);
    render(this._tripBoardContainer, this._eventsSortingComponent, RenderPosition.BEFOREEND);
    this._eventsSortingComponent.setTypeSortChangeHandler(this._handleSortTypeChange);
  }
  _renderEventsList() {
    render(this._tripBoardContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
  }
  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }
  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
    }
  }
  _handleModeChange() {
    this._eventNewPresenter.destroy();
    Object.values(this._eventPresenter).forEach((presenter) => presenter.resetView());
  }
  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventsListComponent, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }
  _renderEvents() {
    this._getEvents().forEach((event) => this._renderEvent(event));
  }
  _clearTrip({resetSortType = false} = {}) {
    this._eventNewPresenter.destroy();
    Object.values(this._eventPresenter).forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};

    remove(this._eventsSortingComponent);
    remove(this._noEventsComponent);
    if (resetSortType) {
      this._currentSortType = SortTypes.DAY;
    }
  }
  _renderTrip() {
    if (this._getEvents().length === 0) {
      this._renderNoEvents();
    } else {
      this._renderTripInfo();
      this._renderEventsSorting();
      this._renderEventsList();
      this._renderEvents();
    }
  }
}
