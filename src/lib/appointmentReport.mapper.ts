import { AppointmentReport } from '@/types/manager';

export const mapAppointmentReport = (raw: any): AppointmentReport => {
  return {
    pending: raw.pending ?? raw.Pending ?? 0,
    confirmed: raw.confirmed ?? raw.Confirmed ?? 0,
    checkedIn: raw.checkedIn ?? raw.CheckedIn ?? 0,
    inProgress: raw.inProgress ?? raw.InProgress ?? 0,
    completed: raw.completed ?? raw.Completed ?? 0,
    cancelled: raw.cancelled ?? raw.Cancelled ?? 0,
    noShow: raw.noShow ?? raw.NoShow ?? 0,
    total: raw.total ?? raw.Total ?? 0,
  };
};