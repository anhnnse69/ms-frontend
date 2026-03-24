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
  Doctor,
  FavoriteRequest,
  Favorite,
  GetFavoritesResponse,
  SubmitReviewRequest,
  CancelAppointmentRequest,
  RescheduleAppointmentRequest,
  ApiResponse,
} from '@/types/patient';

// ============================
// MOMO PAYMENTS
// ============================

export interface CreateMomoPaymentResult {
  appointmentId: string;
  payUrl: string;
  orderId: string;
  requestId: string;
}

// Normalize raw appointment dto from backend into our Appointment model
function mapAppointmentDto(raw: any): Appointment {
  if (!raw) {
    const nowIso = new Date().toISOString();
    return {
      id: '',
      doctorId: '',
      doctorName: '',
      facilityId: '',
      facilityName: '',
      specialtyId: '',
      specialtyName: '',
      appointmentTime: nowIso,
      status: 'Scheduled',
      notes: '',
      createdAt: nowIso,
    };
  }

  const appointmentTime =
    raw.appointmentTime ?? raw.AppointmentTime ?? new Date().toISOString();

  return {
    id: raw.id ?? raw.Id ?? '',
    doctorId: raw.doctorId ?? raw.DoctorId ?? '',
    doctorName: raw.doctorName ?? raw.DoctorName ?? '',
    facilityId: raw.facilityId ?? raw.FacilityId ?? '',
    facilityName: raw.facilityName ?? raw.FacilityName ?? '',
    specialtyId: raw.specialtyId ?? raw.SpecialtyId ?? '',
    specialtyName: raw.specialtyName ?? raw.SpecialtyName ?? '',
    appointmentTime,
    status:
      (raw.status ?? raw.Status ?? 'Scheduled') as Appointment['status'],
    notes: raw.notes ?? raw.Notes ?? '',
    createdAt: raw.createdAt ?? raw.CreatedAt ?? appointmentTime,
  };
}

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

    const payload: any = response.data;
    console.log('🔥 RAW APPOINTMENTS:', payload);

    if (!payload) return [];

    // Expected: ApiResponse<List<GetPatientAppointmentsResponse>>
    let list: any[] | null = null;

    if (Array.isArray(payload)) {
      list = payload;
    } else if (Array.isArray(payload.data)) {
      list = payload.data;
    } else if (
      payload.data &&
      Array.isArray((payload.data as any).appointments)
    ) {
      // Fallback for shape { data: { appointments: [...] } }
      list = (payload.data as any).appointments;
    }

    if (!list) return [];

    return list.map((item) => mapAppointmentDto(item));
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
    const response = await apiClient.post(
      '/patient/appointments',
      request
    );

    const payload: any = response.data;

    // Case 1: Standard ApiResponse<Appointment>
    if (payload && typeof payload === 'object' && 'success' in payload) {
      const api = payload as ApiResponse<Appointment>;
      if (api.success && api.data) {
        return api.data;
      }
      throw new Error(api.message || 'Failed to book appointment');
    }

    // Case 2: Backend shape { codeMessage, data: { id, status, ... }, meta }
    if (payload && typeof payload === 'object' && payload.data) {
      const d = payload.data as any;

      const appointment: Appointment = {
        id: d.id ?? '',
        doctorId: d.doctorId ?? request.doctorId,
        doctorName: d.doctorName ?? '',
        facilityId: d.facilityId ?? request.facilityId,
        facilityName: d.facilityName ?? '',
        specialtyId: d.specialtyId ?? request.specialtyId,
        specialtyName: d.specialtyName ?? '',
        appointmentTime: d.appointmentTime ?? request.appointmentTime,
        status: (d.status as Appointment['status']) ?? 'Scheduled',
        notes: d.notes ?? request.notes,
        createdAt: d.createdAt ?? new Date().toISOString(),
      };

      return appointment;
    }

    // Fallback: treat 200 without known shape as success with minimal data
    const fallback: Appointment = {
      id: '',
      doctorId: request.doctorId,
      doctorName: '',
      facilityId: request.facilityId,
      facilityName: '',
      specialtyId: request.specialtyId,
      specialtyName: '',
      appointmentTime: request.appointmentTime,
      status: 'Scheduled',
      notes: request.notes,
      createdAt: new Date().toISOString(),
    };

    return fallback;
  } catch (error) {
    throw handleApiError(error, 'Book appointment failed');
  }
};

/**
 * Create MoMo payment session for an appointment
 * POST /payments/momo/create
 */
