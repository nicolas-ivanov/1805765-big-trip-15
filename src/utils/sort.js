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
