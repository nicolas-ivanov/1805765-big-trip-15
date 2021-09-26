import AbstractObserver from '../utils/abstract-observer.js';

export default class Points extends AbstractObserver {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();

    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        startTime: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
        endTime: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
        basePrice: point['base_price'],
        isFavorite: point['is_favorite'],
        pointType: point['type'],
        description: point['destination'].description,
        photos: point['destination'].pictures.map((photo) => (photo.src)),
        destination: point['destination'].name,
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['is_favorite'];
    delete adaptedPoint['type'];

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'date_from': point.startTime instanceof Date ? point.startTime.toISOString() : null,
        'date_to': point.endTime instanceof Date ? point.endTime.toISOString() : null,
        'base_price': point.basePrice,
        'is_favorite': point.isFavorite,
        'type': point.pointType,
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.startTime;
    delete adaptedPoint.endTime;
    delete adaptedPoint.basePrice;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.pointType;
    delete adaptedPoint.photos;
    delete adaptedPoint.description;

    return adaptedPoint;
  }
}
