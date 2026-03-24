export interface WeatherResponse {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  advice: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  weatherData?: WeatherResponse;
  weatherStyles?: {
    icon: React.ReactNode;
    temperature: number;
    temperatureColor: string;
    bgColor: string;
    description: string;
    humidity: number;
    advice: string;
  };
}
