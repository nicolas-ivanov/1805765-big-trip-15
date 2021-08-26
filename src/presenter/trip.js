import PointPresenter from './point.js';
import SortingView from '../view/sorting.js';
import TripPointsListView from '../view/trip-points-list.js';
import NoPointsView from '../view/no-points.js';
import { render, RenderPosition} from '../utils/render.js';
import { updateItem } from '../utils/common.js';

export default class Trip {
  constructor (tripListContainer) {
    this._tripListContainer = tripListContainer;
    this._pointPresenter = new Map();

    this._noPointsComponent = new NoPointsView();
    this._sortingComponent = new SortingView();
    this._pointsListComponent = new TripPointsListView();

    this._handlePointChange = this._handlePointChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    render(this._tripListContainer, this._pointsListComponent, RenderPosition.BEFOREEND);
    this._renderTripList();
  }

  _renderNoPoints() {
    render(this._tripListContainer, this._noPointsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    render(this._tripListContainer, this._sortingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint (point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._handlePointChange);
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
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }
}
