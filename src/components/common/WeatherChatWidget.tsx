'use client';

import { useState, useRef, useEffect } from 'react';
import { weatherApi } from '@/services/api/weatherApi';
import { WeatherResponse, ChatMessage } from '@/types/weather';

export function WeatherChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getWeatherIcon = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'clear': return '☀️';
      case 'clouds': return '☁️';
      case 'rain': return '🌧️';
      case 'snow': return '❄️';
      case 'thunderstorm': return '⛈️';
      case 'mist':
      case 'fog': return '🌫️';
      case 'drizzle': return '🌦️';
      default: return '🌤️';
    }
  };

  const getAnimatedWeatherIcon = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'clear':
        return <span className="inline-block animate-pulse">☀️</span>;
      case 'clouds':
        return <span className="inline-block animate-bounce">☁️</span>;
      case 'rain':
        return <span className="inline-block animate-pulse">🌧️</span>;
      case 'snow':
        return <span className="inline-block animate-bounce" style={{ animationDuration: '2s' }}>❄️</span>;
      case 'thunderstorm':
        return <span className="inline-block animate-pulse" style={{ animationDuration: '0.5s' }}>⛈️</span>;
      case 'mist':
      case 'fog':
        return <span className="inline-block animate-pulse" style={{ animationDuration: '3s' }}>🌫️</span>;
      case 'drizzle':
        return <span className="inline-block animate-pulse" style={{ animationDuration: '1.5s' }}>🌦️</span>;
      default:
        return <span className="inline-block animate-pulse">🌤️</span>;
    }
  };

  const getTemperatureColor = (temperature: number) => {
    if (temperature >= 35) return 'from-red-500 to-orange-600'; // Rất nóng
    if (temperature >= 30) return 'from-orange-500 to-yellow-600'; // Nóng
    if (temperature >= 25) return 'from-yellow-500 to-amber-600'; // Ấm
    if (temperature >= 20) return 'from-green-500 to-emerald-600'; // Mát
    if (temperature >= 15) return 'from-blue-500 to-cyan-600'; // Lạnh mát
    if (temperature >= 10) return 'from-blue-600 to-indigo-600'; // Lạnh
    return 'from-indigo-600 to-purple-600'; // Rất lạnh
  };

  const getTemperatureBgColor = (temperature: number) => {
    if (temperature >= 35) return 'bg-red-50 border-red-200'; // Rất nóng
    if (temperature >= 30) return 'bg-orange-50 border-orange-200'; // Nóng
    if (temperature >= 25) return 'bg-yellow-50 border-yellow-200'; // Ấm
    if (temperature >= 20) return 'bg-green-50 border-green-200'; // Mát
    if (temperature >= 15) return 'bg-blue-50 border-blue-200'; // Lạnh mát
    if (temperature >= 10) return 'bg-indigo-50 border-indigo-200'; // Lạnh
    return 'bg-purple-50 border-purple-200'; // Rất lạnh
  };

  const formatWeatherResponse = (data: WeatherResponse): string => {
    return `${getWeatherIcon(data.condition)} ${data.description}
🌡️ Nhiệt độ: ${data.temperature}°C
💧 Độ ẩm: ${data.humidity}%
💡 Lời khuyên: ${data.advice}`;
  };

  const getWeatherMessageWithStyles = (data: WeatherResponse) => {
    return {
      icon: getAnimatedWeatherIcon(data.condition),
      temperature: data.temperature,
      temperatureColor: getTemperatureColor(data.temperature),
      bgColor: getTemperatureBgColor(data.temperature),
      description: data.description,
      humidity: data.humidity,
      advice: data.advice
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await weatherApi.getWeather(userMessage.content);
      
      if (response.data) {
        const weatherStyles = getWeatherMessageWithStyles(response.data);
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: formatWeatherResponse(response.data),
          timestamp: new Date(),
          weatherData: response.data,
          weatherStyles: weatherStyles
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: '❌ Không thể lấy thông tin thời tiết. Vui lòng kiểm tra lại tên thành phố.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: '❌ Đã xảy ra lỗi khi kết nối đến máy chủ. Vui lòng thử lại sau.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <div className="relative group">
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <span className="text-2xl">🌤️</span>
          </button>
          {/* Tooltip */}
          <div className="absolute bottom-full right-full mb-2 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform scale-95 group-hover:scale-100">
            <div className="bg-gray-900 text-white text-sm px-4 py-3 rounded-xl whitespace-nowrap shadow-xl border border-gray-700">
              Nhìn thử thời tiết trước để đi khám thoải mái hơn nhé!
              <div className="absolute top-full right-2 -mt-1">
                <div className="border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 text-white p-4 rounded-t-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-xl">🌤️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Thời tiết</h3>
                  <p className="text-xs text-blue-100">Hỗ trợ thời tiết 24/7</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-linear-to-b from-gray-50 to-white">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🌤️</span>
                </div>
                <p className="text-gray-600 font-medium mb-1">Xin chào!</p>
                <p className="text-gray-400 text-xs">Nhập tên thành phố để xem thời tiết</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg ${
                    message.type === 'user'
                      ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-blue-200'
                      : message.weatherStyles 
                        ? `${message.weatherStyles.bgColor} text-gray-800 shadow-gray-100 border`
                        : 'bg-white text-gray-800 shadow-gray-100 border border-gray-100'
                  }`}
                >
                  <div className="text-xs opacity-50 mb-1">
                      {formatTime(message.timestamp)}
                    </div>
                  <div className="text-xs opacity-70 mb-1">
                    {message.type === 'user' ? 'Bạn' : 'Hỗ trợ thời tiết'}
                  </div>
                  {message.weatherStyles ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">{message.weatherStyles.icon}</div>
                        <div>
                          <p className="font-medium capitalize">{message.weatherStyles.description}</p>
                          <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold bg-linear-to-r ${message.weatherStyles.temperatureColor} text-white mt-1`}>
                            {message.weatherStyles.temperature}°C
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <span>💧</span>
                          <span>Độ ẩm: {message.weatherStyles.humidity}%</span>
                        </div>
                      </div>
                      {message.weatherStyles.advice && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-2 rounded">
                          <p className="text-xs font-medium text-blue-800">
                            💡 Lời khuyên:
                          </p>
                          <p className="text-blue-700 text-xs mt-1">{message.weatherStyles.advice}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="whitespace-pre-line text-sm">
                      {message.content}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 p-4 rounded-2xl shadow-md border border-gray-100">
                  <div className="text-xs opacity-50 mb-1">
                    {formatTime(new Date())}
                  </div>
                  <div className="text-xs opacity-70 mb-1">Hỗ trợ thời tiết</div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">Đang kiểm tra thời tiết...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-linear-to-t from-gray-50 to-white border-t border-gray-100 rounded-b-lg">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tên thành phố..."
                  className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm shadow-sm"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="text-gray-400 text-sm">🔍</span>
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="w-12 h-12 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
