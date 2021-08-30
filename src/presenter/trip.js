import PointPresenter from './point.js';
import SortingView from '../view/sorting.js';
import TripPointsListView from '../view/trip-points-list.js';
import NoPointsView from '../view/no-points.js';
import { render, RenderPosition} from '../utils/render.js';
import { updateItem } from '../utils/common.js';
import { SortType } from '../const.js';
import { sortByDays, sortByPrice, sortByTime, sortByEvents } from '../utils/point.js';


export default class Trip {
  constructor (tripListContainer) {
    this._tripListContainer = tripListContainer;
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;

    this._noPointsComponent = new NoPointsView();
    this._sortingComponent = new SortingView();
    this._pointsListComponent = new TripPointsListView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    this._sourcedPoints = points.slice();
    render(this._tripListContainer, this._pointsListComponent, RenderPosition.BEFOREEND);
    this._renderTripList();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearTripList();
    this._renderTripList();
  }

  _renderNoPoints() {
    render(this._tripListContainer, this._noPointsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    render(this._tripListContainer, this._sortingComponent, RenderPosition.AFTERBEGIN);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPoint (point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderPoints() {
    this._points.forEach((point) => this._renderPoint(point));
  }

  _renderTripList() {
    if (this._points.length === 0) {
      this._renderNoPoints();
    } else {
      this._renderSort();
      // const siteEventsListElement = this._tripListContainer.querySelector('.trip-events__list');
      this._renderPoints();
    }
  }

  _clearTripList() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._sourcedPoints = updateItem(this._sourcedPoints, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _sortPoints(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    switch (sortType) {
      case SortType.DAY:
        this._points.sort(sortByDays);
        break;
      case SortType.EVENT:
        this._points.sort(sortByEvents);
        break;
      case SortType.TIME:
        this._points.sort(sortByTime);
        break;
      case SortType.PRICE:
        this._points.sort(sortByPrice);
        break;
      default:
        this._points = this._sourcedBoardTasks.slice();
    }

    this._currentSortType = sortType;
  }
}
