import {render, RenderPosition, replace} from '../utils/render.js';
import TripPointView from '../view/trip-point.js';
import TripPointEditView from '../view/edit-point.js';

export default class Point {
  constructor (pointsListContainer) {
    this._pointsListContainer = pointsListContainer;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCollapseClick = this._handleCollapseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;

    this._pointComponent = new TripPointView(point);
    this._pointEditComponent = new TripPointEditView(point);

    this._pointComponent.setClickHandler(this._handleEditClick);
    this._pointEditComponent.setSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setClickHandler(this._handleCollapseClick);

    render(this._pointsListContainer, this._pointComponent, RenderPosition.BEFOREEND);
  }

  _replaceCardToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _replaceFormToCard() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFormSubmit() {
    this._replaceFormToCard();
  }

  _handleCollapseClick() {
    this._replaceFormToCard();
  }

}
