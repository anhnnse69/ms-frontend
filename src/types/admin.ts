// Admin User Types
export interface AdminUser {
    id: string; // Guid from backend
    username: string;
    displayName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    avatarUrl: string;
    role: string;
    isDeleted: boolean;
}

// Doctor Types
export interface Doctor {
    id: string; // Guid from backend - check if available in GetAllDoctorsResponse
    userId: string; // Guid from backend
    displayName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    avatarUrl: string;
    photoUrl: string;
    yearsOfExperience: number;
    averageRating: number;
    ratingCount: number;
    specialty: string;
    specialtyId: string; // Guid from backend
    bioVi: string;
    bioEn: string;
    academicTitleVi: string;
    academicTitleEn: string;
    isDeleted: boolean;
}

// Facility Types
export interface Facility {
    id?: string; // May not have id in list response
    nameVi: string;
    nameEn: string;
    descriptionVi: string;
    descriptionEn: string;
    address: string;
    phone: string;
    email: string;
    city: string;
    type: string;
    isDeleted: boolean;
    logoUrl: string;
}

// Specialty Types
export interface Specialty {
    id?: string; // May not have id in list response
    nameVi: string;
    nameEn: string;
    descriptionVi: string;
    descriptionEn: string;
    iconUrl: string;
    isDeleted: boolean;
}

// Enums from backend
export enum SystemRole {
    Patient = 3,
    Doctor = 4,
    ITAdmin = 1,
    Staff = 2  // Using Staff for Manager
}

export enum FacilityType {
    Hospital = 0,
    Clinic = 1,
    DiagnosticCenter = 2,
    VaccinationCenter = 3
}

// Request Types
export interface CreateUserRequest {
    email: string;
    password: string;
    fullName: string;
    avatarUrl: string;
    phoneNumber: string;
    role: SystemRole;
}

export interface UpdateUserRequest {
    Username?: string;
    PasswordHash?: string;
    FullName?: string;
    DisplayName?: string;
    AvatarUrl?: string;
    Email?: string;
    PhoneNumber?: string;
    Role?: SystemRole;
    IsDeleted?: boolean;
}

export interface CreateDoctorRequest {
    userId: string; // Guid from backend
    fullName: string;
    email: string;
    phoneNumber: string;
    avatarUrl: string;
    photoUrl: string;
    bioVi: string;
    bioEn: string;
    academicTitleVi: string;
    academicTitleEn: string;
    yearsOfExperience: number;
    specialtyId: string; // Guid from backend
}

export interface UpdateDoctorRequest {
    Id?: string;
    FullName?: string;
    Email?: string;
    PhoneNumber?: string;
    AvatarUrl?: string;
    PhotoUrl?: string;
    BioVi?: string;
    BioEn?: string;
    AcademicTitleVi?: string;
    AcademicTitleEn?: string;
    YearsOfExperience?: number;
    SpecialtyId?: string;
}

export interface CreateFacilityRequest {
    nameVi: string;
    nameEn: string;
    descriptionVi: string;
    descriptionEn: string;
    logoUrl: string;
    address: string;
    phone: string;
    email: string;
    city: string;
    type: FacilityType;
}

export interface UpdateFacilityRequest {
    NameVi?: string;
    NameEn?: string;
    DescriptionVi?: string;
    DescriptionEn?: string;
    LogoUrl?: string;
    Address?: string;
    Phone?: string;
    Email?: string;
    City?: string;
    Type?: FacilityType;
}

export interface CreateSpecialtyRequest {
    nameVi: string;
    nameEn: string;
    descriptionVi: string;
    descriptionEn: string;
    iconUrl: string;
}

export interface UpdateSpecialtyRequest {
    NameVi?: string;
    NameEn?: string;
    DescriptionVi?: string;
    DescriptionEn?: string;
    IconUrl?: string;
}

// Response Wrappers
export interface ApiResponse<T> {
    isSuccess?: boolean;
    statusCode: number;
    codeMessage?: string; // Backend uses codeMessage instead of message
    message?: string;
    data?: T;
    meta?: MetaResponse;
}

export interface MetaResponse {
    pageNumber?: number;
    pageSize?: number;
    totalCount?: number;
    total?: number; // Backend might use 'total' instead of 'totalCount'
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    hasNext?: boolean; // Backend might use 'hasNext' instead of 'hasNextPage'
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
