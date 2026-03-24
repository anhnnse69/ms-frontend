/**
 * User Profile API Service Layer
 * Handles patient profile operations:
 * - Get User Profile
 * - Update User Profile
 */

import apiClient from './apiClient';
import { UserProfile, UpdateUserProfileRequest } from '@/types/patient';

/**
 * Get the current authenticated user's profile
 * Endpoint: GET /users/profile
 * Requires: Authentication (any authenticated user)
 * Returns: User profile with personal information
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await apiClient.get('/users/profile');

    const responseData = response.data as any;

    // Backend ApiResponse<T>: { codeMessage, data, meta }
    if (responseData && typeof responseData === 'object') {
      if ('codeMessage' in responseData) {
        const code = responseData.codeMessage as string | undefined;
        const data = responseData.data as any;

        // Success case: has data with id
        if (data && typeof data === 'object' && data.id) {
          return data as UserProfile;
        }

        // Business error (e.g. APP_MESSAGE_4020) – let caller decide what to do
        throw new Error(code || 'Failed to fetch profile');
      }

      // Fallbacks for any legacy shapes if needed
      const rawData = responseData.data ?? responseData.Data ?? responseData.result;
      if (rawData && typeof rawData === 'object' && rawData.id) {
        return rawData as UserProfile;
      }

      if (responseData.id && responseData.email) {
        return responseData as UserProfile;
      }

      const nested = responseData.user ?? responseData.userProfile;
      if (nested && nested.id) {
        return nested as UserProfile;
      }
    }

    throw new Error('Failed to fetch profile');
  } catch (error) {
    // Use warn to avoid noisy "console error" overlays in dev
    console.warn('⚠️ getUserProfile failed:', error);
    throw handleProfileApiError(error, 'Fetch profile failed');
  }
};

/**
 * Update the current authenticated user's profile
 * Endpoint: PUT /users/profile
 * Requires: Authentication (any authenticated user)
 * Note: Backend extracts userId from token - do NOT include userId in request body
 *
 * Validation Rules (enforced by backend):
 * - displayName: Not blank, no HTML, no SQL injection
 * - fullName: Not blank, no HTML, no SQL injection
 * - phoneNumber: Valid phone format
 * - avatarUrl: No HTML, no SQL injection
 *
 * Returns: true on success
 */
export const updateUserProfile = async (
  request: UpdateUserProfileRequest
): Promise<boolean> => {
  try {
    const response = await apiClient.put<
      ApiResponse<boolean> | boolean | UserProfile
    >('/users/profile', request);

    const responseData = response.data as any;

    // Standard wrapper format
    if (responseData && typeof responseData === 'object' && 'success' in responseData) {
      if (responseData.success) {
        if (typeof responseData.data === 'boolean') return responseData.data;
        return true;
      }
      throw new Error(responseData.message || 'Failed to update profile');
    }

    // Raw boolean response
    if (typeof responseData === 'boolean') {
      if (responseData) return true;
      throw new Error('Failed to update profile');
    }

    // Raw profile response from old API implementation => treat as success
    if (responseData && responseData.id) {
      return true;
    }

    // 204 No Content or empty body
    if (response.status === 204 || response.status === 200) {
      return true;
    }

    throw new Error('Failed to update profile');
  } catch (error) {
    throw handleProfileApiError(error, 'Update profile failed');
  }
};

/**
 * Error Handling Utility for Profile APIs
 * Standardizes error messages from different HTTP status codes
 */
function handleProfileApiError(error: any, defaultMessage: string): Error {
  // Axios error with response
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (status === 401) {
      return new Error('Unauthorized: Your session has expired. Please log in again.');
    }

    if (status === 403) {
      return new Error('Forbidden: You do not have permission to access this resource.');
    }

    if (status === 400) {
      // Backend returns validation errors in this format
      if (data.errors && typeof data.errors === 'object') {
        const errorMessages = Object.entries(data.errors)
          .map(([fieldName, errorList]: [string, any]) => {
            const messages = Array.isArray(errorList) ? errorList : [errorList];
            return `${fieldName}: ${messages.join(', ')}`;
          })
          .join('\n');
        return new Error(`Validation Error:\n${errorMessages}`);
      }
      return new Error(data.message || 'Validation error occurred');
    }

    if (status === 404) {
      return new Error('Profile not found');
    }

    if (status === 500) {
      return new Error(
        'Server error: Unable to process your request. Please try again later.'
      );
    }

    return new Error(data.message || defaultMessage);
  }

  // Network error
  if (error.message === 'Network Error') {
    return new Error('Network error: Please check your internet connection and try again.');
  }

  // Timeout error
  if (error.code === 'ECONNABORTED') {
    return new Error('Request timeout: The server took too long to respond. Please try again.');
  }

  // Generic error
  return new Error(error.message || defaultMessage);
}
