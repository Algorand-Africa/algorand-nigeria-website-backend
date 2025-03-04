import { DateTime } from 'luxon';

export const getDateMinutesInTheFuture = (minutes: number): Date => {
  return DateTime.local().plus({ minutes }).toJSDate();
};
