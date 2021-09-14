import { extraOptions } from '../mock/point.js';
import { getDatesDiff } from '../utils/date.js';

export const getOffersSumPrice = (pointType, selectedOffersIds) => {
  const offersForType = extraOptions[pointType];
  const selectedOffersData = offersForType.filter((offerData) => selectedOffersIds.includes(offerData.id));
  return selectedOffersData.map((offer) => offer.price).reduce((acc, a) => acc + a, 0);
};

export const getTotalPointPrice = (point) => (point.basePrice + getOffersSumPrice(point.pointType, point.offers));

export const getTotalPrice = (points) => (points.map((point) => getTotalPointPrice(point))).reduce((acc, a) => acc + a, 0);

export const getTotalDuration = (points) => (points.reduce((acc, point) => acc + getDatesDiff(point.endTime, point.startTime), 0));
