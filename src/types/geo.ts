export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface CityLocation extends LocationCoords {
  id?: number;
  name: string;
  country: string;
  countryCode?: string;
  admin1?: string;
  timezone?: string;
}

export interface GeocodingResultItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  timezone: string;
}

export interface GeocodingApiResponse {
  results?: GeocodingResultItem[];
}
