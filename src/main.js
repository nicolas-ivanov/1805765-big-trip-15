import {siteMenu} from './view/site-menu.js';
import {siteFilters} from './view/filters.js';
import {tripInfo} from './view/trip-info.js';
import {tripCost} from './view/trip-cost.js';
import {sortingForm} from './view/sorting.js';
import {tripPoint, createTripListTemplate} from './view/trip-point.js';
import {newPointForm} from './view/add-new-point.js';
import {editTripPointForm} from './view/edit-point.js';

const POINTS_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.trip-main');
const siteTripControlsElement = siteHeaderElement.querySelector('.trip-controls__navigation');

render(siteTripControlsElement, siteMenu(), 'afterbegin');
render(siteTripControlsElement, siteFilters(), 'beforeend');
render(siteHeaderElement, tripInfo(), 'afterbegin');

const siteTripInfoElement = siteHeaderElement.querySelector('.trip-main__trip-info');
render(siteTripInfoElement, tripCost(), 'beforeend');

const siteEventsElement = document.querySelector('.trip-events');
render(siteEventsElement, sortingForm(), 'beforeend');
render(siteEventsElement, createTripListTemplate(), 'beforeend');

const siteEventsListElement = document.querySelector('.trip-events__list');
render(siteEventsListElement, newPointForm(), 'beforeend');

for (let i = 0; i < POINTS_COUNT; i++) {
    render(siteEventsListElement, tripPoint(), 'beforeend');
}

render(siteEventsListElement, editTripPointForm(), 'beforeend');
