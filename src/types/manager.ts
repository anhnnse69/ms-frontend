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