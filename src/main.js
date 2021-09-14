import { render, RenderPosition } from './utils/render.js';
import SiteMenuView from './view/site-menu.js';
import TripListPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import TripInfoPresenter from './presenter/trip-info.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import { generatedPoints } from './mock/point.js';

const pointsModel = new PointsModel();
pointsModel.setPoints(generatedPoints);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.trip-main');
const siteTripControlsElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const tripListContainer = document.querySelector('.trip-events');

render(siteTripControlsElement, new SiteMenuView(), RenderPosition.AFTERBEGIN);

const tripInfoPresenter = new TripInfoPresenter(siteHeaderElement, pointsModel);
tripInfoPresenter.init();

const filterPresenter = new FilterPresenter(siteTripControlsElement, filterModel, pointsModel);
filterPresenter.init();

const tripPresenter = new TripListPresenter(tripListContainer, pointsModel, filterModel);
tripPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
