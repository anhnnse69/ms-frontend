import { apiClient } from '@/services/common/baseApi';
import { AdminUser, Doctor, Facility, Specialty, CreateUserRequest, UpdateUserRequest, CreateDoctorRequest, UpdateDoctorRequest, CreateFacilityRequest, UpdateFacilityRequest, CreateSpecialtyRequest, UpdateSpecialtyRequest, PaginatedResponse, ApiResponse } from '@/types/admin';

// ============ USERS ADMIN API ============
export const adminUsersApi = {
    // Get all users with pagination
    getAll: async (page: number = 1, size: number = 10) => {
		const axiosResponse = await apiClient().get<ApiResponse<AdminUser[]>>(
            `/admin/users?page=${page}&size=${size}`
        );
        console.log('Raw API Response:', axiosResponse);

        const response = axiosResponse.data as any;

        // Handle different response body structures
        if (Array.isArray(response)) {
            // Direct array response
            const result: ApiResponse<AdminUser[]> = {
                isSuccess: true,
                statusCode: 200,
                message: "Success",
                data: response,
                meta: {
                    pageNumber: page,
                    pageSize: size,
                    totalCount: response.length,
                    hasNextPage: false,
                    hasPreviousPage: page > 1
                }
            };
            return result;
        } else if (response && typeof response === 'object' && 'data' in response) {
            // Standard wrapped API response from backend
            return response as ApiResponse<AdminUser[]>;
        } else {
            // Fallback
            const result: ApiResponse<AdminUser[]> = {
                isSuccess: false,
                statusCode: 500,
                message: "Invalid response format",
                data: undefined
            };
            return result;
        }
    },

    // Get user by ID
    getById: async (id: string) => {
		const response = await apiClient().get<ApiResponse<AdminUser>>(`/admin/users/${id}`);
        return response.data;
    },

    // Create new user
    create: async (data: any) => {
		const response = await apiClient().post<ApiResponse<string>>(`/admin/users`, data);
        console.log('Create User Response:', response);
        
        // Handle response structure
        if (response && typeof response === 'object') {
            return response as unknown as ApiResponse<AdminUser>;
        } else {
            // Fallback
            return {
                isSuccess: false,
                statusCode: 500,
                message: "Invalid response format",
                data: undefined
            };
        }
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
		const axiosResponse = await apiClient().get<ApiResponse<Doctor[]>>(
            `/admin/doctors?page=${page}&size=${size}`
        );
        console.log('Raw Doctors API Response:', axiosResponse);

        const response = axiosResponse.data as any;

        // Handle different response body structures
        if (Array.isArray(response)) {
            // Direct array response
            const result: ApiResponse<Doctor[]> = {
                isSuccess: true,
                statusCode: 200,
                message: "Success",
                data: response,
                meta: {
                    pageNumber: page,
                    pageSize: size,
                    totalCount: response.length,
                    hasNextPage: false,
                    hasPreviousPage: page > 1
                }
            };
            return result;
        } else if (response && typeof response === 'object' && 'data' in response) {
            // Standard wrapped API response from backend
            return response as ApiResponse<Doctor[]>;
        } else {
            // Fallback
            const result: ApiResponse<Doctor[]> = {
                isSuccess: false,
                statusCode: 500,
                message: "Invalid response format",
                data: undefined
            };
            return result;
        }
    },

    // Get doctor by ID
    getById: async (id: string) => {
		const response = await apiClient().get<ApiResponse<Doctor>>(`/admin/doctors/${id}`);
        return response.data;
    },

    // Create new doctor
    create: async (data: any) => {
		const response = await apiClient().post<ApiResponse<string>>(`/admin/doctors`, data);
        console.log('Create Doctor Response:', response);
        
        // Handle response structure
        if (response && typeof response === 'object') {
            return response as unknown as ApiResponse<Doctor>;
        } else {
            // Fallback
            return {
                isSuccess: false,
                statusCode: 500,
                message: "Invalid response format",
                data: undefined
            };
        }
    },

    // Update doctor
    update: async (data: UpdateDoctorRequest) => {
		const response = await apiClient().put<ApiResponse<Doctor>>(
            `/admin/doctors`,
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
		const axiosResponse = await apiClient().get<ApiResponse<Facility[]>>(
            `/admin/facilities?page=${page}&size=${size}`
        );
        console.log('Raw Facilities API Response:', axiosResponse);

        const response = axiosResponse.data as any;

        // Handle different response body structures
        if (Array.isArray(response)) {
            // Direct array response
            const result: ApiResponse<Facility[]> = {
                isSuccess: true,
                statusCode: 200,
                message: "Success",
                data: response,
                meta: {
                    pageNumber: page,
                    pageSize: size,
                    totalCount: response.length,
                    hasNextPage: false,
                    hasPreviousPage: page > 1
                }
            };
            return result;
        } else if (response && typeof response === 'object' && 'data' in response) {
            // Standard wrapped API response from backend
            return response as ApiResponse<Facility[]>;
        } else {
            // Fallback
            const result: ApiResponse<Facility[]> = {
                isSuccess: false,
                statusCode: 500,
                message: "Invalid response format",
                data: undefined
            };
            return result;
        }
    },

    // Get facility by ID
    getById: async (id: string) => {
		const response = await apiClient().get<ApiResponse<Facility>>(
            `/admin/facilities/${id}`
        );
        return response.data;
    },

    // Create new facility
    create: async (data: any) => {
		const response = await apiClient().post<ApiResponse<string>>(
            `/admin/facilities`,
            data
        );
        console.log('Create Facility Response:', response);
        
        // Handle response structure
        if (response && typeof response === 'object') {
            return response as unknown as ApiResponse<Facility>;
        } else {
            // Fallback
            return {
                isSuccess: false,
                statusCode: 500,
                message: "Invalid response format",
                data: undefined
            };
        }
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
		const axiosResponse = await apiClient().get<ApiResponse<Specialty[]>>(
            `/admin/specialties?page=${page}&size=${size}`
        );
        console.log('Raw Specialties API Response:', axiosResponse);

        const response = axiosResponse.data as any;

        // Handle different response body structures
        if (Array.isArray(response)) {
            // Direct array response
            const result: ApiResponse<Specialty[]> = {
                isSuccess: true,
                statusCode: 200,
                message: "Success",
                data: response,
                meta: {
                    pageNumber: page,
                    pageSize: size,
                    totalCount: response.length,
                    hasNextPage: false,
                    hasPreviousPage: page > 1
                }
            };
            return result;
        } else if (response && typeof response === 'object' && 'data' in response) {
            // Standard wrapped API response from backend
            return response as ApiResponse<Specialty[]>;
        } else {
            // Fallback
            const result: ApiResponse<Specialty[]> = {
                isSuccess: false,
                statusCode: 500,
                message: "Invalid response format",
                data: undefined
            };
            return result;
        }
    },

    // Get specialty by ID
    getById: async (id: string) => {
		const response = await apiClient().get<ApiResponse<Specialty>>(
            `/admin/specialties/${id}`
        );
        return response.data;
    },

    // Create new specialty
    create: async (data: any) => {
		const response = await apiClient().post<ApiResponse<string>>(
            `/admin/specialties`,
            data
        );
        console.log('Create Specialty Response:', response);
        
        // Handle response structure
        if (response && typeof response === 'object') {
            return response as unknown as ApiResponse<Specialty>;
        } else {
            // Fallback
            return {
                isSuccess: false,
                statusCode: 500,
                message: "Invalid response format",
                data: undefined
            };
        }
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
