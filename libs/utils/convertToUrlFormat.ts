export function convertToUrlFormat(inputString: string) {
  // Replace special characters and spaces with "-"
  const urlFriendlyString: string = inputString
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  return urlFriendlyString.toLowerCase();
}

export function isUrlFormat(inputString: string) {
  return inputString === convertToUrlFormat(inputString);
}
