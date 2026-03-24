import { useEffect, useState } from 'react';
import { facilityApi } from '@/services/api/manager.api';

export const useFacilitySpecialties = (facilityId?: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!facilityId) return;

    const fetch = async () => {
      try {
        setLoading(true);

        console.log('CALL specialties API:', facilityId);

        const res = await facilityApi.getSpecialties(facilityId);

        console.log('SPECIALTIES RESPONSE:', res);

        if (res.codeMessage === 'APP_MESSAGE_2000') {
          setData(res.data);
        }
      } catch (err) {
        console.error('SPECIALTIES ERROR:', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [facilityId]);

  return { data, loading };
};