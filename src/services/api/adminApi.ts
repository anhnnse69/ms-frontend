import { apiClient } from '@/services/common/baseApi';
import { AdminUser, Doctor, Facility, Specialty, CreateUserRequest, UpdateUserRequest, CreateDoctorRequest, UpdateDoctorRequest, CreateFacilityRequest, UpdateFacilityRequest, CreateSpecialtyRequest, UpdateSpecialtyRequest, PaginatedResponse, ApiResponse } from '@/types/admin';

// ============ USERS ADMIN API ============
export const adminUsersApi = {
    // Get all users with pagination
    getAll: async (page: number = 1, size: number = 10) => {
		const response = await apiClient().get<ApiResponse<PaginatedResponse<AdminUser>>>(
            `/admin/users?page=${page}&size=${size}`
        );
        return response.data;
    },

    // Get user by ID
    getById: async (id: string) => {
		const response = await apiClient().get<ApiResponse<AdminUser>>(`/admin/users/${id}`);
        return response.data;
    },

    // Create new user
    create: async (data: CreateUserRequest) => {
		const response = await apiClient().post<ApiResponse<AdminUser>>(`/admin/users`, data);
        return response.data;
    },

    // Update user
    update: async (id: string, data: UpdateUserRequest) => {
		const response = await apiClient().put<ApiResponse<AdminUser>>(
            `/admin/users/${id}`,
            data
        );
        return response.data;
    },

    // Delete user (soft delete)
    delete: async (id: string) => {
		const response = await apiClient().delete<ApiResponse<{ isDeleted: boolean }>>(
            `/admin/users/${id}`
        );
        return response.data;
    },
};

// ============ DOCTORS ADMIN API ============
export const adminDoctorsApi = {
    // Get all doctors with pagination
    getAll: async (page: number = 1, size: number = 10) => {
		const response = await apiClient().get<ApiResponse<PaginatedResponse<Doctor>>>(
            `/admin/doctors?page=${page}&size=${size}`
        );
        return response.data;
    },

    // Get doctor by ID
    getById: async (id: string) => {
		const response = await apiClient().get<ApiResponse<Doctor>>(`/admin/doctors/${id}`);
        return response.data;
    },

    // Create new doctor
    create: async (data: CreateDoctorRequest) => {
		const response = await apiClient().post<ApiResponse<Doctor>>(`/admin/doctors`, data);
        return response.data;
    },

    // Update doctor
    update: async (id: string, data: UpdateDoctorRequest) => {
		const response = await apiClient().put<ApiResponse<Doctor>>(
            `/admin/doctors/${id}`,
            data
        );
        return response.data;
    },

    // Delete doctor (soft delete)
    delete: async (id: string) => {
		const response = await apiClient().delete<ApiResponse<{ isDeleted: boolean }>>(
            `/admin/doctors/${id}`
        );
        return response.data;
    },
};

// ============ FACILITIES ADMIN API ============
export const adminFacilitiesApi = {
    // Get all facilities with pagination
    getAll: async (page: number = 1, size: number = 10) => {
		const response = await apiClient().get<ApiResponse<PaginatedResponse<Facility>>>(
            `/admin/facilities?page=${page}&size=${size}`
        );
        return response.data;
    },

    // Get facility by ID
    getById: async (id: string) => {
		const response = await apiClient().get<ApiResponse<Facility>>(
            `/admin/facilities/${id}`
        );
        return response.data;
    },

    // Create new facility
    create: async (data: CreateFacilityRequest) => {
		const response = await apiClient().post<ApiResponse<Facility>>(
            `/admin/facilities`,
            data
        );
        return response.data;
    },

    // Update facility
    update: async (id: string, data: UpdateFacilityRequest) => {
		const response = await apiClient().put<ApiResponse<Facility>>(
            `/admin/facilities/${id}`,
            data
        );
        return response.data;
    },

    // Delete facility (soft delete)
    delete: async (id: string) => {
		const response = await apiClient().delete<ApiResponse<{ isDeleted: boolean }>>(
            `/admin/facilities/${id}`
        );
        return response.data;
    },
};

// ============ SPECIALTIES ADMIN API ============
export const adminSpecialtiesApi = {
    // Get all specialties with pagination
    getAll: async (page: number = 1, size: number = 10) => {
		const response = await apiClient().get<ApiResponse<PaginatedResponse<Specialty>>>(
            `/admin/specialties?page=${page}&size=${size}`
        );
        return response.data;
    },

    // Get specialty by ID
    getById: async (id: string) => {
		const response = await apiClient().get<ApiResponse<Specialty>>(
            `/admin/specialties/${id}`
        );
        return response.data;
    },

    // Create new specialty
    create: async (data: CreateSpecialtyRequest) => {
		const response = await apiClient().post<ApiResponse<Specialty>>(
            `/admin/specialties`,
            data
        );
        return response.data;
    },

    // Update specialty
    update: async (id: string, data: UpdateSpecialtyRequest) => {
		const response = await apiClient().put<ApiResponse<Specialty>>(
            `/admin/specialties/${id}`,
            data
        );
        return response.data;
    },

    // Delete specialty (soft delete)
    delete: async (id: string) => {
		const response = await apiClient().delete<ApiResponse<{ isDeleted: boolean }>>(
            `/admin/specialties/${id}`
        );
        return response.data;
    },
};
