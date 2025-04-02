export const minutesFromNow = (minutes: number): Date => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);

  return new Date(date);
};

export const addDays = (days: number, date = new Date()): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  return result;
};
