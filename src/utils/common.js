export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
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

export const toggleValueInArray = (arr, value) => {
  const index = arr.indexOf(value);

  if (index === -1) {
    arr.push(value);
  } else {
    arr.splice(index, 1);
  }

  return arr;
};

export const isNotEmptyInput = (input) => !!input.value.trim().length;
