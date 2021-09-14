import { render, RenderPosition } from './utils/render.js';
import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import TripListPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import TripInfoPresenter from './presenter/trip-info.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import { generatedPoints } from './mock/point.js';
import { MenuItem, UpdateType, FilterType } from './const.js';

const pointsModel = new PointsModel();
pointsModel.setPoints(generatedPoints);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.trip-main');
const siteTripControlsElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const tripListContainer = document.querySelector('.trip-events');

const siteMenuComponent = new SiteMenuView();
render(siteTripControlsElement, siteMenuComponent, RenderPosition.AFTERBEGIN);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_TASK:
      // Скрыть статистику
      TripListPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
      TripListPresenter.init();
      break;
    case MenuItem.TASKS:
      TripListPresenter.init();
      // Скрыть статистику
      break;
    case MenuItem.STATISTICS:
      TripListPresenter.destroy();
      // Показать статистику
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

const tripInfoPresenter = new TripInfoPresenter(siteHeaderElement, pointsModel);
tripInfoPresenter.init();

const filterPresenter = new FilterPresenter(siteTripControlsElement, filterModel, pointsModel);
filterPresenter.init();

// const tripPresenter = new TripListPresenter(tripListContainer, pointsModel, filterModel);
// tripPresenter.init();

// document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
//   evt.preventDefault();
//   tripPresenter.createPoint();
// });

render(tripListContainer, new StatisticsView(pointsModel.getPoints()), RenderPosition.BEFOREEND);
