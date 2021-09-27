import SmartView from './smart.js';
import { cities, extraOptions, BLANK_POINT } from '../mock/point.js';
import { formatDate, getDatesDiff } from '../utils/date.js';
import { toggleValueInArray, isNotEmptyInput } from '../utils/common.js';
import { createElement } from '../utils/render.js';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';


const DATES_LABELS = {
  startTime: '#event-start-time-1',
  endTime: '#event-end-time-1',
};


export default class PointEditView extends SmartView {
  constructor (pointData = BLANK_POINT) {
    super();
    this._data = pointData;
    this._datepicker = null;

    this._rollUpClickHandler = this._rollUpClickHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._chooseEventTypeClickHandler = this._chooseEventTypeClickHandler.bind(this);
    this._chooseOffersClickHandler = this._chooseOffersClickHandler.bind(this);
    this._basePriceInputHandler = this._basePriceInputHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
    this._isSubmitEnabled = this._updateSubmitButtonEnabled();
  }

  _setDatepicker() {
    if (this._datepicker) {
      this._datepicker.delete();
    }
    this._datepicker = new Map();

    Object.entries(DATES_LABELS).forEach(([dateLabel, dateID]) => {

      // flatpickr есть смысл инициализировать только в случае,
      // если поле выбора даты доступно для заполнения
      if (this._data[dateLabel]) {
        this._datepicker.set(dateLabel, flatpickr(
          this.getElement().querySelector(dateID),
          {
            enableTime: true,
            dateFormat: 'y/m/d H:i',
            defaultDate: this._data[dateLabel],
            onChange: ([userDate]) => {
              this.updateData({
                [dateLabel]: userDate,
              }, true);
              this._updateSubmitButtonEnabled();
            },
          },
        ));
      }
    });
  }

  _rollUpClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollUpClick();
  }

  setRollUpClickHandler(callback) {
    this._callback.rollUpClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollUpClickHandler);
  }

  _chooseEventTypeClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'LABEL') {
      return;
    }

    const inputId = evt.target.getAttribute('for');
    const inputElement = document.getElementById(inputId);

    this.updateData({
      pointType: inputElement.getAttribute('value'),
    });
  }

  _chooseOffersClickHandler(evt) {
    const goodLabels = ['LABEL', 'SPAN'];

    if (!(goodLabels.includes(evt.target.tagName))) {
      return;
    }

    const inputElement = evt.target.tagName === 'SPAN' ? evt.target.parentNode : evt.target;
    const offerid = inputElement.dataset.offerid;

    this.updateData({
      offers: toggleValueInArray(this._data.offers, offerid),
    }, true);
  }

  _updateSubmitButtonEnabled() {
    const destination = this.getElement().querySelector('.event__input--destination');
    const startTime = this.getElement().querySelector('#event-start-time-1');
    const endTime = this.getElement().querySelector('#event-end-time-1');
    const price = this.getElement().querySelector('.event__input--price');

    const inputs = [destination, startTime, endTime, price];
    const prevIsSubmitEnabled = this._isSubmitEnabled;
    const isDateRangeConsistent = getDatesDiff(this._data.endTime, this._data.startTime) > 0;
    this._isSubmitEnabled = inputs.every(isNotEmptyInput) && isDateRangeConsistent;

    if (this._isSubmitEnabled !== prevIsSubmitEnabled) {
      const prevSubmitBtn = this.getElement().querySelector('.event__save-btn');
      const parent = prevSubmitBtn.parentElement;
      const newSubmitBtn = createElement(`<button class="event__save-btn  btn  btn--blue" type="submit" ${this._isSubmitEnabled ? '' : 'disabled'}>Save</button>`);
      parent.replaceChild(newSubmitBtn, prevSubmitBtn);
    }
  }

  _basePriceInputHandler(evt) {
    evt.preventDefault();
    this._updateSubmitButtonEnabled();
    this.updateData({
      basePrice: parseInt(evt.target.value, 10),
    }, true);
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    const selectedCity = cities.filter( (city) => city.name === evt.target.value )[0] || '';

    if (!selectedCity) {
      this.updateData({
        destination: evt.target.value,
        description: '',
        photos: [],
      });
      return;
    }

    this.updateData({
      destination: selectedCity.name,
      description: selectedCity.description,
      photos: selectedCity.photos,
    });
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._data);
  }

  setSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener('submit', this._submitHandler);
  }

  removeElement () {
    this.getElement().querySelector('.event__rollup-btn').removeEventListener('click', this._clickHandler);
    this.getElement().removeEventListener('submit', this._submitHandler);
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.delete();
      this._datepicker = null;
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setRollUpClickHandler(this._callback.rollUpClick);
    this._setDatepicker();
    this._isSubmitEnabled = this._updateSubmitButtonEnabled();
  }

  _setInnerHandlers() {
    Array.from(this.getElement().getElementsByClassName('event__type-item')).forEach((element) => {
      element.addEventListener('click', this._chooseEventTypeClickHandler);
    });

    Array.from(this.getElement().getElementsByClassName('event__offer-label')).forEach((element) => {
      element.addEventListener('click', this._chooseOffersClickHandler);
    });

    this.getElement().querySelector('.event__input--price').addEventListener('input', this._basePriceInputHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._destinationChangeHandler);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    const parsedPoint = PointEditView.parseDataToPoint(this._data);
    this._callback.deleteClick(parsedPoint);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }


  static parsePointToData(point) {
    const pointData = Object.assign(
      {},
      point,
      {
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    return pointData;
  }

  static parseDataToPoint(data) {
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return Object.assign({}, data);
  }

  reset(pointOriginal) {
    this.updateData(
      PointEditView.parsePointToData(pointOriginal),
    );
  }

  _getOffersDisplay (defaultOffers, selectedOffersIDs) {
    return defaultOffers.map((offer) => `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" 
        type="checkbox" name="event-offer-${offer.id}" ${selectedOffersIDs.includes(offer.id) ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${offer.id}" data-offerid="${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`).join('');
  }

  _getPhotosTemplate (photos) {
    if (photos === null) {
      return '';
    }
    return photos.map((photo) => (
      `<img class="event__photo" src='${photo}' alt="Event photo">`
    )).join('');
  }

  _getDescriptionDisplay() {
    if (!this._data.description) {
      return '';
    }

    return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${this._data.description || '' }</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${this._getPhotosTemplate(this._data.photos)}
      </div>
    </div>
  </section>`;
  }

  getTemplate () {
    const {
      startTime,
      endTime,
      isDisabled,
      isSaving,
      isDeleting,
    } = this._data;

    return `<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${this._data.pointType}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

            <div class="event__type-item">
              <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
              <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
              <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
              <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
              <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight">
              <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${this._data.pointType}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._data.destination || ''}" list="destination-list-1"
          pattern="${cities.map((city) => city.name).join('|')}"
          title='Must be ${cities.map((city) => `"${ city.name }"`).join(' or ')}'
          ${isDisabled ? 'disabled' : ''}
        >
        <datalist id="destination-list-1">
          ${cities.map((city) => (`<option value="${  city.name  }"></option>`)).join('')}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(startTime, 'DD/MM/YY HH:mm')}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(endTime, 'DD/MM/YY HH:mm')}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${this._data.basePrice || ''}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${this._isSubmitEnabled ? '' : 'disabled'}>${isSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset">${isDeleting ? 'deleting...' : 'delete'}</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${this._getOffersDisplay(extraOptions[this._data.pointType], this._data.offers)}
        </div>
      </section>

      ${this._getDescriptionDisplay()}
    </section>
  </form>`;
  }
}
