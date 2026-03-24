import {
  Appointment,
  AppointmentView,
  STATUS_MAP,
} from '@/types/manager';

export const mapAppointment = (data: Appointment): AppointmentView => {
  return {
    id: data.id,
    patientName: data.patientName,
    doctorName: data.doctorName,
    appointmentTime: data.appointmentTime,
    status: STATUS_MAP[data.status] ?? 'PendingConfirmation',
    notes: data.notes,
  };
};