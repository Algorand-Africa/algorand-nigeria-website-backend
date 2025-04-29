/**
 * Cleans a string by removing or escaping potential SQL injection risks
 * @param input The string to be sanitized
 * @returns The cleaned string
 */
export function cleanSqlString(input: string): string {
  if (!input) return '';

  // Remove common SQL commands and characters that could be used maliciously
  const sanitized = input
    // Remove SQL commands
    .replace(
      /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b/gi,
      '',
    )
    // Remove special SQL characters
    .replace(/[;'"\\]/g, '')
    // Remove comments
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    // Remove multiple spaces
    .trim()
    .replace(/\s+/g, ' ');

  return sanitized;
}
