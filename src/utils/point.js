import { getDatesDiff, getDateHour }  from './date.js';

export const sortByDays = (pointA, pointB) => getDatesDiff(pointA.startTime, pointB.startTime);

export const sortByPrice = (pointA, pointB) => pointA.basePrice - pointB.basePrice;

export const sortByTime = (pointA, pointB) => getDateHour(pointA.startTime) - getDateHour(pointB.startTime);

export const sortByEvents = (pointA, pointB) => pointA.pointType.localeCompare(pointB.pointType);
