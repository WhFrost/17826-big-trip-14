import {EVENTS_COUNT} from './const';
import {sortingEventsByDate} from './utils/event';
import {render, RenderPosition, replace} from './utils/render';
import TripInfoView from './view/info';
import TripCostView from './view/cost';
import TripNavView from './view/navigation';
import TripFiltersView from './view/filters';
import NoEventsView from './view/no-events';
import EventsSortingView from './view/sorting';
import EventsBordView from './view/board';
import EventView from './view/event';
import EditEventFormView from './view/edit-event';
import {generateEvent} from './mock/event';

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);
const sortedEvents = sortingEventsByDate(events);

const headerContainer = document.querySelector('.page-header');
const tripMainContainer = headerContainer.querySelector('.trip-main');

const tripNavContainer = headerContainer.querySelector('.trip-controls__navigation');
const tripNavComponent = new TripNavView();
render(tripNavContainer, tripNavComponent, RenderPosition.BEFOREEND);

const tripFiltersContainer = headerContainer.querySelector('.trip-controls__filters');
const tripFiltersComponent = new TripFiltersView();
render(tripFiltersContainer, tripFiltersComponent, RenderPosition.BEFOREEND);

const mainContainer = document.querySelector('.page-main');
const eventsContainer = mainContainer.querySelector('.trip-events');

if (sortedEvents.length === 0) {
  const noEventsComponent = new NoEventsView();
  render (eventsContainer, noEventsComponent, RenderPosition.BEFOREEND);
} else {
  const tripInfoComponent = new TripInfoView(sortedEvents);
  render(tripMainContainer, tripInfoComponent, RenderPosition.AFTERBEGIN);

  const tripInfoContainer = tripMainContainer.querySelector('.trip-info');
  const tripCostComponent = new TripCostView(sortedEvents);
  render(tripInfoContainer, tripCostComponent, RenderPosition.BEFOREEND);

  const eventsSortingComponent = new EventsSortingView();
  render(eventsContainer, eventsSortingComponent, RenderPosition.BEFOREEND);
  const eventsBoardComponent = new EventsBordView();
  render(eventsContainer, eventsBoardComponent, RenderPosition.BEFOREEND);

  const renderEvent = (eventsContainer, event) => {
    const eventComponent = new EventView(event);
    const editEventFormComponent = new EditEventFormView(event);
    render(eventsContainer, eventComponent, RenderPosition.BEFOREEND);

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
  };
  sortedEvents.forEach((event) => renderEvent(eventsBoardComponent, event));
}
