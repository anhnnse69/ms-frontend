'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import { adminUsersApi } from '@/services/api/adminApi';
import { AdminUser, UpdateUserRequest, ApiResponse } from '@/types/admin';
import { useAdminCheck } from '@/hooks/useAuth';

interface FormErrors {
    [key: string]: string;
}

export default function EditUserPage() {
    const params = useParams<{ id: string }>();
    const userId = params?.id as string;
    const { isAdmin, isLoading } = useAdminCheck();

    const [user, setUser] = useState<AdminUser | null>(null);
    const [formData, setFormData] = useState<UpdateUserRequest>({
        displayName: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        status: 'Active',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        if (!isAdmin || isLoading || !userId) return;

        const fetchUser = async () => {
            try {
                setLoadingUser(true);
                const response: ApiResponse<AdminUser> = await adminUsersApi.getById(userId);
                if (response.isSuccess && response.data) {
                    const u = response.data;
                    setUser(u);
                    setFormData({
                        displayName: u.displayName,
                        fullName: u.fullName,
                        email: u.email,
                        phoneNumber: u.phoneNumber,
                        status: 'Active',
                    });
                }
            } catch (error) {
                console.error('Failed to load user detail', error);
                alert('Không thể tải thông tin người dùng');
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUser();
    }, [isAdmin, isLoading, userId]);

    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!formData.displayName.trim()) newErrors.displayName = 'Tên hiển thị không được để trống';
        if (!formData.fullName.trim()) newErrors.fullName = 'Tên đầy đủ không được để trống';
        if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
        if (formData.phoneNumber && !/^\d{10,}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
            newErrors.phoneNumber = 'Số điện thoại phải có ít nhất 10 chữ số';
        }
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setSubmitting(true);
            await adminUsersApi.update(userId, formData);
            alert('Cập nhật người dùng thành công');
            window.location.href = '/admin/users';
        } catch (error: any) {
            alert(`Lỗi: ${error?.response?.data?.message || 'Không thể cập nhật người dùng'}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading || loadingUser) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!isAdmin) return null;

    if (!user) {
        return (
            <AdminLayout>
                <div className="max-w-2xl mx-auto">
                    <p className="text-red-500">Không tìm thấy người dùng.</p>
                    <Link href="/admin/users" className="text-blue-600 underline">
                        ← Quay lại danh sách
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Chỉnh sửa Người dùng</h2>
                        <p className="text-gray-600 mt-1">Cập nhật thông tin cho tài khoản hiện tại</p>
                    </div>
                    <Link
                        href="/admin/users"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                    >
                        ← Quay lại
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                            <input
                                type="text"
                                value={user.username}
                                disabled
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                            <input
                                type="text"
                                value={user.role}
                                disabled
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị</label>
                            <input
                                type="text"
                                value={formData.displayName}
                                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.displayName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.displayName && <p className="text-red-500 text-xs mt-1">{errors.displayName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đầy đủ</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Active">Hoạt động</option>
                                <option value="Inactive">Không hoạt động</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                        <Link
                            href="/admin/users"
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
                        >
                            Hủy
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
