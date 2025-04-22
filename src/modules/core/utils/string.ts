export const generatePassword = (length = 8): string => {
  let password = '';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specials = '!@#$%^&*()';

  const categories = [uppercase, lowercase, numbers, specials];

  categories.forEach((category) => {
    const randomChar = category[Math.floor(Math.random() * category.length)];
    password += randomChar;
  });

  for (let i = categories.length; i < length; i++) {
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomChar =
      randomCategory[Math.floor(Math.random() * randomCategory.length)];

    password += randomChar;
  }

  return password;
};

export const generateRandomOTP = (length = 6): string => {
  return Math.random()
    .toString()
    .slice(2, length + 2);
};

export function truncateString(string: string, length = 8): string {
  return string.slice(0, length);
}

export const generateRandomString = (length = 12): string => {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
};

export function convertToUrlFormat(inputString: string) {
  // Replace special characters and spaces with "-"
  const urlFriendlyString: string = inputString
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  // Remove multiple hyphens
  return urlFriendlyString.replace(/-{2,}/g, '-');
}

/**
 * @description This generates a one-time-pin consisting of digits.
 * @param numOfDigits Number of digits the pin should have. Default is 6.
 * @returns One-time-pin
 */
export const generateOtp = (numOfDigits = 6): string => {
  let otp = '';

  for (let i = 0; i < numOfDigits; i++) {
    const extraDigit = Math.round(Math.random() * 9).toString();
    otp += extraDigit;
  }

  return otp;
};