export const createMomoPayment = async (
  appointmentId: string,
  orderInfo?: string
): Promise<CreateMomoPaymentResult> => {
  try {
    const response = await apiClient.post('/payments/momo/create', {
      appointmentId,
      orderInfo,
    });

    const payload: any = response.data;
    const d = payload?.data ?? payload;

    return {
      appointmentId: d.appointmentId ?? appointmentId,
      payUrl: d.payUrl,
      orderId: d.orderId,
      requestId: d.requestId,
    };
  } catch (error) {
    throw handleApiError(error, 'Create MoMo payment failed');
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

// Normalize raw doctor dto from backend into our Doctor model
function mapDoctorDto(raw: any): Doctor {
  if (!raw) {
    return {
      id: '',
      name: '',
      email: '',
      specialty: '',
      specialtyId: '',
      facility: '',
      facilityId: '',
      license: '',
      experience: 0,
    };
  }

  const specialtyName =
    typeof raw.specialty === 'string'
      ? raw.specialty
      : raw.specialty?.name ?? raw.specialtyName ?? '';
  const specialtyId =
    typeof raw.specialty === 'object'
      ? raw.specialty?.id ?? ''
      : raw.specialtyId ?? '';

  // Facilities can be array of objects or single string
  let facilityName = '';
  let facilityId = '';
  if (typeof raw.facility === 'string') {
    facilityName = raw.facility;
  } else if (Array.isArray(raw.facilities) && raw.facilities.length > 0) {
    const first = raw.facilities[0];
    facilityName = first?.name ?? first?.facilityName ?? '';
    facilityId = first?.id ?? first?.facilityId ?? '';
  } else {
    facilityName = raw.facilityName ?? '';
    facilityId = raw.facilityId ?? '';
  }

  const rating =
    typeof raw.rating === 'number'
      ? raw.rating
      : typeof raw.averageRating === 'number'
      ? raw.averageRating
      : undefined;

  const reviewCount =
    typeof raw.reviewCount === 'number'
      ? raw.reviewCount
      : typeof raw.totalReviews === 'number'
      ? raw.totalReviews
      : Array.isArray(raw.reviews)
      ? raw.reviews.length
      : undefined;

  return {
    id: raw.id ?? raw.doctorId ?? '',
    name: raw.name ?? raw.fullName ?? raw.displayName ?? '',
    email: raw.email ?? '',
    specialty: specialtyName,
    specialtyId,
    facility: facilityName,
    facilityId,
    license: raw.license ?? raw.position ?? '',
    experience: raw.experience ?? raw.experienceYears ?? 0,
    avatarUrl: raw.avatarUrl ?? raw.avatar ?? undefined,
    rating,
    reviewCount,
    bio: raw.bio ?? raw.about ?? undefined,
  };
}

/**
 * Search doctors
 * GET /patient/doctors
 */
export const searchDoctors = async (
  params?: SearchDoctorsParams
): Promise<SearchDoctorsResponse> => {
  try {
    const response = await apiClient.get(
      '/patient/doctors',
      { params: params || {} }
    );

    const payload: any = response.data;

    // Backend standard: { codeMessage, data: DoctorDto[], meta }
    let rawDoctors: any[] = [];
    let meta: any = undefined;

    if (Array.isArray(payload)) {
      rawDoctors = payload;
    } else if (Array.isArray(payload?.data)) {
      rawDoctors = payload.data;
      meta = payload.meta;
    } else if (Array.isArray(payload?.data?.doctors)) {
      rawDoctors = payload.data.doctors;
      meta = payload.data.meta ?? payload.meta;
    } else if (Array.isArray(payload?.doctors)) {
      rawDoctors = payload.doctors;
      meta = payload.meta;
    } else if ((payload as ApiResponse<SearchDoctorsResponse>)?.success && (payload as ApiResponse<SearchDoctorsResponse>).data) {
      // Legacy ApiResponse<T> shape with success flag
      const data = (payload as ApiResponse<SearchDoctorsResponse>).data as any;
      rawDoctors = Array.isArray(data?.doctors) ? data.doctors : Array.isArray(data) ? data : [];
      meta = data?.meta ?? payload.meta;
    } else {
      console.warn('Unexpected searchDoctors response shape', payload);
      rawDoctors = [];
    }

    const doctors = rawDoctors.map(mapDoctorDto);

    const page = meta?.page ?? params?.page ?? 1;
    const size = meta?.size ?? params?.size ?? doctors.length;
    const total = meta?.total ?? doctors.length;
    const totalPages = meta?.totalPages ?? (size > 0 ? Math.max(1, Math.ceil(total / size)) : 1);

    return {
      doctors,
      totalCount: total,
      page,
      size,
      totalPages,
    };
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
    const response = await apiClient.get(
      `/patient/doctors/${doctorId}`
    );

    const payload: any = response.data;

    // Standard: { codeMessage, data: DoctorDto, meta }
    let rawDoctor: any = null;

    if (payload && typeof payload === 'object') {
      if (payload.data) {
        rawDoctor = payload.data;
      } else if ((payload as ApiResponse<DoctorDetail>).success && (payload as ApiResponse<DoctorDetail>).data) {
        rawDoctor = (payload as ApiResponse<DoctorDetail>).data;
      } else {
        rawDoctor = payload;
      }
    } else {
      rawDoctor = payload;
    }

      const baseDoctor = mapDoctorDto(rawDoctor) as DoctorDetail;

      // Preserve any extra detail fields if backend provides them
      if (rawDoctor) {
        baseDoctor.about = rawDoctor.about ?? baseDoctor.about;
        baseDoctor.qualifications = rawDoctor.qualifications ?? baseDoctor.qualifications;
        baseDoctor.reviews = rawDoctor.reviews ?? baseDoctor.reviews;
        baseDoctor.availableSlots = rawDoctor.availableSlots ?? baseDoctor.availableSlots;

        // New backend shape: specialties/facilities arrays
        if (Array.isArray(rawDoctor.specialties) && rawDoctor.specialties.length > 0) {
          const primarySpec = rawDoctor.specialties[0];
          baseDoctor.specialty = primarySpec?.name ?? baseDoctor.specialty;
          baseDoctor.specialtyId = primarySpec?.id ?? baseDoctor.specialtyId;
        }

        if (Array.isArray(rawDoctor.facilities) && rawDoctor.facilities.length > 0) {
          const primaryFacility = rawDoctor.facilities[0];
          baseDoctor.facility = primaryFacility?.name ?? baseDoctor.facility;
          baseDoctor.facilityId = primaryFacility?.id ?? baseDoctor.facilityId;
        }
      }

      return baseDoctor;
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