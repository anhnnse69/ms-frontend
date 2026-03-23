/**
 * Patient & Patient Profile TypeScript Types
 * Based on Backend DTOs from Patient & Patient Profile APIs
 */

/**
 * User Profile DTO - Represents patient personal information
 * Returned by: GET /api/v1/users/profile
 */
export interface UserProfile {
  id: string;
  displayName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl?: string;
}

/**
 * Update User Profile Request DTO
 * Sent to: PUT /api/v1/users/profile
 */
export interface UpdateUserProfileRequest {
  displayName: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl?: string;
}

/**
 * Book Appointment Request DTO
 * Sent to: POST /api/v1/patient/appointments
 */
export interface BookAppointmentRequest {
  facilityId: string;
  specialtyId: string;
  doctorId: string;
  appointmentTime: string; // ISO 8601 format (UTC)
  notes?: string;
}

/**
 * Appointment Information - Represents a booked appointment
 */
export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  facilityId: string;
  facilityName: string;
  specialtyId: string;
  specialtyName: string;
  appointmentTime: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  notes?: string;
  createdAt: string;
}

/**
 * Patient Appointments Response DTO
 * Returned by: GET /api/v1/GetPatientAppointment/me/appointments
 */
export interface GetPatientAppointmentsResponse {
  appointments: Appointment[];
}

/**
 * Doctor Information - Basic doctor details
 */
export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  specialtyId: string;
  facility: string;
  facilityId: string;
  license: string;
  experience: number;
  avatarUrl?: string;
  rating?: number;
  reviewCount?: number;
  bio?: string;
}

/**
 * Doctor Search Response DTO
 * Returned by: GET /api/v1/patient/doctors with query params
 */
export interface SearchDoctorsResponse {
  doctors: Doctor[];
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
}

/**
 * Doctor Detail Response DTO
 * Returned by: GET /api/v1/patient/doctors/{id}
 */
export interface DoctorDetail extends Doctor {
  about?: string;
  qualifications?: string[];
  reviews?: Review[];
  availableSlots?: string[];
}

/**
 * Favorite Doctor DTO
 * Used for: POST /api/v1/patient/favorites, DELETE /api/v1/patient/favorites/{id}
 */
export interface FavoriteRequest {
  doctorId: string;
}

/**
 * Favorite Response DTO
 */
export interface Favorite {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorEmail: string;
  specialty: string;
  avatarUrl?: string;
}

/**
 * Get Favorites Response DTO
 * Returned by: GET /api/v1/patient/favorites
 */
export interface GetFavoritesResponse {
  favorites: Favorite[];
}

/**
 * Submit Review Request DTO
 * Sent to: POST /api/v1/patient/reviews
 */
export interface SubmitReviewRequest {
  doctorId: string;
  appointmentId?: string;
  rating: number; // 1-5
  comment: string;
}

/**
 * Review DTO - Doctor review from patient
 */
export interface Review {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

/**
 * Cancel Appointment Request DTO
 * Sent to: POST /api/CancelAppointment
 */
export interface CancelAppointmentRequest {
  appointmentId: string;
  reason?: string;
}

/**
 * Reschedule Appointment Request DTO
 * Sent to: POST /api/RescheduleAppointment
 */
export interface RescheduleAppointmentRequest {
  appointmentId: string;
  newAppointmentTime: string; // ISO 8601 format (UTC)
  notes?: string;
}

/**
 * Standard API Response Wrapper
 * All backend responses are wrapped in this format
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  success: false;
  message?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}
