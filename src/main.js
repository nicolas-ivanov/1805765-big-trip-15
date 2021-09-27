import { render, RenderPosition, remove } from './utils/render.js';
import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import TripListPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import TripInfoPresenter from './presenter/trip-info.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import { MenuItem, UpdateType, FilterType } from './const.js';
import Api from './api.js';

const token = (Math.random() + 1).toString(36).substring(3);
const AUTHORIZATION = `Basic ${ token }`;
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.trip-main');
const siteTripControlsElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const tripListContainer = document.querySelector('.trip-events');

const tripInfoPresenter = new TripInfoPresenter(siteHeaderElement, pointsModel);
tripInfoPresenter.init();

const filterPresenter = new FilterPresenter(siteTripControlsElement, filterModel, pointsModel);
filterPresenter.init();

const tripPresenter = new TripListPresenter(tripListContainer, pointsModel, filterModel, api);
tripPresenter.init();

const siteMenuComponent = new SiteMenuView();

let statisticsComponent = null;
let currentMenuItem = MenuItem.POINTS;

const handlePointNewFormClose = () => {
  document.querySelector('.trip-main__event-add-btn').disabled = false;
};

const handleSiteMenuClick = (menuItem) => {
  if (menuItem === currentMenuItem) {
    return;
  }
  currentMenuItem = menuItem;
  siteMenuComponent.setMenuItem(currentMenuItem);

  switch (menuItem) {
    case MenuItem.POINTS:
      tripPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(tripListContainer, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  remove(statisticsComponent);
  tripPresenter.destroy();

  currentMenuItem = MenuItem.POINTS;
  siteMenuComponent.setMenuItem(currentMenuItem);

  filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
  tripPresenter.init();
  tripPresenter.createPoint(handlePointNewFormClose);
  document.querySelector('.trip-main__event-add-btn').disabled = true;
});

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
    render(siteTripControlsElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    render(siteTripControlsElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });
