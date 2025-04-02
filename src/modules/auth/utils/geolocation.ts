import axios from 'axios';
import { Request } from 'express';
import * as requestIp from 'request-ip';

export function getIpAddress(req: Request): string {
  return requestIp.getClientIp(req) || 'Unknown';
}

export async function getLocationByIp(
  ip: string,
): Promise<{ city: string; country: string }> {
  if (!ip || ip == 'Unknown') {
    return { city: null, country: null };
  }

  const apiUrl = `http://www.geoplugin.net/json.gp?ip=${ip}`;

  try {
    const response = await axios.get(apiUrl);
    const responseData = response.data;
    const { geoplugin_city, geoplugin_countryName } = responseData;

    return { city: geoplugin_city, country: geoplugin_countryName };
  } catch (error) {
    return { city: null, country: null };
  }
}
