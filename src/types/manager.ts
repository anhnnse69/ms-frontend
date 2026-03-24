// ========== ENUM ==========
export type AppointmentStatus =
  | 'PendingConfirmation'
  | 'Confirmed'
  | 'CheckedIn'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled'
  | 'NoShow';

// Map từ BE (int) -> FE (string)
export const STATUS_MAP: Record<number, AppointmentStatus> = {
  0: 'PendingConfirmation',
  1: 'Confirmed',
  2: 'CheckedIn',
  3: 'InProgress',
  4: 'Completed',
  5: 'Cancelled',
  6: 'NoShow',
};

// ========== REQUEST ==========
export interface AppointmentFilterRequest {
  facilityId: string;
  doctorId?: string;
  status?: number; // gửi lên BE là number
  date?: string;   // ISO string (yyyy-mm-dd)
  page?: number;
  size?: number;
}

// ========== RESPONSE ==========
export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  appointmentTime: string;
  status: number;
  notes?: string;
}

// ========== VIEW MODEL (optional FE mapping) ==========
export interface AppointmentView {
  id: string;
  patientName: string;
  doctorName: string;
  appointmentTime: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface ManagerMeta {
  page: number;
  size: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ManagerApiResponse<T> {
  codeMessage: string;
  data: T;
  meta: ManagerMeta;
}

// ========== REPORT REQUEST ==========
export interface AppointmentReportRequest {
  facilityId: string;
  type?: 'day' | 'month' | 'year';
  date?: string; // ISO (yyyy-mm-dd)
}

// ========== REPORT RESPONSE ==========
export interface AppointmentReport {
  pending: number;
  confirmed: number;
  checkedIn: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  noShow: number;
  total: number;
}

export interface Doctor {
  id: string;
  displayName: string;
  fullName: string;
  academicTitleVi: string;
  avatarUrl: string;
  specialtyName: string;
  yearsOfExperience: number;
  averageRating: number;
}

export interface DoctorResponse {
  codeMessage: string;
  data: Doctor[];
  meta: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// types/doctorSchedule.ts
export interface ScheduleSlot {
  dayOfWeek: number; // 0-6
  startTime: string; // "08:00:00"
  endTime: string;
  slotDurationMinutes: number;
}

export interface DoctorSchedule {
  doctorId: string;
  doctorName: string;
  schedules: ScheduleSlot[];
}

export interface DoctorScheduleResponse {
  codeMessage: string;
  data: DoctorSchedule[];
  meta: {
    page: number;
    size: number;
    total: number;
  };
}

// types/pendingAppointment.ts

export interface PendingAppointment {
  appointmentId: string;
  appointmentTime: string;
  patientName: string;
  phoneNumber: string;
  doctorName?: string;
  facilityName: string;
  specialtyName: string;
  status: number;
  patientId: string;
}

export interface PendingAppointmentResponse {
  codeMessage: string;
  data: PendingAppointment[];
  meta: {
    page: number;
    size: number;
    total: number;
  };
}

export interface UpdateFacilityRequest {
  id: string;
  nameVi: string;
  nameEn: string;
  descriptionVi: string;
  descriptionEn: string;
  logoUrl?: string;
  address: string;
  phone: string;
  email: string;
  city: string;
  type: number; 
}

export interface UpdateFacilityResponse {
  codeMessage: string;
  data: boolean;
}

export type SendNotificationRequest = {
  appointmentId: string;
  patientId: string;
  titleVi: string;
  titleEn: string;
  contentVi: string;
  contentEn: string;
  type: number;
  channel: number;
};