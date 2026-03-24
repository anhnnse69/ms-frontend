'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import { adminFacilitiesApi } from '@/services/api/adminApi';
import { useAdminCheck } from '@/hooks/useAuth';
import { CreateFacilityRequest, FacilityType, ApiResponse } from '@/types/admin';

interface FormErrors {
    [key: string]: string;
}

export default function CreateFacilityPage() {
    const { isAdmin, isLoading } = useAdminCheck();
    const [formData, setFormData] = useState<CreateFacilityRequest>({
        nameVi: '',
        nameEn: '',
        descriptionVi: '',
        descriptionEn: '',
        logoUrl: '',
        address: '',
        phone: '',
        email: '',
        city: '',
        type: FacilityType.Hospital,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!formData.nameVi.trim()) newErrors.nameVi = 'Tên (VI) không được để trống';
        if (!formData.nameEn.trim()) newErrors.nameEn = 'Tên (EN) không được để trống';
        if (!formData.address.trim()) newErrors.address = 'Địa chỉ không được để trống';
        if (!formData.phone.trim()) newErrors.phone = 'Điện thoại không được để trống';
        if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
        if (!formData.city.trim()) newErrors.city = 'Thành phố không được để trống';
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
                LogoUrl: formData.logoUrl || "", // Send empty string instead of null
                Address: formData.address,
                Phone: formData.phone,
                Email: formData.email,
                City: formData.city,
                Type: formData.type
            };
            
            const response = await adminFacilitiesApi.create(pascalCaseRequest);
            console.log('Create Facility Response:', response);
            
            if (response.codeMessage === "APP_MESSAGE_2000") {
                alert('Tạo cơ sở y tế thành công');
                window.location.href = '/admin/facilities';
            } else {
                alert(`Lỗi: ${response.codeMessage || 'Không thể tạo cơ sở y tế'}`);
            }
        } catch (error: any) {
            console.error('Create facility error:', error);
            alert(`Lỗi: ${error.response?.data?.message || error.message || 'Không thể tạo cơ sở y tế'}`);
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
                        <h2 className="text-3xl font-bold text-gray-900">Tạo Cơ sở mới</h2>
                        <p className="text-gray-600 mt-1">Thêm một cơ sở y tế mới vào hệ thống</p>
                    </div>
                    <Link href="/admin/facilities" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.address ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
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
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.city ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loại cơ sở</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: parseInt(e.target.value) as FacilityType })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={FacilityType.Hospital}>Bệnh viện</option>
                                <option value={FacilityType.Clinic}>Phòng khám</option>
                                <option value={FacilityType.DiagnosticCenter}>Trung tâm chẩn đoán</option>
                                <option value={FacilityType.VaccinationCenter}>Trung tâm tiêm chủng</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Điện thoại</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
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
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (Tiếng Việt)</label>
                            <textarea
                                rows={3}
                                value={formData.descriptionVi}
                                onChange={(e) => setFormData({ ...formData, descriptionVi: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Mô tả về cơ sở y tế..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (Tiếng Anh)</label>
                            <textarea
                                rows={3}
                                value={formData.descriptionEn}
                                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Facility description..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                        <input
                            type="url"
                            value={formData.logoUrl}
                            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://..."
                        />
                        <p className="text-sm text-gray-500 mt-1">URL của logo cơ sở y tế (không bắt buộc)</p>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50"
                        >
                            {submitting ? 'Đang tạo...' : 'Tạo Cơ sở'}
                        </button>
                        <Link href="/admin/facilities" className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-center">
                            Hủy
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
