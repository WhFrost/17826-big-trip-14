import {EVENTS_COUNT} from './const';
import TripPresenter from './presenter/trip';
import {generateEvent} from './mock/event';

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

const mainContainer = document.querySelector('.page-main');
const tripBoardContainer = mainContainer.querySelector('.trip-events');

const tripPresenter = new TripPresenter(tripBoardContainer);
tripPresenter.init(events);
