/**
 * Patient API Service Layer (CLEAN VERSION)
 * Fixed:
 * - ❌ Remove wrong endpoints
 * - ❌ Remove /api duplication
 * - ❌ Remove endpoint guessing loop
 * - ✅ Match backend exactly
 */

import apiClient from './apiClient';
import {
  BookAppointmentRequest,
  Appointment,
  SearchDoctorsResponse,
  DoctorDetail,
  FavoriteRequest,
  Favorite,
  GetFavoritesResponse,
  SubmitReviewRequest,
  CancelAppointmentRequest,
  RescheduleAppointmentRequest,
  ApiResponse,
} from '@/types/patient';

/**
 * ============================
 * APPOINTMENTS
 * ============================
 */

/**
 * Get all appointments of current patient
 * Backend: GET /api/v1/getpatientappointment/me/appointments
 */
export const getPatientAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await apiClient.get('/getpatientappointment/me/appointments');

    const res = response.data;
    console.log('🔥 RAW APPOINTMENTS:', res);

    if (!res) return [];

    const rawData = res.data;

    // Case 1: array
    if (Array.isArray(rawData)) {
      return rawData;
    }

    // Case 2: single object
    if (rawData && typeof rawData === 'object') {
      return [rawData];
    }

    return [];
  } catch (error) {
    console.error('❌ getPatientAppointments failed:', error);
    throw handleApiError(error, 'Fetch appointments failed');
  }
};

/**
 * Book appointment
 * POST /patient/appointments
 */
export const bookAppointment = async (
  request: BookAppointmentRequest
): Promise<Appointment> => {
  try {
    const response = await apiClient.post<ApiResponse<Appointment>>(
      '/patient/appointments',
      request
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to book appointment');
  } catch (error) {
    throw handleApiError(error, 'Book appointment failed');
  }
};

/**
 * Cancel appointment
 * FIXED ❌ removed /api
 */
export const cancelAppointment = async (
  request: CancelAppointmentRequest
): Promise<void> => {
  try {
    const response = await apiClient.post<ApiResponse<boolean>>(
      '/CancelAppointment',
      request
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to cancel appointment');
    }
  } catch (error) {
    throw handleApiError(error, 'Cancel appointment failed');
  }
};

/**
 * Reschedule appointment
 * FIXED ❌ removed /api
 */
export const rescheduleAppointment = async (
  request: RescheduleAppointmentRequest
): Promise<void> => {
  try {
    const response = await apiClient.post<ApiResponse<boolean>>(
      '/RescheduleAppointment',
      request
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to reschedule appointment');
    }
  } catch (error) {
    throw handleApiError(error, 'Reschedule appointment failed');
  }
};

/**
 * ============================
 * DOCTORS
 * ============================
 */

export interface SearchDoctorsParams {
  keyword?: string;
  specialtyId?: string;
  facilityId?: string;
  location?: string;
  page?: number;
  size?: number;
}

/**
 * Search doctors
 * GET /patient/doctors
 */
export const searchDoctors = async (
  params?: SearchDoctorsParams
): Promise<SearchDoctorsResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<SearchDoctorsResponse>>(
      '/patient/doctors',
      { params: params || {} }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to search doctors');
  } catch (error) {
    throw handleApiError(error, 'Search doctors failed');
  }
};

/**
 * Get doctor detail
 * GET /patient/doctors/{id}
 */
export const getDoctorDetail = async (doctorId: string): Promise<DoctorDetail> => {
  try {
    const response = await apiClient.get<ApiResponse<DoctorDetail>>(
      `/patient/doctors/${doctorId}`
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch doctor details');
  } catch (error) {
    throw handleApiError(error, 'Fetch doctor details failed');
  }
};

/**
 * ============================
 * FAVORITES
 * ============================
 */

/**
 * Add favorite doctor
 */
export const addFavoriteDoctor = async (
  doctorId: string
): Promise<Favorite> => {
  try {
    const request: FavoriteRequest = { doctorId };

    const response = await apiClient.post<ApiResponse<Favorite>>(
      '/patient/favorites',
      request
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to add favorite');
  } catch (error) {
    throw handleApiError(error, 'Add favorite failed');
  }
};

/**
 * Remove favorite doctor
 */
export const removeFavoriteDoctor = async (favoriteId: string): Promise<void> => {
  try {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/patient/favorites/${favoriteId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to remove favorite');
    }
  } catch (error) {
    throw handleApiError(error, 'Remove favorite failed');
  }
};

/**
 * Get favorite doctors
 */
export const getFavoriteDoctors = async (): Promise<Favorite[]> => {
  try {
    const response = await apiClient.get<ApiResponse<GetFavoritesResponse>>(
      '/patient/favorites'
    );

    if (response.data.success && response.data.data) {
      return response.data.data.favorites;
    }

    throw new Error(response.data.message || 'Failed to fetch favorites');
  } catch (error) {
    throw handleApiError(error, 'Fetch favorites failed');
  }
};

/**
 * ============================
 * REVIEWS
 * ============================
 */

/**
 * Submit review
 */
export const submitReview = async (
  request: SubmitReviewRequest
): Promise<void> => {
  try {
    const response = await apiClient.post<ApiResponse<boolean>>(
      '/patient/reviews',
      request
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to submit review');
    }
  } catch (error) {
    throw handleApiError(error, 'Submit review failed');
  }
};

/**
 * ============================
 * ERROR HANDLER
 * ============================
 */

function handleApiError(error: any, defaultMessage: string): Error {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (status === 401) return new Error('Unauthorized: Please log in again');
    if (status === 403) return new Error('Forbidden');
    if (status === 400) return new Error(data?.message || 'Validation error');
    if (status === 404) return new Error('API not found (check endpoint)');
    if (status === 500) return new Error('Server error');

    return new Error(data?.message || defaultMessage);
  }

  if (error.message === 'Network Error') {
    return new Error('Network error');
  }

  return new Error(error.message || defaultMessage);
}