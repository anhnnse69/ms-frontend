import { apiClient } from '@/services/common/baseApi';
import { Appointment, AppointmentFilterRequest, AppointmentReport, AppointmentReportRequest, DoctorResponse, DoctorScheduleResponse, PendingAppointmentResponse, SendNotificationRequest, UpdateFacilityRequest, UpdateFacilityResponse } from '@/types/manager';
import { ManagerApiResponse } from '@/types/manager';

export const managerAppointmentApi = {

  getByFacility: async (params: AppointmentFilterRequest) => {
    if (!params.facilityId) {
      throw new Error('facilityId is required');
    }

    const response = await apiClient().get<
      ManagerApiResponse<Appointment[]>
    >('/manager/appointments', {
      params,
    });

    return response.data;
  },
  getReport: async (params: AppointmentReportRequest) => {
    if (!params.facilityId) {
      throw new Error('facilityId is required');
    }

    const response = await apiClient().get<
      ManagerApiResponse<AppointmentReport>
    >('/manager/appointments/report', {
      params: {
        FacilityId: params.facilityId, 
        Type: params.type ?? 'day',   
        Date: params.date,           
      },
    });

    return response.data;
  },
};

export const managerDoctorApi = {
  getByFacility: async (
    facilityId: string,
    page = 1,
    size = 10
  ) => {
    if (!facilityId) throw new Error('facilityId is required');

    const response = await apiClient().get<DoctorResponse>(
      `/manager/doctors/facility/${facilityId}`,
      {
        params: { page, size },
      }
    );

    return response.data;
  },
};

export const managerDoctorScheduleApi = {
  getByFacility: async (
    facilityId: string,
    page = 1,
    size = 10
  ) => {
    if (!facilityId) throw new Error('facilityId is required');

    const res = await apiClient().get<DoctorScheduleResponse>(
      `/manager/doctors/schedule/${facilityId}`,
      {
        params: { page, size },
      }
    );

    return res.data;
  },
};

export const managerPendingApi = {
  getAll: async (page = 1, size = 10) => {
    const res = await apiClient().get<PendingAppointmentResponse>(
      '/manager/appointments/pending',
      {
        params: { page, size },
      }
    );

    return res.data;
  },
};

export const managerFacilityApi = {
  update: async (payload: UpdateFacilityRequest) => {
    const res = await apiClient().put<UpdateFacilityResponse>(
      '/manager/facility',
      payload
    );

    return res.data;
  },
};

export const managerReportApi = {
  performance: async (params?: {
    startDate?: string;
    endDate?: string;
    doctorId?: string;
  }) => {
    const res = await apiClient().get('/manager/reports/performance', {
      params,
    });
    return res.data;
  },
};

export const facilityApi = {
  getSpecialties: async (facilityId: string) => {
    const res = await apiClient().get(
      `/facilityspecialty/facilities/${facilityId}/specialties`
    );
    return res.data;
  },
};

export const managerNotificationApi = {
  send: async (payload: SendNotificationRequest) => {
    const res = await apiClient().post('/manager/notifications/send', payload);
    return res.data;
  },
};