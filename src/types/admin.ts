// Admin User Types
export interface AdminUser {
    id: string;
    username: string;
    displayName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    avatarUrl: string;
    role: string;
    isDeleted: boolean;
}

export interface CreateUserRequest {
    username: string;
    password: string;
    displayName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
    status: string;
}

export interface UpdateUserRequest {
    displayName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    status: string;
}

// Doctor Types
export interface Doctor {
    id: string;
    displayName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    avatarUrl: string;
    yearsOfExperience: number;
    averageRating: number;
    ratingCount: number;
    specialty: string;
    isDeleted: boolean;
}

export interface CreateDoctorRequest {
    displayName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    yearsOfExperience: number;
    specialtyId: string;
    description: string;
    licenseNumber: string;
    status: string;
    facilityId?: string;
    ava?: string;
}

export interface UpdateDoctorRequest {
    displayName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    yearsOfExperience: number;
    specialtyId: string;
    description: string;
    licenseNumber: string;
    ava?: string;
}

// Facility Types
export interface Facility {
    id?: string;
    nameVi: string;
    nameEn: string;
    address: string;
    phone: string;
    email: string;
    city: string;
    type: string;
    isDeleted: boolean;
    logoUrl: string;
}

export interface CreateFacilityRequest {
    nameVi: string;
    nameEn: string;
    address: string;
    phone: string;
    email: string;
    city: string;
    type: string;
    status: string;
    logo?: string;
}

export interface UpdateFacilityRequest {
    nameVi: string;
    nameEn: string;
    address: string;
    phone: string;
    email: string;
    city: string;
    type: string;
    logo?: string;
}

// Specialty Types
export interface Specialty {
    id?: string;
    nameVi: string;
    nameEn: string;
    descriptionVi: string;
    descriptionEn: string;
    iconUrl: string;
    isDeleted: boolean;
}

export interface CreateSpecialtyRequest {
    nameVi: string;
    nameEn: string;
    descriptionVi: string;
    descriptionEn: string;
    status: string;
    icon?: string;
}

export interface UpdateSpecialtyRequest {
    nameVi: string;
    nameEn: string;
    descriptionVi: string;
    descriptionEn: string;
    icon?: string;
}

// Response Wrappers
export interface ApiResponse<T> {
    isSuccess: boolean;
    statusCode: number;
    message: string;
    data?: T;
}

export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

// Auth Types
export interface AuthToken {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface CurrentUser {
    id: string;
    username: string;
    email: string;
    role: string;
    displayName: string;
    fullName?: string;
    phoneNumber?: string;
    avatarUrl?: string;
    facilityId?: string;
}
