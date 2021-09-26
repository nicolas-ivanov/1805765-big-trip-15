import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<div class="trip-filters__filter">
        <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" 
          value="${type}" 
          ${type === currentFilterType ? 'checked' : ''} 
          ${count === 0 ? 'disabled' : ''} 
        >
        <label class="trip-filters__filter-label" for="filter-${type}">
          ${name} <span class="filter__${name}-count">${count}</span>
        </label>
    </div>`
  );
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<div class="trip-controls__filters">
      <h2 class="visually-hidden">Filter events</h2>
      <form class="trip-filters" action="#" method="get">
        ${filterItemsTemplate}

        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    </div>`;
};

export default class FiltersView extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter) ;
  }

  _filterTypeChangeHandler(evt) {
    const goodLabels = ['LABEL', 'SPAN'];

    if (!(goodLabels.includes(evt.target.tagName))) {
      return;
    }

    const labelElement = evt.target.tagName === 'SPAN' ? evt.target.parentNode : evt.target;
    const inputId = labelElement.getAttribute('for');
    const filterType = document.getElementById(inputId).getAttribute('value');

    evt.preventDefault();
    this._callback.filterTypeChange(filterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }

}
