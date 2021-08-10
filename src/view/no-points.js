import { createElement } from '../utils.js';

export default class NoPoints {
  constructor () {
    this._element = null;
  }

  getTemplate () {
    return `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>

      <p class="trip-events__msg">Click New Event to create your first point</p>
    </section>`;
  }

  getElement () {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement () {
    this._element = null;
  }
}
