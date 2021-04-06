import {EVENTS_COUNT} from './const';
import {render} from './utils/utils';
import {createTripInfo} from './view/info';
import {createTripCost} from './view/cost';
import {createTripNav} from './view/navigation';
import {createTripFilters} from './view/filters';
import {createEventsSorting} from './view/sorting';
import {createEventsBord} from './view/board';
import {createEditEventForm} from './view/edit-event';
import {createAddEventForm} from './view/add-event';
import {createEvent} from './view/event';
import {generateEvent} from './mock/event';

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);
// console.log(events);

const headerContainer = document.querySelector('.page-header');
const tripMainContainer = headerContainer.querySelector('.trip-main');
const tripInfoElement = createTripInfo(events);
render (tripMainContainer, tripInfoElement, 'afterbegin');
const tripInfoContainer = tripMainContainer.querySelector('.trip-info');
const tripCostElement = createTripCost(events);
render (tripInfoContainer, tripCostElement, 'beforeend');

const tripNavContainer = headerContainer.querySelector('.trip-controls__navigation');
const tripNavElement = createTripNav();
render(tripNavContainer, tripNavElement, 'beforeend');

const tripFiltersContainer = headerContainer.querySelector('.trip-controls__filters');
const tripFiltersElement = createTripFilters();
render(tripFiltersContainer, tripFiltersElement, 'beforeend');

const mainContainer = document.querySelector('.page-main');
const eventsContainer = mainContainer.querySelector('.trip-events');
const eventsSortingElement = createEventsSorting();
render(eventsContainer, eventsSortingElement, 'beforeend');
const eventsBoardElement = createEventsBord();
render(eventsContainer, eventsBoardElement, 'beforeend');

const eventsBoardContainer = mainContainer.querySelector('.trip-events__list');
const editEventFormElement = createEditEventForm(events[0]);
render(eventsBoardContainer, editEventFormElement, 'afterbegin');

events.forEach((event) => {
  const eventElement = createEvent(event);
  render(eventsBoardContainer, eventElement, 'beforeend');
});


const addEventFormElement = createAddEventForm(events[0]);
render(eventsBoardContainer, addEventFormElement, 'beforeend');
