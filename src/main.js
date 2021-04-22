import {EVENTS_COUNT} from './const';
import {sortingEventsByDate} from './utils/event';
import TripPresenter from './presenter/trip';
import {generateEvent} from './mock/event';

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);
const sortedEvents = sortingEventsByDate(events);

const mainContainer = document.querySelector('.page-main');
const tripBoardContainer = mainContainer.querySelector('.trip-events');

const tripPresenter = new TripPresenter(tripBoardContainer);
tripPresenter.init(sortedEvents);
