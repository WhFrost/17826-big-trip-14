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
import {toast} from './utils/toast.js';
import {MenuItem, UpdateType, MessageWhenOffline, TITLE_OFFLINE} from './const';
import {isOnline} from './utils/common.js';
import Api from './api/api';
import Store from './api/store.js';
import Provider from './api/provider.js';

const USER = 'Frost';
const AUTHORIZATION = `Basic ${USER}`;
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'Big-trip-localstorage';
const STORE_VER = 'v14';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const mainContainer = document.querySelector('.page-main');
const tripBoardContainer = mainContainer.querySelector('.trip-events');
const headerContainer = document.querySelector('.page-header');
const tripMainContainer = headerContainer.querySelector('.trip-main');
const tripNavContainer = headerContainer.querySelector('.trip-controls__navigation');
const tripFiltersContainer = headerContainer.querySelector('.trip-controls__filters');
const addEventButtonElement = headerContainer.querySelector('.trip-main__event-add-btn');

const tripNavComponent = new TripNavView();
render(tripNavContainer, tripNavComponent, RenderPosition.BEFOREEND);

const offersModel = new OffersModel();
const eventsModel = new EventsModel();
const filtersModel = new FilterModel();
const destinationsModel = new DestinationsModel();

const tripPresenter = new TripPresenter(tripBoardContainer, eventsModel, filtersModel, apiWithProvider);
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

addEventButtonElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  if (!isOnline()) {
    toast(MessageWhenOffline.NEW_EVENT);
    return;
  }
  tripPresenter.createEvent();
});

Promise.all([apiWithProvider.getDestinations(), apiWithProvider.getOffers(), apiWithProvider.getEvents()])
  .then(([destinations, offers, events]) => {
    destinationsModel.setDestinations(destinations);
    offersModel.setOffers(offers);
    eventsModel.setEvents(UpdateType.INIT, events);
    filtersPresenter.init();
    tripInfoPresenter.init();
    tripNavComponent.setNavClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    destinationsModel.setDestinations([]);
    offersModel.setOffers([]);
    eventsModel.setEvents(UpdateType.INIT, []);
    tripNavComponent.setNavClickHandler(handleSiteMenuClick);
  });

tripPresenter.init();

// window.addEventListener('load', () => {
//   navigator.serviceWorker.register('/sw.js');
// });

// window.addEventListener('online', () => {
//   document.title = document.title.replace(TITLE_OFFLINE, '');
//   apiWithProvider.sync();
//   toast(MessageWhenOffline.RECONNECT);
// });

// window.addEventListener('offline', () => {
//   toast(MessageWhenOffline.DISCONNECT);
//   document.title += TITLE_OFFLINE;
// });

export {
  offersModel,
  destinationsModel
};
