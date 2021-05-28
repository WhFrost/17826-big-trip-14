import TripFiltersView from '../view/filters';
import {render, RenderPosition, replace, remove} from '../utils/render';
import {filter} from '../utils/filters';
import {MenuItem, FilterType, UpdateType} from '../const';

export default class Filters {
  constructor(filtersContainer, filtersModel, eventsModel) {
    this._filtersContainer = filtersContainer;
    this._filtersModel = filtersModel;
    this._eventsModel = eventsModel;

    this._filtersComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFiltersComponent = this._filtersComponent;

    this._filtersComponent = new TripFiltersView(filters, this._filtersModel.getFilter());
    this._filtersComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFiltersComponent === null) {
      render(this._filtersContainer, this._filtersComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filtersComponent, prevFiltersComponent);
    remove(prevFiltersComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filtersModel.getFilter() === filterType) {
      return;
    }
    this._filtersModel.setFilter(UpdateType.MAJOR, filterType);
  }

  changeMode(menuItem) {
    const actualFilterEvents = this._getFilters().slice().reduce((sum, {type, count}) => ({...sum, [type]: count}), {});
    switch (menuItem) {
      case MenuItem.TABLE:
        this._filtersComponent.getInputsItems().forEach((input) => {
          if (actualFilterEvents[input.value] > 0) {
            input.disabled = false;
            return;
          }
          input.disabled = true;
        });
        break;
      case MenuItem.STATISTICS:
        this._filtersComponent.getInputsItems().forEach((input) => input.disabled = true);
        break;
    }
  }

  _getFilters() {
    const events = this._eventsModel.getEvents();

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'everything',
        count: filter[FilterType.EVERYTHING](events).length,
      },
      {
        type: FilterType.FUTURE,
        name: 'future',
        count: filter[FilterType.FUTURE](events).length,
      },
      {
        type: FilterType.PAST,
        name: 'past',
        count: filter[FilterType.PAST](events).length,
      },
    ];
  }
}
