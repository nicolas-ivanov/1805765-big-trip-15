import dayjs from 'dayjs';
import AbstractView from './abstract.js';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export default class TripPointView extends AbstractView {
  constructor (pointData) {
    super();
    this._pointData = pointData;
    this._clickHandler = this._clickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
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

  _getTimeDiffDisplay (startTime, endTime) {
    const durationObj = dayjs.duration(endTime.diff(startTime));

    if (durationObj.hours() < 1) {
      return durationObj.format('mm[M]');
    } else if (durationObj.hours() < 24) {
      return durationObj.format('HH[H] mm[M]');
    } else {
      return durationObj.format('dd[D] HH[H] mm[M]');
    }
  }

  _getOffersDisplay (offers) {
    return offers.map((offer) => `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`).join('');
  }

  getTemplate () {
    const startTime = dayjs(this._pointData.startTime);
    const endTime = dayjs(this._pointData.endTime);

    return `<li class="trip-events__item">
    <div class="event">
    <time class="event__date" datetime="${startTime.format('YYYY-MM-DD')}">${startTime.format('D MMM')}</time>
    <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${this._pointData.pointType}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${this._pointData.pointType} ${this._pointData.destination}</h3>
    <div class="event__schedule">
        <p class="event__time">
        <time class="event__start-time" datetime="2019-03-18Thh:mm">${startTime.format('HH:mm')}</time>
        &mdash;
        <time class="event__end-time" datetime="${endTime.format('YYYY-MM-DDThh:mm')}">${endTime.format('HH:mm')}</time>
        </p>
        <p class="event__duration">${this._getTimeDiffDisplay(startTime, endTime)}</p>
    </div>
    <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${this._pointData.basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
        ${this._getOffersDisplay(this._pointData.offers)}
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