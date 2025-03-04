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
