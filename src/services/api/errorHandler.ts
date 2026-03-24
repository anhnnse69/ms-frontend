/**
 * Error handler for API responses
 * Maps error codes to user-friendly Vietnamese messages
 */

export const ERROR_MESSAGE_MAP: Record<string, string> = {
  // Doctor appointment errors (40xx series)
  'APP_MESSAGE_4011': 'Không tìm thấy thông tin bác sĩ. Vui lòng đăng nhập lại.',
  'APP_MESSAGE_4012': 'Không tìm thấy lịch hẹn. Lịch hẹn có thể đã bị xóa.',
  'APP_MESSAGE_4014': 'Bạn không có quyền quản lý lịch hẹn này.',
  
  // Success messages (20xx series)
  'APP_MESSAGE_2004': 'Lịch hẹn đã được từ chối thành công.',
  'APP_MESSAGE_2005': 'Lịch hẹn đã được xác nhận thành công.',
  
  // Generic errors
  'ERR_NETWORK': 'Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.',
  'ERR_TIMEOUT': 'Yêu cầu quá lâu. Vui lòng thử lại.',
  'ERR_UNAUTHORIZED': 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.',
  'ERR_FORBIDDEN': 'Bạn không có quyền thực hiện hành động này.',
  'ERR_UNKNOWN': 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
};

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Parse error message from response or error code
 */
export function getErrorMessage(error: any): string {
  // If error has API response structure
  if (error?.response?.data?.message) {
    const code = error.response.data.message;
    return ERROR_MESSAGE_MAP[code] || error.response.data.message || ERROR_MESSAGE_MAP['ERR_UNKNOWN'];
  }

  // If error is from axios
  if (error?.response?.status) {
    const status = error.response.status;
    if (status === 401) return ERROR_MESSAGE_MAP['ERR_UNAUTHORIZED'];
    if (status === 403) return ERROR_MESSAGE_MAP['ERR_FORBIDDEN'];
    if (status >= 500) return ERROR_MESSAGE_MAP['ERR_UNKNOWN'];
  }

  // If error is network related
  if (error?.message === 'Network Error' || !error?.response) {
    return ERROR_MESSAGE_MAP['ERR_NETWORK'];
  }

  return ERROR_MESSAGE_MAP['ERR_UNKNOWN'];
}

/**
 * Check if error is due to invalid credentials
 */
export function isAuthenticationError(error: any): boolean {
  return error?.response?.status === 401 || 
         error?.response?.data?.message === 'APP_MESSAGE_4011';
}

/**
 * Check if error is due to not found resource
 */
export function isNotFoundError(error: any): boolean {
  return error?.response?.status === 404 || 
         error?.response?.data?.message === 'APP_MESSAGE_4012';
}

/**
 * Check if error is due to authorization (permission)
 */
export function isAuthorizationError(error: any): boolean {
  return error?.response?.status === 403 || 
         error?.response?.data?.message === 'APP_MESSAGE_4014';
}
