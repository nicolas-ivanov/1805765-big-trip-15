import {FilterType} from '../const';
import {isDateInPast} from './date';

export const filter = {
  [FilterType.ALL]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => isDateInPast(point.endTime)),
  [FilterType.FUTURE]: (points) => points.filter((point) => !isDateInPast(point.startTime)),
  [FilterType.FAVORITES]: (points) => points.filter((point) => point.isFavorite),
};
