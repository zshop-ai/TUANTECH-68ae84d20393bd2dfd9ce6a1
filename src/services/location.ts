import { API_CONFIG } from "../config/api";
import { apiGetPublic } from "../utils/api";

export interface LocationPrediction {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
  types?: string[];
}

export interface AutocompleteResponse {
  predictions: LocationPrediction[];
  status: string;
  error?: string;
}

class LocationService {
  private buildUrl(input: string): string {
    const base = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOCATION_AUTOCOMPLETE}`;
    const params = new URLSearchParams({ input });
    return `${base}?${params.toString()}`;
  }

  async autocomplete(input: string): Promise<AutocompleteResponse> {
    if (!input || !input.trim()) {
      return { predictions: [], status: "ZERO_RESULTS" };
    }
    const url = this.buildUrl(input.trim());
    return apiGetPublic<AutocompleteResponse>(url);
  }
}

export const locationService = new LocationService();
