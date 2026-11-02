export interface ReverseGeocodeResult {
  name: string;
  country: string;
  countryCode?: string;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (!res.ok) {
      throw new Error(`Reverse geocode returned status ${res.status}`);
    }
    const data = await res.json();
    const name = data.city || data.locality || data.principalSubdivision || 'Current Location';
    const country = data.countryName || 'GPS';
    return {
      name,
      country,
      countryCode: data.countryCode,
    };
  } catch {
    return {
      name: 'Current Location',
      country: 'GPS',
    };
  }
}
