import {EVENTS_COUNT, RenderPosition} from './const';
import {render, renderElement, sortingEventsByDate} from './utils/utils';
import TripInfoView from './view/info';
import TripCostView from './view/cost';
import TripNavView from './view/navigation';
import TripFiltersView from './view/filters';
import {createEventsSorting} from './view/sorting';
import {createEventsBord} from './view/board';
import {createEditEventForm} from './view/edit-event';
import {createAddEventForm} from './view/add-event';
import {createEvent} from './view/event';
import {generateEvent} from './mock/event';

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);
const sortedEvents = sortingEventsByDate(events);

const headerContainer = document.querySelector('.page-header');
const tripMainContainer = headerContainer.querySelector('.trip-main');

const tripInfoComponent = new TripInfoView(sortedEvents);
renderElement(tripMainContainer, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);
const tripInfoContainer = tripMainContainer.querySelector('.trip-info');

const tripCostComponent = new TripCostView(sortedEvents);
renderElement(tripInfoContainer, tripCostComponent.getElement(), RenderPosition.BEFOREEND);

const tripNavContainer = headerContainer.querySelector('.trip-controls__navigation');
const tripNavComponent = new TripNavView();
renderElement(tripNavContainer, tripNavComponent.getElement(), RenderPosition.BEFOREEND);

const tripFiltersContainer = headerContainer.querySelector('.trip-controls__filters');
const tripFiltersComponent = new TripFiltersView();
renderElement(tripFiltersContainer, tripFiltersComponent.getElement(), RenderPosition.BEFOREEND);

const mainContainer = document.querySelector('.page-main');
const eventsContainer = mainContainer.querySelector('.trip-events');
const eventsSortingElement = createEventsSorting();
render(eventsContainer, eventsSortingElement, 'beforeend');
const eventsBoardElement = createEventsBord();
render(eventsContainer, eventsBoardElement, 'beforeend');

const eventsBoardContainer = mainContainer.querySelector('.trip-events__list');
const editEventFormElement = createEditEventForm(sortedEvents[0]);
render(eventsBoardContainer, editEventFormElement, 'afterbegin');

sortedEvents.forEach((event) => {
  const eventElement = createEvent(event);
  render(eventsBoardContainer, eventElement, 'beforeend');
});


const addEventFormElement = createAddEventForm(sortedEvents[sortedEvents.length-1]);
render(eventsBoardContainer, addEventFormElement, 'beforeend');
