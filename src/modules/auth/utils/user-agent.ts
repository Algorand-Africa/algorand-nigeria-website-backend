import { UAParser } from 'ua-parser-js';

export function parseUserAgent(userAgent: string): {
  os: string;
  browser: string;
  deviceType: string;
} {
  const parser = UAParser(userAgent);

  const { os, browser, device } = parser;

  return {
    os: os.name,
    browser: browser.name,
    deviceType: device.type,
  };
}
