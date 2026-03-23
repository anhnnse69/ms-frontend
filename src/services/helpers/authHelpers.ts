import type { CurrentUser } from '@/types/admin';

export const parseJwt = (token: string): any | null => {
    try {
        const [, payload] = token.split('.');
        if (!payload) return null;
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
        const json = atob(padded);
        return JSON.parse(json);
    } catch {
        return null;
    }
};

export const buildCurrentUserFromToken = (token: string): CurrentUser | null => {
    const payload = parseJwt(token);
    if (!payload) return null;

    const role =
        payload.role ||
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        '';

    // Try multiple common claim names for email/username/full name
    const email =
        payload.email ||
        payload.Email ||
        payload.emailAddress ||
        payload.EmailAddress ||
        '';

    const username =
        payload.username ||
        payload.userName ||
        payload.UserName ||
        email ||
        '';

    const fullName =
        payload.fullName ||
        payload.FullName ||
        payload.name ||
        '';

    const id = payload.userId || payload.nameid || payload.sub || '';
    const displayName = fullName || username || email;

    return {
        id: id || email || 'unknown',
        // Đừng gán 'unknown' để UI không hiển thị chuỗi này
        username: username || email || '',
        email: email || '',
        role: role || '',
        displayName: displayName || username || email || 'User',
        fullName: fullName || undefined,
        avatarUrl: payload.avatarUrl || payload.avatar || payload.picture || undefined,
        phoneNumber:
            payload.phoneNumber ||
            payload.phone ||
            payload.PhoneNumber ||
            payload.phone_number ||
            undefined,
    };
};

export const persistAuth = (token: string) => {
    if (typeof window === 'undefined') return;

    localStorage.setItem('accessToken', token);
    const user = buildCurrentUserFromToken(token);
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        // Thông báo cho các hook/useAuth khác biết trạng thái auth đã thay đổi
        window.dispatchEvent(new CustomEvent('auth-changed'));
    }
};
