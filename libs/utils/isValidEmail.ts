export function isValidEmail(email: string): boolean {
  // Regular expression for matching email addresses
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test the email string against the regular expression
  return regex.test(email);
}
