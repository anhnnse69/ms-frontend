'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import { adminFacilitiesApi } from '@/services/api/adminApi';
import { Facility, UpdateFacilityRequest, ApiResponse } from '@/types/admin';
import { useAdminCheck } from '@/hooks/useAuth';

interface FormErrors {
    [key: string]: string;
}

export default function EditFacilityPage() {
    const params = useParams<{ id: string }>();
    const facilityId = params?.id as string;
    const { isAdmin, isLoading } = useAdminCheck();

    const [facility, setFacility] = useState<Facility | null>(null);
    const [formData, setFormData] = useState<UpdateFacilityRequest>({
        nameVi: '',
        nameEn: '',
        address: '',
        phone: '',
        email: '',
        city: '',
        type: '',
        logo: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [loadingFacility, setLoadingFacility] = useState(true);

    useEffect(() => {
        if (!isAdmin || isLoading || !facilityId) return;

        const fetchFacility = async () => {
            try {
                setLoadingFacility(true);
                const response: ApiResponse<Facility> = await adminFacilitiesApi.getById(facilityId);
                if (response.isSuccess && response.data) {
                    const f = response.data;
                    setFacility(f);
                    setFormData({
                        nameVi: f.nameVi,
                        nameEn: f.nameEn,
                        address: f.address,
                        phone: f.phone,
                        email: f.email,
                        city: f.city,
                        type: f.type,
                        logo: f.logoUrl,
                    });
                }
            } catch (error) {
                console.error('Failed to load facility detail', error);
                alert('Không thể tải thông tin cơ sở');
            } finally {
                setLoadingFacility(false);
            }
        };

        fetchFacility();
    }, [isAdmin, isLoading, facilityId]);

    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!formData.nameVi.trim()) newErrors.nameVi = 'Tên (VI) không được để trống';
        if (!formData.nameEn.trim()) newErrors.nameEn = 'Tên (EN) không được để trống';
        if (!formData.address.trim()) newErrors.address = 'Địa chỉ không được để trống';
        if (!formData.phone.trim()) newErrors.phone = 'Điện thoại không được để trống';
        if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
        if (!formData.city.trim()) newErrors.city = 'Thành phố không được để trống';
        if (!formData.type.trim()) newErrors.type = 'Loại cơ sở không được để trống';
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
            await adminFacilitiesApi.update(facilityId, formData);
            alert('Cập nhật cơ sở thành công');
            window.location.href = '/admin/facilities';
        } catch (error: any) {
            alert(`Lỗi: ${error?.response?.data?.message || 'Không thể cập nhật cơ sở'}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading || loadingFacility) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!isAdmin) return null;

    if (!facility) {
        return (
            <AdminLayout>
                <div className="max-w-2xl mx-auto">
                    <p className="text-red-500">Không tìm thấy cơ sở.</p>
                    <Link href="/admin/facilities" className="text-blue-600 underline">
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
                        <h2 className="text-3xl font-bold text-gray-900">Chỉnh sửa Cơ sở</h2>
                        <p className="text-gray-600 mt-1">Cập nhật thông tin cho cơ sở hiện tại</p>
                    </div>
                    <Link
                        href="/admin/facilities"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.address ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.city ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loại cơ sở</label>
                            <input
                                type="text"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.type ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Điện thoại</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.phone ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.email ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                        <Link
                            href="/admin/facilities"
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
