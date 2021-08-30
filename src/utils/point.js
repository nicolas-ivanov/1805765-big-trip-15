import dayjs from 'dayjs';

export const sortByDays = (pointA, pointB) => dayjs(pointA.startTime).diff(dayjs(pointB.startTime));

export const sortByPrice = (pointA, pointB) => pointA.basePrice - pointB.basePrice;

export const sortByTime = (pointA, pointB) => dayjs(pointA.startTime).hour() - dayjs(pointB.startTime).hour();

export const sortByEvents = (pointA, pointB) => pointA.pointType.localeCompare(pointB.pointType);
