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

export const toggleValueInArray = (arrOriginal, value) => {
  const arr = arrOriginal.slice();
  const index = arr.indexOf(value);

  if (index === -1) {
    arr.push(value);
  } else {
    arr.splice(index, 1);
  }

  return arr;
};

export const isNotEmptyInput = (input) => !!input.value.trim().length;

export const simultaneousSort = (arr1, arr2) => {
  const list = [];
  for (let j = 0; j < arr1.length; j++) {
    list.push({'arr1': arr1[j], 'arr2': arr2[j]});
  }

  list.sort((a, b) => ((a.arr1 < b.arr1) ? 1 : -1));

  const sortedArr1 = [];
  const sortedArr2 = [];

  for (let k = 0; k < arr1.length; k++) {
    sortedArr1[k] = list[k].arr1;
    sortedArr2[k] = list[k].arr2;
  }

  return [sortedArr1, sortedArr2];
};
