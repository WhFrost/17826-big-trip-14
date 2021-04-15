import {EVENTS_COUNT, RenderPosition} from './const';
import {render, renderElement, sortingEventsByDate} from './utils/utils';
import TripInfoView from './view/info';
import TripCostView from './view/cost';
import TripNavView from './view/navigation';
import TripFiltersView from './view/filters';
import EventsSortingView from './view/sorting';
import EventsBordView from './view/board';
import EditEventFormView from './view/edit-event';
import AddEventFormView from './view/add-event';
import EventView from './view/event';
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
const eventsSortingComponent = new EventsSortingView();
renderElement(eventsContainer, eventsSortingComponent.getElement(), RenderPosition.BEFOREEND);
const eventsBoardComponent = new EventsBordView();
renderElement(eventsContainer, eventsBoardComponent.getElement(), RenderPosition.BEFOREEND);

const eventsBoardContainer = mainContainer.querySelector('.trip-events__list');
const editEventFormComponent = new EditEventFormView(sortedEvents[0]);
renderElement(eventsBoardContainer, editEventFormComponent.getElement(), RenderPosition.AFTERBEGIN);

sortedEvents.forEach((event) => {
  const eventComponent = new EventView(event);
  renderElement(eventsBoardContainer, eventComponent.getElement(), RenderPosition.BEFOREEND);
});


const addEventFormComponent = new AddEventFormView(sortedEvents[sortedEvents.length-1]);
renderElement(eventsBoardContainer, addEventFormComponent.getElement(), RenderPosition.BEFOREEND);
