import {EVENTS_COUNT} from './const';
import EventsModel from './model/events';
import FilterModel from './model/filter';
import OffersModel from './model/offers';
import TripPresenter from './presenter/trip';
import FiltersPresenter from './presenter/filters';
import TripInfoPresener from './presenter/trip-info';
import TripNavView from './view/navigation';
import {generateEvent} from './mock/event';
import {render, remove, RenderPosition} from './utils/render';
import {MenuItem} from './const';
import StatsView from './view/stats';
import Api from './api';

const USER = 'Wh_Frost';
const AUTHORIZATION = `Basic ${USER}`;
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const api = new Api(END_POINT, AUTHORIZATION);

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

const offersModel = new OffersModel();
const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filtersModel = new FilterModel();

const mainContainer = document.querySelector('.page-main');
const tripBoardContainer = mainContainer.querySelector('.trip-events');
const headerContainer = document.querySelector('.page-header');
const tripMainContainer = headerContainer.querySelector('.trip-main');
const tripNavContainer = headerContainer.querySelector('.trip-controls__navigation');
const tripFiltersContainer = headerContainer.querySelector('.trip-controls__filters');
const addEventButtonElement = document.querySelector('.trip-main__event-add-btn');

const tripNavComponent = new TripNavView();
render(tripNavContainer, tripNavComponent, RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(tripBoardContainer, eventsModel, filtersModel);
const filtersPresenter = new FiltersPresenter(tripFiltersContainer, filtersModel, eventsModel);
const tripInfoPresenter = new TripInfoPresener(tripMainContainer, eventsModel);

let statsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  tripNavComponent.changeMode(menuItem);
  filtersPresenter.changeMode(menuItem);
  switch (menuItem) {
    case MenuItem.TABLE:
      addEventButtonElement.disabled = false;
      tripPresenter.init();
      remove(statsComponent);
      break;
    case MenuItem.STATISTICS:
      addEventButtonElement.disabled = true;
      tripPresenter.destroy();
      statsComponent = new StatsView(eventsModel.getEvents());
      render(tripBoardContainer, statsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

tripNavComponent.setNavClickHandler(handleSiteMenuClick);

tripPresenter.init();
filtersPresenter.init();
tripInfoPresenter.init();

addEventButtonElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});

// api.getEvents().then((events) => {

// });
api.getOffers().then((offers) => {
  offersModel.setOffers(offers);
  offersModel.getOffers();
});
