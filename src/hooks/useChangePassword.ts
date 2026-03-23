/**
 * Custom Hook: useChangePassword
 * Manages changing patient password with loading and error states
 *
 * Features:
 * - Form submission handling
 * - Loading state during request
 * - Detailed error messages
 * - Success callback support
 */

'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import { changePasswordRequestDto, changePasswordResponseDto, backendApiResponse } from '@/types/auth';
import { authApi } from '@/services/api/authApi';
import { translateMessageCode } from '@/lib/utils';

interface UseChangePasswordReturn {
  changePassword: (data: changePasswordRequestDto) => Promise<void>;
  loading: boolean;
  error: Error | null;
  success: boolean;
  clearError: () => void;
  clearSuccess: () => void;
}

interface UseChangePasswordOptions {
  onSuccess?: (response: backendApiResponse<changePasswordResponseDto>) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to handle password change
 * @param options - Callback functions for success/error
 * @returns Change function, loading state, error, and utilities
 */
export const useChangePassword = (
  options?: UseChangePasswordOptions
): UseChangePasswordReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const changePassword = useCallback(
    async (data: changePasswordRequestDto) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Validate data before sending
        const current = data.CurrentPassword?.trim() ?? '';
        const next = data.NewPassword?.trim() ?? '';

        if (!current) {
          throw new Error('Current password is required');
        }
        if (!next) {
          throw new Error('New password is required');
        }
        if (current.length < 8) {
          throw new Error('Current password must be at least 8 characters long');
        }
        if (next.length < 8) {
          throw new Error('New password must be at least 8 characters long');
        }
        if (current === next) {
          throw new Error('New password must be different from current password');
        }

        const strengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;
        if (!strengthRegex.test(data.NewPassword)) {
          throw new Error('New password must include uppercase, lowercase, number, and special character');
        }

        const noHtmlRegex = /<[^>]*>/;
        const sqlInjectionRegex = /('|--|\b(SELECT|UPDATE|DELETE|INSERT|DROP|ALTER|TRUNCATE)\b)/i;
        if (noHtmlRegex.test(data.CurrentPassword) || noHtmlRegex.test(data.NewPassword)) {
          throw new Error('Password cannot contain HTML tags');
        }
        if (sqlInjectionRegex.test(data.CurrentPassword) || sqlInjectionRegex.test(data.NewPassword)) {
          throw new Error('Password contains invalid characters');
        }

        // Call API
        const result = await authApi.changePassword({
          CurrentPassword: current,
          NewPassword: next,
        });

        // Backend ApiResponse may set success/message
        const apiSuccess = (result as any)?.success ?? (result as any)?.Success;
        const apiMessage = (result as any)?.message ?? (result as any)?.Message;

        if (apiSuccess === false) {
          throw new Error(translateMessageCode(apiMessage) || 'Thay đổi mật khẩu thất bại');
        }

        setSuccess(true);
        options?.onSuccess?.(result);
      } catch (err) {
        let errorMessage = 'Thay đổi mật khẩu thất bại';
        
        if (axios.isAxiosError(err) && err.response?.data) {
          const data = err.response.data;
          // Try different possible message fields
          const rawMessage = data.message || data.Message || data.error || data.Error || errorMessage;
          errorMessage = translateMessageCode(rawMessage);
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        
        const error = new Error(errorMessage);
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
    changePassword,
    loading,
    error,
    success,
    clearError,
    clearSuccess,
  };
};