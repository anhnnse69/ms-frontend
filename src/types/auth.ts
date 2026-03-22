// Backend ApiResponse wrapper shape
export interface backendMetaResponse {
    page: number;
    size: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

// Align with possible PascalCase / camelCase JSON
export interface backendApiResponse<T> {
    codeMessage?: string;
    CodeMessage?: string;
    data?: T | null;
    Data?: T | null;
    meta?: backendMetaResponse | null;
    Meta?: backendMetaResponse | null;
}

// DTOs based on backend contracts
export interface loginRequestDto {
    EmailAddress: string;
    Password: string;
}

export interface loginResponseDto {
    token?: string;
    Token?: string;
}

export interface registerRequestDto {
    FullName: string;
    EmailAddress: string;
    Password: string;
    PhoneNumber: string;
    DateOfBirth: string; // ISO string
    Gender: number; // 0 = Male, 1 = Female, 2 = Other
}

export interface registerResponseDto {
    email?: string;
    Email?: string;
    fullName?: string;
    FullName?: string;
}

export interface forgotPasswordRequestDto {
    Email: string;
}

export interface forgotPasswordResponseDto {
    message?: string;
    Message?: string;
}

export interface verifyOtpRequestDto {
    OtpCode: string;
}

export interface verifyOtpResponseDto {
    resetToken?: string;
    ResetToken?: string;
}

export interface resetPasswordRequestDto {
    ResetToken: string;
    NewPassword: string;
    ConfirmPassword: string;
}

export interface resetPasswordResponseDto {
    message?: string;
    Message?: string;
}
