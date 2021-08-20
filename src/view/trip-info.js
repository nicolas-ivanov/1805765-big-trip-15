import dayjs from 'dayjs';
import AbstractView from './abstract.js';
import { add } from '../utils/common.js';

export default class TripInfo extends AbstractView {
  constructor (tripPoints) {
    super();
    this._tripPoints = tripPoints;
  }

  _getOffersSumPrice (offers) {
    return offers.map((offer) => offer.price).reduce(add, 0);
  }

  getTemplate () {
    let [startTime, endTime] = [null, null];

    if (this._tripPoints.length > 0) {
      startTime = dayjs(this._tripPoints[0].startTime).format('D MMM');
      endTime = dayjs(this._tripPoints[this._tripPoints.length - 1].endTime).format('D MMM');
    }

    return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">
        ${this._tripPoints.map((point) => (point.destination)).join(' &mdash; ')}
      </h1>

      ${this._tripPoints.length > 0 ? `<p class="trip-info__dates">${startTime}&nbsp;&mdash;&nbsp;${endTime}</p>` : ''}
      
    </div>
      <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">
      ${this._tripPoints.map((point) => point.basePrice + this._getOffersSumPrice(point.offers)).reduce(add, 0)}
      </span>
    </p>
  </section>`;
  }
}
