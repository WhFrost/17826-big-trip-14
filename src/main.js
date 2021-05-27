import {EVENTS_COUNT} from './const';
import EventsModel from './model/events';
import FilterModel from './model/filter';
import TripPresenter from './presenter/trip';
import FiltersPresenter from './presenter/filters';
import {generateEvent} from './mock/event';
import {tripFiltersContainer} from './const';

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

const mainContainer = document.querySelector('.page-main');
const tripBoardContainer = mainContainer.querySelector('.trip-events');
const addEventButtonElement = document.querySelector('.trip-main__event-add-btn');

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filtersModel = new FilterModel();
const filtersPresenter = new FiltersPresenter(tripFiltersContainer, filtersModel, eventsModel);
filtersPresenter.init();

const tripPresenter = new TripPresenter(tripBoardContainer, eventsModel, filtersModel);
tripPresenter.init();

addEventButtonElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});
