/**
 * Custom Hook: useUpdatePatientProfile
 * Manages updating patient profile with loading and error states
 *
 * Features:
 * - Form submission handling
 * - Loading state during request
 * - Detailed error messages
 * - Success callback support
 * - Optimistic update support
 */

'use client';

import { useState, useCallback } from 'react';
import { UserProfile, UpdateUserProfileRequest } from '@/types/patient';
import { updateUserProfile } from '@/services/api/userProfile.api';

interface UseUpdatePatientProfileReturn {
  updateProfile: (data: UpdateUserProfileRequest) => Promise<void>;
  loading: boolean;
  error: Error | null;
  success: boolean;
  clearError: () => void;
  clearSuccess: () => void;
}

interface UseUpdatePatientProfileOptions {
  onSuccess?: (updatedProfile: UserProfile) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to handle profile updates
 * @param options - Callback functions for success/error
 * @returns Update function, loading state, error, and utilities
 */
export const useUpdatePatientProfile = (
  options?: UseUpdatePatientProfileOptions
): UseUpdatePatientProfileReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const updateProfile = useCallback(
    async (data: UpdateUserProfileRequest) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Validate data before sending
        if (!data.displayName?.trim()) {
          throw new Error('Display name is required');
        }
        if (!data.fullName?.trim()) {
          throw new Error('Full name is required');
        }
        if (!data.phoneNumber?.trim()) {
          throw new Error('Phone number is required');
        }

        // Call API
        const result = await updateUserProfile(data);

        if (result) {
          setSuccess(true);

          // Cập nhật user trong localStorage + dispatch event auth-changed để Header refresh
          if (typeof window !== 'undefined') {
            const existingUser = localStorage.getItem('user');
            if (existingUser) {
              try {
                const parsed = JSON.parse(existingUser);
                const merged = { ...parsed, ...data };
                localStorage.setItem('user', JSON.stringify(merged));
              } catch {
                localStorage.setItem('user', JSON.stringify(data));
              }
            } else {
              localStorage.setItem('user', JSON.stringify(data));
            }
          }

          window.dispatchEvent(new CustomEvent('profile:updated', { detail: data }));
          window.dispatchEvent(new CustomEvent('auth-changed'));

          options?.onSuccess?.(data as UserProfile);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update profile');
        setError(error);
        options?.onError?.(error);
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccess(false);
  }, []);

  return {
    updateProfile,
    loading,
    error,
    success,
    clearError,
    clearSuccess,
  };
};
