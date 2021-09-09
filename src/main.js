import { render, RenderPosition } from './utils/render.js';
import SiteMenuView from './view/site-menu.js';
import FiltersView from './view/filters.js';
import TripInfoView from './view/trip-info.js';
import TripListPresenter from './presenter/trip.js';
import { generatedPoints } from './mock/point.js';

const siteHeaderElement = document.querySelector('.trip-main');
const siteTripControlsElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const tripListContainer = document.querySelector('.trip-events');

const tripPresenter = new TripListPresenter(tripListContainer);

render(siteTripControlsElement, new SiteMenuView(), RenderPosition.AFTERBEGIN);
render(siteTripControlsElement, new FiltersView(), RenderPosition.BEFOREEND);
render(siteHeaderElement, new TripInfoView(generatedPoints), RenderPosition.AFTERBEGIN);

tripPresenter.init(generatedPoints);
