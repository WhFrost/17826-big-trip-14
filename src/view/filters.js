import AbstractView from './abstract';

const createFilterTemplate = (filter, currentFilterType) => {
  const {name, type, count} = filter;
  return `<div class="trip-filters__filter">
  <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
    ${type === currentFilterType ? 'checked' : ''}
    ${count === 0 ? 'disabled' : ''}
    value="${type}">
  <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
</div>`;
};

const createTripFilters = (filters, currentFilterType) => {
  const filtersTemplate = filters.map((filter) => createFilterTemplate(filter, currentFilterType)).join('');

  return `<form class="trip-filters" action="#" method="get">
    ${filtersTemplate}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;
};

export default class TripFilters extends AbstractView {
  constructor(filter, currentFilterType) {
    super();
    this._filter = filter;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }
  getTemplate() {
    return createTripFilters(this._filter, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}
