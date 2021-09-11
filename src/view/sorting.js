import AbstractView from './abstract.js';
import { SortType } from '../const.js';

export default class SortingView extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }

    const inputId = evt.target.getAttribute('for');
    const sortType = document.getElementById(inputId).getAttribute('value');
    this._callback.sortTypeChange(sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }

  removeElement () {
    this.getElement().removeEventListener('click', this._sortTypeChangeHandler);
    super.removeElement();
  }

  getTemplate () {
    return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <div class="trip-sort__item  trip-sort__item--day">
      <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${ SortType.DAY }" 
      ${ (this._currentSortType === SortType.DAY || this._currentSortType === SortType.DEFAULT) ? 'checked' : '' } >
      <label class="trip-sort__btn" for="sort-day">Day</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${ SortType.EVENT }"
      ${ this._currentSortType === SortType.EVENT ? 'checked' : '' } >
      <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
      <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${ SortType.TIME }"
      ${ this._currentSortType === SortType.TIME ? 'checked' : '' } >
      <label class="trip-sort__btn" for="sort-time">Time</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
      <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${ SortType.PRICE }"
      ${ this._currentSortType === SortType.PRICE ? 'checked' : '' } >
      <label class="trip-sort__btn" for="sort-price">Price</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--offer">
      <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${ SortType.OFFER }" disabled>
      <label class="trip-sort__btn" for="sort-offer">Offers</label>
      </div>
    </form>`;
  }
}
