import dayjs from 'dayjs';

export const add = (accumulator, a) => accumulator + a;

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const generateDatePair = () => {
  const start = dayjs().add(getRandomInteger(0, 100), 'hour').minute(0);
  const minutesValues = [30, 60, 90, 1440, 1470, 1500, 1560];
  const end = start.add(minutesValues[getRandomInteger(0, minutesValues.length - 1)], 'minutes');

  return [start.toDate(), end.toDate()];
};

export const getRandomArrayElements = (arr, arrLength) => {
  const result = [];
  const arrIndexes = arr.map((item, idx) => idx);

  while (result.length !== arrLength) {
    const idx = getRandomInteger(0, arrIndexes.length - 1);
    result.push(arr[arrIndexes[idx]]);

    arrIndexes.splice(idx, 1);
  }
  return result;
};
