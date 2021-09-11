import PointPresenter from './point.js';
import SortingView from '../view/sorting.js';
import TripPointsListView from '../view/trip-points-list.js';
import NoPointsView from '../view/no-points.js';
import { render, RenderPosition, remove} from '../utils/render.js';
import { SortType, UpdateType, UserAction } from '../const.js';
import { sortByDays, sortByPrice, sortByTime, sortByEvents } from '../utils/point.js';

export default class Trip {
  constructor (tripListContainer, pointsModel) {
    this._pointsModel = pointsModel;
    this._tripListContainer = tripListContainer;
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;

    this._noPointsComponent = new NoPointsView();
    this._pointsListComponent = new TripPointsListView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._tripListContainer, this._pointsListComponent, RenderPosition.BEFOREEND);
    this._renderTripList();
  }

  _getPoints() {
    switch (this._currentSortType) {
      case SortType.DAY:
        return this._pointsModel.getPoints().slice().sort(sortByDays);
      case SortType.EVENT:
        return this._pointsModel.getPoints().slice().sort(sortByEvents);
      case SortType.TIME:
        return this._pointsModel.getPoints().slice().sort(sortByTime);
      case SortType.PRICE:
        return this._pointsModel.getPoints().slice().sort(sortByPrice);
    }

    return this._pointsModel.getPoints();
  }

  _renderNoPoints() {
    render(this._tripListContainer, this._noPointsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortingView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripListContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderPoints(points) {
    points.forEach((point) => this._renderPoint(point));
  }

  _renderTripList() {
    const points = this._getPoints();
    const pointsCount = points.length;

    if (pointsCount === 0) {
      this._renderNoPoints();
    } else {
      this._renderSort();
      this._renderPoints(points);
    }
  }

  _clearTripList({resetSortType = false} = {}) {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    remove(this._sortComponent);
    remove(this._noPointsComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _handlePointChange(updatedPoint) {
    // Здесь будем вызывать обновление модели
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearTripList();
        this._renderTripList();
        break;
      case UpdateType.MAJOR:
        this._clearTripList({resetSortType: true});
        this._renderTripList();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTripList();
    this._renderTripList();
  }
}
