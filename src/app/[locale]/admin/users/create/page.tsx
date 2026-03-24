'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import { adminUsersApi } from '@/services/api/adminApi';
import { useAdminCheck } from '@/hooks/useAuth';
import { CreateUserRequest, SystemRole, ApiResponse } from '@/types/admin';

interface FormErrors {
    [key: string]: string;
}

export default function CreateUserPage() {
    const { isAdmin, isLoading } = useAdminCheck();
    const [formData, setFormData] = useState<CreateUserRequest>({
        email: '',
        password: '',
        fullName: '',
        avatarUrl: '',
        phoneNumber: '',
        role: SystemRole.Patient,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
        if (!formData.password.trim()) newErrors.password = 'Mật khẩu không được để trống';
        if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        if (!formData.fullName.trim()) newErrors.fullName = 'Tên đầy đủ không được để trống';
        if (formData.fullName.trim().length < 2) newErrors.fullName = 'Tên đầy đủ phải có ít nhất 2 ký tự';
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Số điện thoại không được để trống';
        if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.replace(/\s/g, ''))) newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
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
            
            // Convert to PascalCase for backend
            const pascalCaseRequest = {
                Email: formData.email,
                Password: formData.password,
                FullName: formData.fullName.trim(), // Trim whitespace
                PhoneNumber: formData.phoneNumber,
                Role: formData.role,
                AvatarUrl: formData.avatarUrl || "" // Always include AvatarUrl
            };
            
            const response = await adminUsersApi.create(pascalCaseRequest);
            console.log('Create User Response:', response);
            
            if (response.codeMessage === "APP_MESSAGE_2000") {
                alert('Tạo người dùng thành công');
                window.location.href = '/admin/users';
            } else {
                alert(`Lỗi: ${response.codeMessage || 'Không thể tạo người dùng'}`);
            }
        } catch (error: any) {
            console.error('Create user error:', error);
            alert(`Lỗi: ${error.response?.data?.message || error.message || 'Không thể tạo người dùng'}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!isAdmin) return null;

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Tạo Người dùng mới</h2>
                        <p className="text-gray-600 mt-1">Thêm một người dùng mới vào hệ thống</p>
                    </div>
                    <Link
                        href="/admin/users"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                    >
                        ← Quay lại
                    </Link>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                placeholder="email@example.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            <p className="text-sm text-gray-500 mt-1">Email sẽ được dùng làm tên đăng nhập</p>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                placeholder="Nhập mật khẩu (tối thiểu 8 ký tự)"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đầy đủ *</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                placeholder="Nhập tên đầy đủ"
                            />
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                placeholder="0123456789"
                            />
                            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò *</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: parseInt(e.target.value) as SystemRole })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={SystemRole.Patient}>Patient</option>
                                <option value={SystemRole.Doctor}>Doctor</option>
                                <option value={SystemRole.Staff}>Manager</option>
                                <option value={SystemRole.ITAdmin}>IT Admin</option>
                            </select>
                            <p className="text-sm text-gray-500 mt-1">
                                💡 Chọn "Doctor" để tạo user cho bác sĩ
                            </p>
                        </div>

                        {/* Avatar URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                            <input
                                type="url"
                                value={formData.avatarUrl}
                                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://..."
                            />
                            <p className="text-sm text-gray-500 mt-1">URL của avatar (không bắt buộc)</p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Đang tạo...' : 'Tạo Người dùng'}
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
