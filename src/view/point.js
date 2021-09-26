import he from 'he';
import AbstractView from './abstract.js';
import { getTimeDiffDisplay, formatDate } from '../utils/date.js';
import { extraOptions } from '../mock/point.js';

export default class TripPointView extends AbstractView {
  constructor (pointData) {
    super();
    this._pointData = pointData;
    this._clickHandler = this._clickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  get startTime() {
    return this._pointData.startTime;
  }

  get basePrice() {
    return this._pointData.basePrice;
  }

  get destination() {
    return this._pointData.destination;
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._clickHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }

  removeElement () {
    this.getElement().querySelector('.event__rollup-btn').removeEventListener('click', this._clickHandler);
    this.getElement().querySelector('.event__favorite-btn').removeEventListener('click', this._favoriteClickHandler);
    super.removeElement();
  }

  _getOffersDisplay (offers) {
    return offers.map((offer) => `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`).join('');
  }

  getTemplate () {
    const start = this._pointData.startTime;
    const end = this._pointData.endTime;
    const selectedOffersData = extraOptions[this._pointData.pointType].filter((option) => this._pointData.offers.includes(option.id));

    return `<li class="trip-events__item">
    <div class="event">
    <time class="event__date" datetime="${formatDate(start, 'YYYY-MM-DD')}">${formatDate(start, 'D MMM')}</time>
    <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${this._pointData.pointType}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${this._pointData.pointType} ${he.encode(this._pointData.destination)}</h3>
    <div class="event__schedule">
        <p class="event__time">
        <time class="event__start-time" datetime="2019-03-18Thh:mm">${formatDate(start, 'HH:mm')}</time>
        &mdash;
        <time class="event__end-time" datetime="${formatDate(end, 'YYYY-MM-DDThh:mm')}">${formatDate(end, 'HH:mm')}</time>
        </p>
        <p class="event__duration">${getTimeDiffDisplay(start, end)}</p>
    </div>
    <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${he.encode(this._pointData.basePrice.toString())}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
        ${this._getOffersDisplay(selectedOffersData)}
    </ul>
    <button class="event__favorite-btn event__favorite-btn${this._pointData.isFavorite ? '--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
    </button>
    <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
    </button>
    </div>
    </li>`;
  }
}
