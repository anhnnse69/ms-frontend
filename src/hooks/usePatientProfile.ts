/**
 * Custom Hook: usePatientProfile
 * Manages fetching and caching patient profile data
 *
 * Features:
 * - Automatic profile fetch on component mount
 * - Loading and error state management
 * - Cached data to prevent unnecessary API calls
 * - Manual refetch capability
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { UserProfile } from '@/types/patient';
import { getUserProfile } from '@/services/api/userProfile.api';

interface UsePatientProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isAuthenticated: boolean;
}

/**
 * Hook to fetch and manage patient profile
 * @returns Profile data, loading state, error, and refetch function
 */
export const usePatientProfile = (): UsePatientProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching profile...');
      const data = await getUserProfile();
      console.log('✅ Profile fetched:', data);
      setProfile(data);
      setIsAuthenticated(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('❌ Profile fetch error:', error.message);
      setError(error);
      setIsAuthenticated(false);
      setProfile(null);

      // Check if error is due to authentication
      if (error.message.includes('Unauthorized')) {
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Listen for authentication state changes (login/logout/expiration)
  useEffect(() => {
    const clearAuth = () => {
      setProfile(null);
      setIsAuthenticated(false);
      setError(null);
    };

    const handleAuthChanged = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        fetchProfile();
      } else {
        clearAuth();
      }
    };

    const handleAuthExpired = () => {
      clearAuth();
      setError(new Error('Session expired'));
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    window.addEventListener('auth-changed', handleAuthChanged);

    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
      window.removeEventListener('auth-changed', handleAuthChanged);
    };
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    isAuthenticated,
  };
};
