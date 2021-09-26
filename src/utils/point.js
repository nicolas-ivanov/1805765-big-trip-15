import { getDatesDiff, getDateHour }  from './date.js';
import { extraOptions } from '../mock/point.js';

export const sortByDays = (pointA, pointB) => getDatesDiff(pointA.startTime, pointB.startTime);

export const sortByPrice = (pointA, pointB) => pointA.basePrice - pointB.basePrice;

export const sortByTime = (pointA, pointB) => getDateHour(pointA.startTime) - getDateHour(pointB.startTime);

export const sortByEvents = (pointA, pointB) => pointA.pointType.localeCompare(pointB.pointType);

export const getOffersSumPrice = (pointType, selectedOffersIds) => {
  const offersForType = extraOptions[pointType];
  const selectedOffersData = offersForType.filter((offerData) => selectedOffersIds.includes(offerData.id));
  return selectedOffersData.map((offer) => offer.price).reduce((acc, a) => acc + a, 0);
};

export const getTotalPointPrice = (point) => (point.basePrice + getOffersSumPrice(point.pointType, point.offers));

export const getTotalPrice = (points) => (points.map((point) => getTotalPointPrice(point))).reduce((acc, a) => acc + a, 0);

export const getTotalDuration = (points) => (points.reduce((acc, point) => acc + getDatesDiff(point.endTime, point.startTime), 0));
