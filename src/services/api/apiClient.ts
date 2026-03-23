import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

/**
 * API Client Configuration
 * Handles:
 * - Base URL setup
 * - JWT token attachment via interceptors
 * - Request/response handling
 * - Error standardization
 * - 401 token expiration handling
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7061/api/v1';
const TOKEN_KEY = 'accessToken'; // Match with authHelpers.ts
const REFRESH_TOKEN_KEY = 'refreshToken';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Attaches JWT token to every request
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    console.log('🔐 Token from storage:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header set');
    } else {
      console.warn('⚠️ NO TOKEN - Request will be unauthorized');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles:
 * - Standard error responses
 * - 401 unauthorized (token expired)
 * - Server errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      clearAuthToken();
      // Dispatch event for app-wide logout
      window.dispatchEvent(new Event('auth:expired'));
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden (insufficient permissions)
    if (error.response?.status === 403) {
      console.error('Access Forbidden: User lacks required role');
    }

    // Handle 400 Bad Request (validation errors)
    if (error.response?.status === 400) {
      console.error('Validation Error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

/**
 * Token Management Functions
 */

/**
 * Save JWT token to localStorage
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Retrieve JWT token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Clear token on logout
 */
export const clearAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export default apiClient;
