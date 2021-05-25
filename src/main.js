import {EVENTS_COUNT} from './const';
import EventsModel from './model/evets';
import TripPresenter from './presenter/trip';
import {generateEvent} from './mock/event';

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

const mainContainer = document.querySelector('.page-main');
const tripBoardContainer = mainContainer.querySelector('.trip-events');

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const tripPresenter = new TripPresenter(tripBoardContainer, eventsModel);
tripPresenter.init();
