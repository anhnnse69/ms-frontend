'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import { adminSpecialtiesApi } from '@/services/api/adminApi';
import { useAdminCheck } from '@/hooks/useAuth';
import { CreateSpecialtyRequest, ApiResponse } from '@/types/admin';

interface FormErrors {
    [key: string]: string;
}

export default function CreateSpecialtyPage() {
    const { isAdmin, isLoading } = useAdminCheck();
    const [formData, setFormData] = useState<CreateSpecialtyRequest>({
        nameVi: '',
        nameEn: '',
        descriptionVi: '',
        descriptionEn: '',
        iconUrl: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!formData.nameVi.trim()) newErrors.nameVi = 'Tên (VI) không được để trống';
        if (!formData.nameEn.trim()) newErrors.nameEn = 'Tên (EN) không được để trống';
        if (!formData.descriptionVi.trim()) newErrors.descriptionVi = 'Mô tả (VI) không được để trống';
        if (!formData.descriptionEn.trim()) newErrors.descriptionEn = 'Mô tả (EN) không được để trống';
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
                NameVi: formData.nameVi,
                NameEn: formData.nameEn,
                DescriptionVi: formData.descriptionVi,
                DescriptionEn: formData.descriptionEn,
                IconUrl: formData.iconUrl || "" // Always include IconUrl
            };
            
            console.log('Create Specialty Request Data:', pascalCaseRequest);
            
            const response = await adminSpecialtiesApi.create(pascalCaseRequest);
            console.log('Create Specialty Response:', response);
            
            if (response.codeMessage === "APP_MESSAGE_2000") {
                alert('Tạo chuyên khoa thành công');
                window.location.href = '/admin/specialties';
            } else {
                alert(`Lỗi: ${response.codeMessage || 'Không thể tạo chuyên khoa'}`);
            }
        } catch (error: any) {
            console.error('Create specialty error:', error);
            alert(`Lỗi: ${error.response?.data?.message || error.message || 'Không thể tạo chuyên khoa'}`);
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
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Tạo Chuyên khoa mới</h2>
                        <p className="text-gray-600 mt-1">Thêm một chuyên khoa mới vào hệ thống</p>
                    </div>
                    <Link href="/admin/specialties" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                        ← Quay lại
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên (Tiếng Việt)</label>
                            <input
                                type="text"
                                value={formData.nameVi}
                                onChange={(e) => setFormData({ ...formData, nameVi: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.nameVi ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.nameVi && <p className="text-red-500 text-xs mt-1">{errors.nameVi}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên (English)</label>
                            <input
                                type="text"
                                value={formData.nameEn}
                                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.nameEn ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.nameEn && <p className="text-red-500 text-xs mt-1">{errors.nameEn}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (Tiếng Việt)</label>
                            <textarea
                                rows={3}
                                value={formData.descriptionVi}
                                onChange={(e) => setFormData({ ...formData, descriptionVi: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.descriptionVi ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.descriptionVi && <p className="text-red-500 text-xs mt-1">{errors.descriptionVi}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (English)</label>
                            <textarea
                                rows={3}
                                value={formData.descriptionEn}
                                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.descriptionEn ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.descriptionEn && <p className="text-red-500 text-xs mt-1">{errors.descriptionEn}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL</label>
                        <input
                            type="url"
                            value={formData.iconUrl}
                            onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://..."
                        />
                        <p className="text-sm text-gray-500 mt-1">URL của icon đại diện cho chuyên khoa (không bắt buộc)</p>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50"
                        >
                            {submitting ? 'Đang tạo...' : 'Tạo Chuyên khoa'}
                        </button>
                        <Link href="/admin/specialties" className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-center">
                            Hủy
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
