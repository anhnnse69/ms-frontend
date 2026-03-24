// hooks/usePendingAppointments.ts

import { useEffect, useState } from 'react';
import { managerPendingApi } from '@/services/api/manager.api';
import { PendingAppointment } from '@/types/manager';

export const usePendingAppointments = ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  const [data, setData] = useState<PendingAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    page: 1,
    size: 10,
    total: 0,
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);

        const res = await managerPendingApi.getAll(page, size);

        setData(res.data);
        setMeta(res.meta);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, size]);

  return { data, loading, meta };
};