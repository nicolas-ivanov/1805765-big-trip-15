import AbstractView from './abstract.js';

export default class NoPoints extends AbstractView {
  getTemplate () {
    return `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>

      <p class="trip-events__msg">Click New Event to create your first point</p>
    </section>`;
  }
}
