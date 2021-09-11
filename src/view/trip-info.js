import AbstractView from './abstract.js';
import { formatDate } from '../utils/date.js';
import { extraOptions } from '../mock/point.js';

export default class TripInfoView extends AbstractView {
  constructor (tripPoints) {
    super();
    this._tripPoints = tripPoints;
  }

  _getOffersSumPrice (pointType, selectedOffersIds) {
    const offersForType = extraOptions[pointType];
    const selectedOffersData = offersForType.filter((offerData) => selectedOffersIds.includes(offerData.id));
    return selectedOffersData.map((offer) => offer.price).reduce((accumulator, a) => accumulator + a, 0);
  }

  getTemplate () {
    let startTime = null;
    let endTime = null;

    if (this._tripPoints.length > 0) {
      startTime = formatDate(this._tripPoints[0].startTime, 'D MMM');
      endTime = formatDate(this._tripPoints[this._tripPoints.length - 1].endTime, 'D MMM');
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
      ${this._tripPoints.map(
    (point) => point.basePrice + this._getOffersSumPrice(point.pointType, point.offers),
  ).reduce((accumulator, a) => accumulator + a, 0)}
      </span>
    </p>
  </section>`;
  }
}
