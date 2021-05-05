import TripInfoView from '../view/info';
import TripNavView from '../view/navigation';
import TripFiltersView from '../view/filters';
import NoEventsView from '../view/no-events';
import EventsSortingView from '../view/sorting';
import EventsListView from '../view/events-list';
import EventPresenter from './event';
import {render, RenderPosition} from '../utils/render';
import {updateItem} from '../utils/common';
import {
  sortingEventsByDate,
  sortingEventsByTime,
  sortingEventsByPrice
} from '../utils/event';
import {
  tripMainContainer,
  tripNavContainer,
  tripFiltersContainer,
  SortTypes
} from '../const';

export default class Trip {
  constructor(tripBoardContainer) {
    this._tripBoardContainer = tripBoardContainer;

    this._tripNavComponent = new TripNavView();
    this._tripFiltersComponent = new TripFiltersView();
    this._noEventsComponent = new NoEventsView();
    this._eventsSortingComponent = new EventsSortingView();
    this._eventsListComponent = new EventsListView();
    this._eventPresenter = {};
    this._currentSortType = SortTypes.DAY;

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(events) {
    this._events = events;
    this._renderTripNav();
    this._renderTripFilters();
    this._tripInfoComponent = new TripInfoView(this._events);
    this._renderTrip();
  }

  _renderTripInfo() {
    render(tripMainContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }
  _renderTripNav() {
    render(tripNavContainer, this._tripNavComponent, RenderPosition.BEFOREEND);
  }
  _renderTripFilters() {
    render(tripFiltersContainer, this._tripFiltersComponent, RenderPosition.BEFOREEND);
  }
  _renderNoEvents() {
    render (this._tripBoardContainer, this._noEventsComponent, RenderPosition.BEFOREEND);
  }
  _sortingEvents(sortType) {
    switch (sortType) {
      case SortTypes.TIME:
        this._events.sort(sortingEventsByTime);
        break;
      case SortTypes.PRICE:
        this._events.sort(sortingEventsByPrice);
        break;
      default:
        this._events.sort(sortingEventsByDate);
    }
    this._currentSortType = sortType;
  }
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortingEvents(sortType);
    this._clearEventsList();
    this._renderEvents();
  }
  _renderEventsSorting() {
    render(this._tripBoardContainer, this._eventsSortingComponent, RenderPosition.BEFOREEND);
    this._eventsSortingComponent.setTypeSortChangeHandler(this._handleSortTypeChange);
  }
  _renderEventsList() {
    render(this._tripBoardContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
  }
  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }
  _handleModeChange() {
    Object.values(this._eventPresenter).forEach((presenter) => presenter.resetView());
  }
  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventsListComponent, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }
  _renderEvents() {
    this._events.forEach((event) => this._renderEvent(event));
  }
  _clearEventsList() {
    Object.values(this._eventPresenter).forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
  }
  _renderTrip() {
    if (this._events.length === 0) {
      this._renderNoEvents();
    } else {
      this._renderTripInfo();
      this._renderEventsSorting();
      this._renderEventsList();
      this._renderEvents();
    }
  }
}
