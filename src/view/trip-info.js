import AbstractView from './abstract.js';
import { formatDate } from '../utils/date.js';
import { getTotalPrice } from '../utils/point.js';

export default class TripInfoView extends AbstractView {
  constructor (tripPoints) {
    super();
    this._tripPoints = tripPoints;
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
      ${ getTotalPrice(this._tripPoints) }
      </span>
    </p>
  </section>`;
  }
}
