import PointPresenter from './point.js';
import SortingView from '../view/sorting.js';
import TripPointsListView from '../view/trip-points-list.js';
import NoPointsView from '../view/no-points.js';
import { render, RenderPosition} from '../utils/render.js';
import { SortType } from '../const.js';
import { sortByDays, sortByPrice, sortByTime, sortByEvents } from '../utils/point.js';


const _updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};


export default class Trip {
  constructor (tripListContainer, pointsModel) {
    this._pointsModel = pointsModel;
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

  _getPoints() {
    return this._pointsModel.getPoints();
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
      this._renderPoints();
    }
  }

  _clearTripList() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _handlePointChange(updatedPoint) {
    this._points = _updateItem(this._points, updatedPoint);
    this._sourcedPoints = _updateItem(this._sourcedPoints, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearTripList();
    this._renderTripList();
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
        this._points = this._sourcedPoints.slice();
    }

    this._currentSortType = sortType;
  }
}
