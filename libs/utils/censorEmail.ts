import { isValidEmail } from './isValidEmail';

export function censorEmail(email: string) {
  if (!isValidEmail(email)) return email;

  const [firstSection, secondSection] = email.split('@');
  const tempValue = firstSection.length - 1;
  const numOfAsterix = tempValue > 10 ? 10 : tempValue;
  const asterixs = Array.from({ length: numOfAsterix })
    .map(() => '*')
    .join('');

  return `${firstSection.substring(0, 2)}${asterixs}@${secondSection}`;
}
