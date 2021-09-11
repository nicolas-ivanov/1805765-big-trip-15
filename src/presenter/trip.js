import PointPresenter from './point.js';
import SortingView from '../view/sorting.js';
import TripPointsListView from '../view/trip-points-list.js';
import NoPointsView from '../view/no-points.js';
import { render, RenderPosition} from '../utils/render.js';
import { SortType } from '../const.js';
import { sortByDays, sortByPrice, sortByTime, sortByEvents } from '../utils/point.js';

export default class Trip {
  constructor (tripListContainer, pointsModel) {
    this._pointsModel = pointsModel;
    this._tripListContainer = tripListContainer;
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;

    this._noPointsComponent = new NoPointsView();
    this._sortingComponent = new SortingView();
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
    render(this._tripListContainer, this._sortingComponent, RenderPosition.AFTERBEGIN);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
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

  _clearTripList() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _handlePointChange(updatedPoint) {
    // Здесь будем вызывать обновление модели
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  }

  _handleModelEvent(updateType, data) {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
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
