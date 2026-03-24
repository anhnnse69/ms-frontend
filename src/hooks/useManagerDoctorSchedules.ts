// hooks/useDoctorSchedules.ts

import { useEffect, useState } from 'react';
import { managerDoctorScheduleApi } from '@/services/api/manager.api';
import { DoctorSchedule } from '@/types/manager';

export const useDoctorSchedules = ({
  facilityId,
  page,
  size,
}: {
  facilityId?: string;
  page: number;
  size: number;
}) => {
  const [data, setData] = useState<DoctorSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    page: 1,
    size: 10,
    total: 0,
  });

  useEffect(() => {
    if (!facilityId) return;

    const fetch = async () => {
      try {
        setLoading(true);

        const res = await managerDoctorScheduleApi.getByFacility(
          facilityId,
          page,
          size
        );

        setData(res.data);
        setMeta(res.meta);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [facilityId, page, size]);

  return { data, loading, meta };
};