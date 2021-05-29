import EventsModel from './model/events';
import FilterModel from './model/filter';
import OffersModel from './model/offers';
import DestinationsModel from './model/destinations';
import TripPresenter from './presenter/trip';
import FiltersPresenter from './presenter/filters';
import TripInfoPresener from './presenter/trip-info';
import TripNavView from './view/navigation';
import StatsView from './view/stats';
import {render, remove, RenderPosition} from './utils/render';
import {MenuItem, UpdateType} from './const';
import Api from './api';

const USER = 'Wh_Frost';
const AUTHORIZATION = `Basic ${USER}`;
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const api = new Api(END_POINT, AUTHORIZATION);

const mainContainer = document.querySelector('.page-main');
const tripBoardContainer = mainContainer.querySelector('.trip-events');
const headerContainer = document.querySelector('.page-header');
const tripMainContainer = headerContainer.querySelector('.trip-main');
const tripNavContainer = headerContainer.querySelector('.trip-controls__navigation');
const tripFiltersContainer = headerContainer.querySelector('.trip-controls__filters');
const addEventButtonElement = document.querySelector('.trip-main__event-add-btn');

const tripNavComponent = new TripNavView();
render(tripNavContainer, tripNavComponent, RenderPosition.BEFOREEND);

const offersModel = new OffersModel();
export const availableOffers = offersModel.getOffers();
const eventsModel = new EventsModel();
const filtersModel = new FilterModel();
const destinationsModel = new DestinationsModel();
export const availableDestinations = destinationsModel.getDestinations();

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

addEventButtonElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});

Promise.all([api.getEvents(), api.getDestinations(), api.getOffers()])
  .then(([events, destinations, offers]) => {
    offersModel.setOffers(offers);
    destinationsModel.setDestinations(destinations);
    eventsModel.setEvents(UpdateType.INIT, events);
    filtersPresenter.init();
    tripInfoPresenter.init();
  });
