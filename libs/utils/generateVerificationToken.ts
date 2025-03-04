/**
 * @description This method generates a verification token consisting of random text characters.
 * @param length The number of characters to be in the token. Defaults to 25.
 * @param characters A string representing the characters to be used to generate the token.
 * @returns A token.
 */
export const generateVerificationToken = (
  length = 25,
  characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
): string => {
  let token = '';
  for (let i = 0; i < length; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};
