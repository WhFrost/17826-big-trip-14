import {EVENTS_COUNT} from './const';
import EventsModel from './model/events';
import FilterModel from './model/filter';
import TripPresenter from './presenter/trip';
import FiltersPresenter from './presenter/filters';
import TripInfoPresener from './presenter/trip-info';
import TripNavView from './view/navigation';
import {generateEvent} from './mock/event';
import {render, RenderPosition} from './utils/render';
import {MenuItem} from './const';

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

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

const handleSiteMenuClick = (menuItem) => {
  tripNavComponent.changeMode(menuItem);
  filtersPresenter.changeMode(menuItem);
  switch (menuItem) {
    case MenuItem.TABLE:
      addEventButtonElement.disabled = false;
      tripPresenter.init();
      // Скрыть статистику
      break;
    case MenuItem.STATISTICS:
      addEventButtonElement.disabled = true;
      tripPresenter.destroy();
      // Показать статистику
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
