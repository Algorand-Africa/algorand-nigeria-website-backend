export function isValidDomain(domain: string): boolean {
  // check if it follows format xxx.xxx or xxx.xxx.xxx
  const domainParts = domain.split('.');
  if (domainParts.length > 3 || domainParts.length < 2) {
    return false;
  }
  // check if each part is alphanumeric
  for (const part of domainParts) {
    if (!/^[a-z0-9]+$/i.test(part)) {
      return false;
    }
  }
  return true;
}
