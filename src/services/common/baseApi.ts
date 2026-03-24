import axios from 'axios';

// Base URL lấy từ biến môi trường
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Lấy token từ localStorage (chỉ chạy trên client)
const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken');
    }
    return null;
};

// Tạo axios instance dùng chung
export const apiClient = () => {
    const token = getAuthToken();

    const instance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    // Add request interceptor to log outgoing requests
    instance.interceptors.request.use(
        (config) => {
            console.log('API Request:', {
                method: config.method?.toUpperCase(),
                url: config.url,
                data: config.data,
                headers: config.headers
            });
            console.log('Request Data JSON:', JSON.stringify(config.data, null, 2));
            return config;
        },
        (error) => {
            console.error('API Request Error:', error);
            return Promise.reject(error);
        }
    );

    // Add response interceptor mainly for logging; keep full axios response
    instance.interceptors.response.use(
        (response) => {
            // Log the raw response for debugging
            console.log('Raw axios response:', response);
            // Return full axios response so callers can access .data, .status, etc.
            return response;
        },
        (error) => {
            console.error('API Error:', error);
            console.error('API Error Response:', error.response);
            console.error('API Error Data:', error.response?.data);
            console.error('API Error Status:', error.response?.status);
            return Promise.reject(error);
        }
    );

    return instance;
};

export default apiClient;
