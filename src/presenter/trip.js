import TripInfoView from '../view/info';
import TripNavView from '../view/navigation';
import TripFiltersView from '../view/filters';
import NoEventsView from '../view/no-events';
import EventsSortingView from '../view/sorting';
import EventsListView from '../view/events-list';
import EventView from '../view/event';
import EditEventFormView from '../view/edit-event';
import {render, RenderPosition, replace} from '../utils/render';
import {
  tripMainContainer,
  tripNavContainer,
  tripFiltersContainer
} from '../const';

export default class Trip {
  constructor(tripBoardContainer) {
    this._tripBoardContainer = tripBoardContainer;

    this._tripNavComponent = new TripNavView();
    this._tripFiltersComponent = new TripFiltersView();
    this._noEventsComponent = new NoEventsView();
    this._eventsSortingComponent = new EventsSortingView();
    this._eventsListComponent = new EventsListView();
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
  _renderEventsSorting() {
    render(this._tripBoardContainer, this._eventsSortingComponent, RenderPosition.BEFOREEND);
  }
  _renderEventsList() {
    render(this._tripBoardContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
  }
  _renderEvent(event) {
    const eventComponent = new EventView(event);
    render(this._eventsListComponent, eventComponent, RenderPosition.BEFOREEND);

    const editEventFormComponent = new EditEventFormView(event);
    const replaceEventToEditEventForm = () => {
      replace(editEventFormComponent, eventComponent);
    };
    const replaceEditEventFormToEvent = () => {
      replace(eventComponent, editEventFormComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditEventFormToEvent();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    eventComponent.setEditClickHandler(() => {
      replaceEventToEditEventForm();
      document.addEventListener('keydown', onEscKeyDown);
    });
    editEventFormComponent.setEditClickHandler(() => {
      replaceEditEventFormToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });
    editEventFormComponent.setEditFormSubmitClickHandler(() => {
      replaceEditEventFormToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });
  }
  _renderEvents() {
    this._events.forEach((event) => this._renderEvent(event));
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
