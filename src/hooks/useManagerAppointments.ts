import { useAuth } from '@/hooks/useAuth';
import { mapAppointment } from '@/lib/appointment.mapper';
import { managerAppointmentApi } from '@/services/api/manager.api';
import { AppointmentView } from '@/types/manager';
import { useEffect, useState } from 'react';

interface UseAppointmentsFilters {
  page?: number;
  size?: number;
  doctorId?: string;
  status?: number;
  date?: string;
}

export const useAppointments = (filters?: UseAppointmentsFilters) => {
  const { user, isLoading: authLoading } = useAuth();

  const [data, setData] = useState<AppointmentView[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    size: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ⛔ chưa load xong auth → không làm gì
    if (authLoading) return;

    const facilityId = user?.facilityId;

    // ⛔ không có facilityId → clear data + stop loading
    if (!facilityId) {
      setData([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await managerAppointmentApi.getByFacility({
          facilityId,
          page: filters?.page ?? 1,
          size: filters?.size ?? 10,
          doctorId: filters?.doctorId,
          status: filters?.status,
          date: filters?.date,
        });

        const mapped = res.data.map(mapAppointment);

        setData(mapped);
        setMeta(res.meta);
      } catch (error) {
        console.error('Fetch appointments failed:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    authLoading,
    user?.facilityId,
    filters?.page,
    filters?.size,
    filters?.doctorId,
    filters?.status,
    filters?.date,
  ]);

  return { data, meta, loading };
};