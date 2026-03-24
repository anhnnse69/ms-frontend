import { useEffect, useState } from 'react';
import { managerDoctorApi } from '@/services/api/manager.api';
import { Doctor } from '@/types/manager';

export const useDoctors = ({
  facilityId,
  page,
  size,
}: {
  facilityId?: string;
  page: number;
  size: number;
}) => {
  const [data, setData] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    page: 1,
    size: 10,
    total: 0,
  });

  useEffect(() => {
    if (!facilityId) return;

    const fetchDoctors = async () => {
      try {
        setLoading(true);

        const res = await managerDoctorApi.getByFacility(
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

    fetchDoctors();
  }, [facilityId, page, size]);

  return { data, loading, meta };
};