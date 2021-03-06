import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { getRandomInteger } from './common.js';

dayjs.extend(duration);

export const getTimeDiffDisplayFromMSec = (milliseconds) => {
  const durationObj = dayjs.duration(milliseconds);

  if (durationObj.days() >= 1) {
    return durationObj.format('D[D] HH[H] mm[M]');
  } else if (durationObj.hours() >= 1) {
    return durationObj.format('HH[H] mm[M]');
  } else {
    return durationObj.format('mm[M]');
  }
};

export const getTimeDiffDisplay = (startTime, endTime) => {
  const start = dayjs(startTime);
  const end = dayjs(endTime);

  return getTimeDiffDisplayFromMSec(end.diff(start));
};

export const formatDate = (date, formatString) => dayjs(date).format(formatString);

export const generateDatePair = () => {
  const start = dayjs().add(getRandomInteger(-100, 100), 'hour').minute(0);
  const minutesValues = [30, 60, 90, 1440, 1470, 1500, 1560];
  const end = start.add(minutesValues[getRandomInteger(0, minutesValues.length - 1)], 'minutes');

  return [start.toDate(), end.toDate()];
};

export const getDatesDiff = (dateA, dateB) => dayjs(dateA).diff(dayjs(dateB));

export const getDateHour = (date) => dayjs(date).hour();

export const getCurrentDate = () => dayjs().toDate();

export const isDatesEqual = (dateA, dateB) => {
  (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'D');
};

export const isDateInPast = (date) => getDatesDiff(dayjs(), date) > 0;
