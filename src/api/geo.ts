import apiClient from "./http/axios-client";

import { notification } from "../service/notification";

class GeoService {
  async fetchAddresses(query: string) {
    const key = import.meta.env.VITE_DADATA_TOKEN;
    const url =
      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

    try {
      const response = await apiClient.post(
        url,
        JSON.stringify({ 
          count: 5,
          locations: { kladr_id: "37" },
          query, 
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Token ${key}`,
          },
        }
      );

      if (!response.data?.suggestions) {
        return [];
      }

      return response.data?.suggestions || [];
    } catch (error) {
      throw new Error(`Fetch address. ${error}`);
    }
  }
}

export default new GeoService();