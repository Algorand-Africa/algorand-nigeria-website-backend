export function formatPhoneNumber(phoneNo: string): string {
  if (phoneNo.startsWith('0')) {
    return `234${phoneNo.slice(1)}`;
  }
  if (phoneNo.startsWith('+2340')) {
    return `234${phoneNo.slice(5)}`;
  }
  if (phoneNo.startsWith('+234')) {
    return phoneNo.slice(1);
  }
  if (phoneNo.startsWith('2340')) {
    return `234${phoneNo.slice(4)}`;
  }
  return phoneNo;
}
