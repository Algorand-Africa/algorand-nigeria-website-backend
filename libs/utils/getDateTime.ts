export const getDateTime = (date = Date.now()) => {
  const dateObject = new Date(date);
  const timeString = dateObject.toTimeString().split(' ').slice(0, 2).join(' ');
  const dateString = dateObject.toDateString().split(' ').slice(1).join(' ');

  return dateString + ' at ' + timeString + '.';
};
