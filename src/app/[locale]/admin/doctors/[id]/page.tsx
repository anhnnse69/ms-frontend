'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import { adminDoctorsApi } from '@/services/api/adminApi';
import { Doctor, UpdateDoctorRequest, ApiResponse } from '@/types/admin';
import { useAdminCheck } from '@/hooks/useAuth';

interface FormErrors {
    [key: string]: string;
}

export default function EditDoctorPage() {
    const params = useParams<{ id: string }>();
    const doctorId = params?.id as string;
    const { isAdmin, isLoading } = useAdminCheck();

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [formData, setFormData] = useState<UpdateDoctorRequest>({
        displayName: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        yearsOfExperience: 0,
        specialtyId: '',
        description: '',
        licenseNumber: '',
        ava: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [loadingDoctor, setLoadingDoctor] = useState(true);

    useEffect(() => {
        if (!isAdmin || isLoading || !doctorId) return;

        const fetchDoctor = async () => {
            try {
                setLoadingDoctor(true);
                const response: ApiResponse<Doctor> = await adminDoctorsApi.getById(doctorId);
                if (response.isSuccess && response.data) {
                    const d = response.data;
                    setDoctor(d);
                    setFormData({
                        displayName: d.displayName,
                        fullName: d.fullName,
                        email: d.email,
                        phoneNumber: d.phoneNumber,
                        yearsOfExperience: d.yearsOfExperience,
                        specialtyId: '',
                        description: '',
                        licenseNumber: '',
                        ava: d.avatarUrl,
                    });
                }
            } catch (error) {
                console.error('Failed to load doctor detail', error);
                alert('Không thể tải thông tin bác sĩ');
            } finally {
                setLoadingDoctor(false);
            }
        };

        fetchDoctor();
    }, [isAdmin, isLoading, doctorId]);

    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!formData.displayName.trim()) newErrors.displayName = 'Tên hiển thị không được để trống';
        if (!formData.fullName.trim()) newErrors.fullName = 'Tên đầy đủ không được để trống';
        if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
        if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'Số giấy phép không được để trống';
        if (!formData.specialtyId.trim()) newErrors.specialtyId = 'Chuyên khoa không được để trống';
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
            await adminDoctorsApi.update(doctorId, formData);
            alert('Cập nhật bác sĩ thành công');
            window.location.href = '/admin/doctors';
        } catch (error: any) {
            alert(`Lỗi: ${error?.response?.data?.message || 'Không thể cập nhật bác sĩ'}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading || loadingDoctor) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!isAdmin) return null;

    if (!doctor) {
        return (
            <AdminLayout>
                <div className="max-w-2xl mx-auto">
                    <p className="text-red-500">Không tìm thấy bác sĩ.</p>
                    <Link href="/admin/doctors" className="text-blue-600 underline">
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
                        <h2 className="text-3xl font-bold text-gray-900">Chỉnh sửa Bác sĩ</h2>
                        <p className="text-gray-600 mt-1">Cập nhật thông tin cho bác sĩ hiện tại</p>
                    </div>
                    <Link
                        href="/admin/doctors"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                    >
                        ← Quay lại
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa (ID)</label>
                            <input
                                type="text"
                                value={formData.specialtyId}
                                onChange={(e) => setFormData({ ...formData, specialtyId: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.specialtyId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.specialtyId && <p className="text-red-500 text-xs mt-1">{errors.specialtyId}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kinh nghiệm (năm)</label>
                            <input
                                type="number"
                                value={formData.yearsOfExperience}
                                onChange={(e) =>
                                    setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số giấy phép</label>
                            <input
                                type="text"
                                value={formData.licenseNumber}
                                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.licenseNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.licenseNumber && (
                                <p className="text-red-500 text-xs mt-1">{errors.licenseNumber}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                        <Link
                            href="/admin/doctors"
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
