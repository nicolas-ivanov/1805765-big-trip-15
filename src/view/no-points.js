import AbstractView from './abstract.js';
import {FilterType} from '../const.js';

const NoPointsTextType = {
  [FilterType.ALL]: 'Click «New Event» to create your first point',
  [FilterType.PAST]: 'There are no past points',
  [FilterType.FUTURE]: 'There are no future points',
};

const createNoPointsTemplate = (filterType) => {
  const noPointsTextValue = NoPointsTextType[filterType];

  return `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>
      <p class="trip-events__msg">${noPointsTextValue}</p>
    </section>`;
};

export default class NoPointsView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createNoPointsTemplate(this._data);
  }
}
