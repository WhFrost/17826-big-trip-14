import {EVENTS_COUNT, RenderPosition} from './const';
import {render, sortingEventsByDate} from './utils/utils';
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
render(tripNavContainer, tripNavComponent.getElement(), RenderPosition.BEFOREEND);

const tripFiltersContainer = headerContainer.querySelector('.trip-controls__filters');
const tripFiltersComponent = new TripFiltersView();
render(tripFiltersContainer, tripFiltersComponent.getElement(), RenderPosition.BEFOREEND);

const mainContainer = document.querySelector('.page-main');
const eventsContainer = mainContainer.querySelector('.trip-events');

if (sortedEvents.length === 0) {
  const noEventsComponent = new NoEventsView();
  render (eventsContainer, noEventsComponent.getElement(), RenderPosition.BEFOREEND);
} else {
  const tripInfoComponent = new TripInfoView(sortedEvents);
  render(tripMainContainer, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);

  const tripInfoContainer = tripMainContainer.querySelector('.trip-info');
  const tripCostComponent = new TripCostView(sortedEvents);
  render(tripInfoContainer, tripCostComponent.getElement(), RenderPosition.BEFOREEND);

  const eventsSortingComponent = new EventsSortingView();
  render(eventsContainer, eventsSortingComponent.getElement(), RenderPosition.BEFOREEND);
  const eventsBoardComponent = new EventsBordView();
  render(eventsContainer, eventsBoardComponent.getElement(), RenderPosition.BEFOREEND);

  const renderEvent = (eventsContainer, event) => {
    const eventComponent = new EventView(event);
    const editEventFormComponent = new EditEventFormView(event);
    render(eventsContainer, eventComponent.getElement(), RenderPosition.BEFOREEND);

    const replaceEventToEditEventForm = () => {
      eventsContainer.replaceChild(editEventFormComponent.getElement(), eventComponent.getElement());
    };
    const replaceEditEventFormToEvent = () => {
      eventsContainer.replaceChild(eventComponent.getElement(), editEventFormComponent.getElement());
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
    editEventFormComponent.setFormSubmitClickHandler((evt) => {
      replaceEditEventFormToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });
  };
  sortedEvents.forEach((event) => renderEvent(eventsBoardComponent.getElement(), event));
}
