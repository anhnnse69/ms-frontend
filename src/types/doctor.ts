export type AppointmentStatus =
  | 'PendingConfirmation'
  | 'Confirmed'
  | 'CheckedIn'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled'
  | 'NoShow';

// Mapping from backend numeric status to AppointmentStatus (matches C# enum)
export const STATUS_MAP: { [key: number]: AppointmentStatus } = {
  0: 'PendingConfirmation',
  1: 'Confirmed',
  2: 'CheckedIn',
  3: 'InProgress',
  4: 'Completed',
  5: 'Cancelled',
  6: 'NoShow',
};

export interface DoctorAppointment {
  appointmentId: string;
  patientName: string;
  facilityName: string;
  appointmentTime: string;
  status: AppointmentStatus | number;
  notes?: string;
  patientPhoneNumber?: string;
  patientIdentityCard?: string;
}

export interface ConfirmAppointmentResponse {
  appointmentId: string;
  status: AppointmentStatus;
}

export interface RejectAppointmentResponse {
  appointmentId: string;
  status: AppointmentStatus;
}

export interface RejectAppointmentRequest {
  appointmentId?: string;
  reason: string;
}

export interface DoctorPatient {
  patientId: string;
  displayName: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phoneNumber: string;
  email: string;
  address: string;
  identityCard: string;
  insuranceNumber: string;
  avatarUrl?: string;
}

export interface CreateMedicalRecordRequest {
  symptoms: string;
  diagnosis: string;
  notes?: string;
}

export interface UpdateMedicalRecordRequest {
  symptoms: string;
  diagnosis: string;
  notes?: string;
}

export interface DoctorMedicalRecord {
  appointmentId: string;
  patientName: string;
  patientDateOfBirth: string;
  patientGender: 'Male' | 'Female' | 'Other';
  patientPhoneNumber: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: string;
  facilityName: string;
  appointmentStatus: AppointmentStatus;
  symptoms: string;
  diagnosis: string;
  notes?: string;
}

export interface DoctorAvailability {
  id: string;
  facilityId: string;
  facilityName: string;
  dayOfWeek: number;
  date?: string; // yyyy-mm-dd
  fromDate?: string; // optional date range
  toDate?: string; // optional date range
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  isDeleted: boolean;
}

export interface DoctorAvailabilityResponse {
  data: DoctorAvailability[];
  meta: {
    page: number;
    size: number;
    total: number;
  };
}
