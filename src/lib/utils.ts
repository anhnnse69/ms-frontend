import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Translate backend message codes to user-friendly messages
 */
export function translateMessageCode(code: string): string {
  const messageMap: Record<string, string> = {
    'APP_MESSAGE_2000': 'Mật khẩu đã được thay đổi thành công',
    'APP_MESSAGE_4010': 'Người dùng không tồn tại',
    'APP_MESSAGE_4016': 'Mật khẩu hiện tại không đúng',
    'APP_MESSAGE_4003': 'Trường này là bắt buộc',
    'APP_MESSAGE_4019': 'Mật khẩu phải có ít nhất 8 ký tự và bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
    'APP_MESSAGE_4024': 'Mật khẩu không được chứa thẻ HTML',
    'APP_MESSAGE_4025': 'Mật khẩu chứa ký tự không hợp lệ',
  };

  return messageMap[code] || code; // Return original code if not found
}
