import { apiClient } from '@/services/common/baseApi';
import type {
  DoctorAppointment,
  DoctorPatient,
  DoctorMedicalRecord,
  CreateMedicalRecordRequest,
  UpdateMedicalRecordRequest,
  DoctorAvailability,
  DoctorAvailabilityResponse,
  AppointmentStatus,
  ConfirmAppointmentResponse,
  RejectAppointmentResponse,
  RejectAppointmentRequest,
} from '@/types/doctor';
import { STATUS_TO_CODE_MAP } from '@/types/doctor';

export const doctorApi = {
  getAppointments: async (page = 1, size = 10): Promise<DoctorAppointment[]> => {
    const response = await apiClient().get(`/doctor/appointments?page=${page}&size=${size}`);
    const payload = response.data;

    if (Array.isArray(payload)) {
      return payload;
    }

    if (Array.isArray(payload?.data)) {
      return payload.data;
    }

    if (Array.isArray(payload?.items)) {
      return payload.items;
    }

    console.warn('Unexpected doctor appointments response shape', payload);
    return [];
  },

  confirmAppointment: async (appointmentId: string): Promise<ConfirmAppointmentResponse> => {
    const response = await apiClient().post<ConfirmAppointmentResponse>(
      `/doctor/appointments/${appointmentId}/confirm`,
    );
    return response.data;
  },

  rejectAppointment: async (appointmentId: string, reason: string): Promise<RejectAppointmentResponse> => {
    const payload: RejectAppointmentRequest = { reason };
    const response = await apiClient().post<RejectAppointmentResponse>(
      `/doctor/appointments/${appointmentId}/reject`,
      payload,
    );
    return response.data;
  },

  getPatientByAppointment: async (appointmentId: string): Promise<DoctorPatient> => {
    const response = await apiClient().get(`/doctor/appointments/${appointmentId}/patient`);
    return response.data.data;
  },

  updateAppointmentStatus: async (
    appointmentId: string,
    status: AppointmentStatus
  ) => {
    const statusCode = STATUS_TO_CODE_MAP[status];
    const res = await apiClient().post(
      `/doctor/appointments/${appointmentId}/status`,
      { status: statusCode }
    );

    return res.data.data;
  },

  getMedicalRecord: async (appointmentId: string): Promise<DoctorMedicalRecord> => {
    const response = await apiClient().get(`/doctor/appointments/${appointmentId}/medical-record`);
    return response.data.data;
  },

  createMedicalRecord: async (
    appointmentId: string,
    payload: CreateMedicalRecordRequest,
  ): Promise<DoctorMedicalRecord> => {
    const res = await apiClient().post(
      `/doctor/appointments/${appointmentId}/medical-record`,
      payload
    );

    return res.data; //  trả luôn
  },

  updateMedicalRecord: async (
    appointmentId: string,
    payload: UpdateMedicalRecordRequest,
  ): Promise<DoctorMedicalRecord> => {
    const res = await apiClient().put(
      `/doctor/appointments/${appointmentId}/medical-record`,
      payload
    );

    return res.data; //  không check success nữa
  },

  getAvailabilities: async (page = 1, size = 10): Promise<DoctorAvailabilityResponse> => {
    const response = await apiClient().get(`/doctor/availabilities?page=${page}&size=${size}`);
    const payload = response.data;

    // Assuming backend returns { data: [...], meta: { page, size, total } }
    if (payload?.data && payload?.meta) {
      return {
        data: payload.data,
        meta: payload.meta,
      };
    }

    // Fallback if response is just array
    if (Array.isArray(payload)) {
      return {
        data: payload,
        meta: { page, size, total: payload.length },
      };
    }

    console.warn('Unexpected doctor availability response shape', payload);
    return { data: [], meta: { page, size, total: 0 } };
  },
};
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export default doctorApi;
