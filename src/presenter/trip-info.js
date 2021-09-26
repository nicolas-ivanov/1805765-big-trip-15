import TripInfoView from '../view/trip-info.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';
import { sortByDays  } from '../utils/point.js';

export default class TripInfo {
  constructor(infoContainer, pointsModel) {
    this._infoContainer = infoContainer;
    this._pointsModel = pointsModel;

    this._infoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevInfoComponent = this._infoComponent;
    const sortedPoints = this._pointsModel.getPoints().sort(sortByDays);
    this._infoComponent = new TripInfoView(sortedPoints);

    if (prevInfoComponent === null) {
      render(this._infoContainer, this._infoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._infoComponent, prevInfoComponent);
    remove(prevInfoComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
