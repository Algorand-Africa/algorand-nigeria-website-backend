export const findMostFrequent = (arr: string[]) => {
  let frequency = {};
  let maxFreq = 0;

  arr.forEach((str) => {
    const upperStr = str.toUpperCase();
    frequency[upperStr] = (frequency[upperStr] || 0) + 1;
    if (frequency[upperStr] > maxFreq) {
      maxFreq = frequency[upperStr];
    }
  });

  let result = [];
  for (let str in frequency) {
    if (frequency[str] === maxFreq) {
      result.push(str);
    }
  }

  return result;
};

export const getMappedValues = (
  arr: string[],
  stack: { [key: string]: string },
) => {
  const stackarray = findMostFrequent(arr);
  return stackarray.map((str) => stack[str]);
};
