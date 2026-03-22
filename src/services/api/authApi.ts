import { apiClient } from '@/services/common/baseApi';
import { persistAuth } from '../helpers/authHelpers';
import type {
    backendApiResponse,
    loginRequestDto,
    loginResponseDto,
    registerRequestDto,
    registerResponseDto,
    forgotPasswordRequestDto,
    forgotPasswordResponseDto,
    verifyOtpRequestDto,
    verifyOtpResponseDto,
    resetPasswordRequestDto,
    resetPasswordResponseDto,
} from '@/types/auth';

// === Public API: only API calls with apiClient ===

export const authApi = {
    login: async (payload: loginRequestDto): Promise<backendApiResponse<loginResponseDto>> => {
        const response = await apiClient().post<backendApiResponse<loginResponseDto>>('/auth/login', payload);
        const data = response.data;
        const inner = (data.data ?? (data as any).Data) as loginResponseDto | null;
        const token = inner?.token ?? inner?.Token;
        if (token) {
            persistAuth(token);
        }
        return data;
    },

    register: async (payload: registerRequestDto): Promise<backendApiResponse<registerResponseDto>> => {
        const response = await apiClient().post<backendApiResponse<registerResponseDto>>('/auth/register', payload);
        return response.data;
    },

    forgotPassword: async (
        payload: forgotPasswordRequestDto,
    ): Promise<backendApiResponse<forgotPasswordResponseDto>> => {
        const response = await apiClient().post<backendApiResponse<forgotPasswordResponseDto>>(
            '/auth/forgot-password',
            payload
        );
        return response.data;
    },

    verifyOtp: async (payload: verifyOtpRequestDto): Promise<backendApiResponse<verifyOtpResponseDto>> => {
        const response = await apiClient().post<backendApiResponse<verifyOtpResponseDto>>('/auth/verify-otp', payload);
        return response.data;
    },

    resetPassword: async (
        payload: resetPasswordRequestDto,
    ): Promise<backendApiResponse<resetPasswordResponseDto>> => {
        const response = await apiClient().post<backendApiResponse<resetPasswordResponseDto>>(
            '/auth/reset-password',
            payload,
        );
        return response.data;
    },
};

export default authApi;
