import apiClient from './apiClient';

export const weatherApi = {
  getWeather: async (city: string) => {
    try {
      const response = await apiClient.get(`/weather?city=${encodeURIComponent(city)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
