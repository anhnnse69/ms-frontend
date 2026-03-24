import { apiClient } from '@/services/common/baseApi';
import { Appointment, AppointmentFilterRequest } from '@/types/manager';
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
}
};
