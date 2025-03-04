//function that takes a number of minutes and returns a string in the format of "x h y m".
//If the number of minutes is less than 60, it should return a string in the format of "x m".

//If the number of minutes is 60 or more, it should return a string in the format of "x h y ms".

// export function parseMinutes(minutes: number) {
//   const hours = Math.floor(minutes / 60);
//   const minute = minutes % 60;
//   const hourString = hours > 0 ? `${hours}h ` : '';
//   const minuteString = minute > 0 ? `${minute}m` : '';
//   return hourString + minuteString;
// }

export function parseMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  if (hours <= 0) {
    return remainingMinutes + 'm';
  }

  return `${hours}h ${remainingMinutes}m`;
}
