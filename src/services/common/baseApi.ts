import axios from 'axios';

// Base URL lấy từ biến môi trường
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Lấy token từ localStorage (chỉ chạy trên client)
const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken');
    }
    return null;
};

// Tạo axios instance dùng chung
export const apiClient = () => {
    const token = getAuthToken();

    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });
};

export default apiClient;
