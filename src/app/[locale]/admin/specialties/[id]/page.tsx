'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import { adminSpecialtiesApi } from '@/services/api/adminApi';
import { Specialty, UpdateSpecialtyRequest, ApiResponse } from '@/types/admin';
import { useAdminCheck } from '@/hooks/useAuth';

interface FormErrors {
    [key: string]: string;
}

export default function EditSpecialtyPage() {
    const params = useParams<{ id: string }>();
    const specialtyId = params?.id as string;
    const { isAdmin, isLoading } = useAdminCheck();

    const [specialty, setSpecialty] = useState<Specialty | null>(null);
    const [formData, setFormData] = useState<UpdateSpecialtyRequest>({
        nameVi: '',
        nameEn: '',
        descriptionVi: '',
        descriptionEn: '',
        icon: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [loadingSpecialty, setLoadingSpecialty] = useState(true);

    useEffect(() => {
        if (!isAdmin || isLoading || !specialtyId) return;

        const fetchSpecialty = async () => {
            try {
                setLoadingSpecialty(true);
                const response: ApiResponse<Specialty> = await adminSpecialtiesApi.getById(specialtyId);
                if (response.isSuccess && response.data) {
                    const s = response.data;
                    setSpecialty(s);
                    setFormData({
                        nameVi: s.nameVi,
                        nameEn: s.nameEn,
                        descriptionVi: s.descriptionVi,
                        descriptionEn: s.descriptionEn,
                        icon: s.iconUrl,
                    });
                }
            } catch (error) {
                console.error('Failed to load specialty detail', error);
                alert('Không thể tải thông tin chuyên khoa');
            } finally {
                setLoadingSpecialty(false);
            }
        };

        fetchSpecialty();
    }, [isAdmin, isLoading, specialtyId]);

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
            await adminSpecialtiesApi.update(specialtyId, formData);
            alert('Cập nhật chuyên khoa thành công');
            window.location.href = '/admin/specialties';
        } catch (error: any) {
            alert(`Lỗi: ${error?.response?.data?.message || 'Không thể cập nhật chuyên khoa'}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading || loadingSpecialty) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!isAdmin) return null;

    if (!specialty) {
        return (
            <AdminLayout>
                <div className="max-w-2xl mx-auto">
                    <p className="text-red-500">Không tìm thấy chuyên khoa.</p>
                    <Link href="/admin/specialties" className="text-blue-600 underline">
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
                        <h2 className="text-3xl font-bold text-gray-900">Chỉnh sửa Chuyên khoa</h2>
                        <p className="text-gray-600 mt-1">Cập nhật thông tin cho chuyên khoa hiện tại</p>
                    </div>
                    <Link
                        href="/admin/specialties"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                    >
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
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.nameVi ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
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
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.nameEn ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
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
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.descriptionVi ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.descriptionVi && (
                                <p className="text-red-500 text-xs mt-1">{errors.descriptionVi}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (English)</label>
                            <textarea
                                rows={3}
                                value={formData.descriptionEn}
                                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.descriptionEn ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.descriptionEn && (
                                <p className="text-red-500 text-xs mt-1">{errors.descriptionEn}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                        <Link
                            href="/admin/specialties"
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
