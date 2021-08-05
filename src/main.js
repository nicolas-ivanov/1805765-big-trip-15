import { siteMenu } from './view/site-menu.js';
import { siteFilters } from './view/filters.js';
import { tripInfo } from './view/trip-info.js';
import { tripCost } from './view/trip-cost.js';
import { sortingForm } from './view/sorting.js';
import { tripPoint } from './view/trip-point.js';
import { newPointForm } from './view/add-new-point.js';
import { editTripPointForm } from './view/edit-point.js';
import { generatedPoints, emptyPoint } from './fixtures.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.trip-main');
const siteTripControlsElement = siteHeaderElement.querySelector('.trip-controls__navigation');

render(siteTripControlsElement, siteMenu(), 'afterbegin');
render(siteTripControlsElement, siteFilters(), 'beforeend');
render(siteHeaderElement, tripInfo(generatedPoints), 'afterbegin');

const siteTripInfoElement = siteHeaderElement.querySelector('.trip-main__trip-info');
render(siteTripInfoElement, tripCost(generatedPoints), 'beforeend');

const siteEventsElement = document.querySelector('.trip-events');
render(siteEventsElement, sortingForm(), 'afterbegin');

const siteEventsListElement = document.querySelector('.trip-events__list');
render(siteEventsListElement, newPointForm(emptyPoint), 'beforeend');

const rollDownButtonHandler = ({ target }) => {
  const pointInfo = document.getElementById('trip-point-short-info_' + target.dataset.pointId);
  pointInfo.classList.toggle('visually-hidden');

  const pointDetails = document.getElementById('trip-point-detailed-info_' + target.dataset.pointId);
  pointDetails.classList.toggle('visually-hidden');
};

generatedPoints.forEach((point, index) => {
  const idShort = 'trip-point-short-info_' + index;
  render(siteEventsListElement, tripPoint(point, idShort), 'beforeend');

  const pointElement = document.getElementById(idShort);
  const rollDownButton = pointElement.querySelector('.event__rollup-btn');
  rollDownButton.dataset.pointId = index;
  rollDownButton.addEventListener('click', rollDownButtonHandler);

  const idDetails = 'trip-point-detailed-info_' + index;
  render(siteEventsListElement, editTripPointForm(point, idDetails), 'beforeend');

  const pointInfoElement = document.getElementById(idDetails);
  const rollUpButton = pointInfoElement.querySelector('.event__rollup-btn');
  rollUpButton.dataset.pointId = index;
  rollUpButton.addEventListener('click', rollDownButtonHandler);
});
