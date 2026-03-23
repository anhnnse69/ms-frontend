/**
 * Custom Hook: usePatientAppointments
 * Manages fetching and managing patient appointments
 *
 * Features:
 * - Automatic appointments fetch on mount
 * - Loading and error state management
 * - Manual refetch capability
 * - Separate appointments into upcoming and past
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { Appointment } from '@/types/patient';
import { getPatientAppointments } from '@/services/api/patient.api';

interface UsePatientAppointmentsReturn {
  appointments: Appointment[];
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  rawResponse: any;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage patient appointments
 * @returns Appointments, loading state, error, and refetch function
 */
export const usePatientAppointments = (): UsePatientAppointmentsReturn => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPatientAppointments();
      console.log('[usePatientAppointments] fetched appointments', data);
      setAppointments(data);
      setRawResponse(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch appointments');
      setError(error);
      setRawResponse(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Separate appointments into upcoming and past
  const now = new Date();
  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.appointmentTime) > now
  );
  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.appointmentTime) <= now
  );

  return {
    appointments,
    upcomingAppointments,
    pastAppointments,
    rawResponse,
    loading,
    error,
    refetch: fetchAppointments,
  };
};
