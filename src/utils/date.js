
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);


export const getTimeDiffDisplay = (startTime, endTime) => {
  const start = dayjs(startTime);
  const end = dayjs(endTime);
  const durationObj = dayjs.duration(end.diff(start));

  if (durationObj.hours() < 1) {
    return durationObj.format('mm[M]');
  } else if (durationObj.hours() < 24) {
    return durationObj.format('HH[H] mm[M]');
  } else {
    return durationObj.format('dd[D] HH[H] mm[M]');
  }
};

export const formatDate = (date, formatString) => dayjs(date).format(formatString);
