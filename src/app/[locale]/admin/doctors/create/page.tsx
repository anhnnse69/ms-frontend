'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import { adminDoctorsApi, adminSpecialtiesApi, adminUsersApi } from '@/services/api/adminApi';
import { useAdminCheck } from '@/hooks/useAuth';
import { CreateDoctorRequest, Specialty, AdminUser, ApiResponse } from '@/types/admin';

interface FormErrors {
    [key: string]: string;
}

export default function CreateDoctorPage() {
    const { isAdmin, isLoading } = useAdminCheck();
    const [formData, setFormData] = useState<CreateDoctorRequest>({
        userId: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        avatarUrl: '',
        photoUrl: '',
        bioVi: '',
        bioEn: '',
        academicTitleVi: '',
        academicTitleEn: '',
        yearsOfExperience: 0,
        specialtyId: '',
    });
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [doctorUsers, setDoctorUsers] = useState<AdminUser[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    // Load specialties and doctor users for dropdowns
    React.useEffect(() => {
        const loadData = async () => {
            try {
                // Load specialties
                const specialtiesResponse: ApiResponse<Specialty[]> = await adminSpecialtiesApi.getAll(1, 100);
                console.log('Specialties response:', specialtiesResponse);
                if (specialtiesResponse.codeMessage === "APP_MESSAGE_2000" && specialtiesResponse.data) {
                    console.log('Specialties data:', specialtiesResponse.data);
                    
                    // Check if specialties have Id field after backend fix
                    const hasIdField = specialtiesResponse.data.some((s: any) => s.id);
                    console.log('Has Id field:', hasIdField);
                    
                    // Debug first specialty
                    if (specialtiesResponse.data.length > 0) {
                        console.log('First specialty:', specialtiesResponse.data[0]);
                    }
                    
                    setSpecialties(specialtiesResponse.data);
                }

                // Load users with Doctor role
                const usersResponse: ApiResponse<AdminUser[]> = await adminUsersApi.getAll(1, 100);
                if (usersResponse.codeMessage === "APP_MESSAGE_2000" && usersResponse.data) {
                    const doctorRoleUsers = usersResponse.data.filter(user => 
                        user.role === 'Doctor' || user.role.toLowerCase() === 'doctor'
                    );
                    setDoctorUsers(doctorRoleUsers);
                }
            } catch (error) {
                console.error('Failed to load data:', error);
            }
        };
        loadData();
    }, []);

    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!formData.userId.trim()) newErrors.userId = 'User ID không được để trống';
        if (!formData.fullName.trim()) newErrors.fullName = 'Tên đầy đủ không được để trống';
        if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Số điện thoại không được để trống';
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
            
            // Convert to PascalCase for backend
            const pascalCaseRequest = {
                UserId: formData.userId,
                FullName: formData.fullName || "", // Always include FullName
                Email: formData.email,
                PhoneNumber: formData.phoneNumber,
                AvatarUrl: formData.avatarUrl || "", // Always include AvatarUrl
                PhotoUrl: formData.photoUrl || "", // Always include PhotoUrl
                BioVi: formData.bioVi,
                BioEn: formData.bioEn,
                AcademicTitleVi: formData.academicTitleVi,
                AcademicTitleEn: formData.academicTitleEn,
                YearsOfExperience: formData.yearsOfExperience,
                SpecialtyId: formData.specialtyId // Use ID from dropdown
            };
            
            console.log('Create Doctor Request Data:', pascalCaseRequest);
            
            const response = await adminDoctorsApi.create(pascalCaseRequest);
            console.log('Create Doctor Response:', response);
            
            if (response.codeMessage === "APP_MESSAGE_2000") {
                alert('Tạo bác sĩ thành công');
                window.location.href = '/admin/doctors';
            } else {
                alert(`Lỗi: ${response.codeMessage || 'Không thể tạo bác sĩ'}`);
            }
        } catch (error: any) {
            console.error('Create doctor error:', error);
            alert(`Lỗi: ${error.response?.data?.message || error.message || 'Không thể tạo bác sĩ'}`);
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
                        <h2 className="text-3xl font-bold text-gray-900">Tạo Bác sĩ mới</h2>
                        <p className="text-gray-600 mt-1">Thêm một bác sĩ mới vào hệ thống</p>
                        <p className="text-sm text-blue-600 mt-2">
                            💡 Lưu ý: Cần tạo User với vai trò "Doctor" trước khi tạo Doctor profile
                        </p>
                    </div>
                    <Link
                        href="/admin/users/create"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        + Tạo User Doctor
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">User Doctor *</label>
                            <select
                                value={formData.userId}
                                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.userId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            >
                                <option value="">-- Chọn User Doctor --</option>
                                {doctorUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.fullName} ({user.email})
                                    </option>
                                ))}
                            </select>
                            {doctorUsers.length === 0 && (
                                <p className="text-sm text-orange-600 mt-1">
                                    ⚠️ Không có User nào có vai trò "Doctor". 
                                    <Link href="/admin/users/create" className="text-blue-600 underline ml-1">
                                        Tạo User Doctor mới
                                    </Link>
                                </p>
                            )}
                            {errors.userId && <p className="text-red-500 text-xs mt-1">{errors.userId}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đầy đủ *</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                            <input
                                type="url"
                                value={formData.avatarUrl}
                                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
                            <input
                                type="url"
                                value={formData.photoUrl}
                                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa *</label>
                            <select
                                value={formData.specialtyId}
                                onChange={(e) => setFormData({ ...formData, specialtyId: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.specialtyId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            >
                                <option value="">-- Chọn chuyên khoa --</option>
                                {specialties.map((specialty: any) => (
                                    <option key={specialty.id || specialty.nameVi} value={specialty.id || specialty.nameVi}>
                                        {specialty.nameVi}
                                    </option>
                                ))}
                            </select>
                            {errors.specialtyId && <p className="text-red-500 text-xs mt-1">{errors.specialtyId}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kinh nghiệm (năm)</label>
                            <input
                                type="number"
                                min="0"
                                max="60"
                                value={formData.yearsOfExperience}
                                onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Học vị (Tiếng Việt)</label>
                            <input
                                type="text"
                                value={formData.academicTitleVi}
                                onChange={(e) => setFormData({ ...formData, academicTitleVi: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Bác sĩ, Thạc sĩ, Tiến sĩ..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Học vị (Tiếng Anh)</label>
                            <input
                                type="text"
                                value={formData.academicTitleEn}
                                onChange={(e) => setFormData({ ...formData, academicTitleEn: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="MD, MS, PhD..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiểu sử (Tiếng Việt)</label>
                        <textarea
                            value={formData.bioVi}
                            onChange={(e) => setFormData({ ...formData, bioVi: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Thông tin tiểu sử của bác sĩ..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiểu sử (Tiếng Anh)</label>
                        <textarea
                            value={formData.bioEn}
                            onChange={(e) => setFormData({ ...formData, bioEn: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Doctor biography..."
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Link
                            href="/admin/doctors"
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                        >
                            ← Quay lại
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting || doctorUsers.length === 0}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Đang tạo...' : 'Tạo Bác sĩ'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
