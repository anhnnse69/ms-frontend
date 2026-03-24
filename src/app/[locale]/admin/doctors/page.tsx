'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { DataTable, Badge } from '@/components/ui/AdminDataTable';
import { adminDoctorsApi } from '@/services/api/adminApi';
import { Doctor, ApiResponse } from '@/types/admin';
import Link from 'next/link';
import { useAdminCheck } from '@/hooks/useAuth';

export default function DoctorsPage() {
    const { isAdmin, isLoading } = useAdminCheck();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [doctorsLoading, setDoctorsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!isAdmin || isLoading) return;

        const fetchDoctors = async () => {
            try {
                setDoctorsLoading(true);
                const response: ApiResponse<Doctor[]> = await adminDoctorsApi.getAll(page, pageSize);
                console.log('Doctors API Response:', response);
                console.log('Is success:', response.isSuccess);
                console.log('Response data:', response.data);
                console.log('Full response object:', JSON.stringify(response, null, 2));
                
                // Check for different success indicators
                const isSuccess = response.isSuccess || response.codeMessage === "APP_MESSAGE_2000";
                
                if (isSuccess && response.data) {
                    console.log('Users data:', response.data);
                    console.log('Response meta:', response.meta);
                    
                    // Handle both id and Id fields from backend
                    const doctorsWithId = response.data.map(doctor => ({
                        ...doctor,
                        id: doctor.id || (doctor as any).Id
                    }));
                    
                    const filteredDoctors = doctorsWithId.filter(
                        (doctor) =>
                            doctor.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    setDoctors(filteredDoctors);
                    setTotal(response.meta?.totalCount || response.meta?.total || 0);
                } else {
                    console.log('Response not successful or no data. isSuccess:', response.isSuccess, 'codeMessage:', response.codeMessage, 'data:', response.data);
                }
            } catch (error) {
                console.error('Failed to fetch doctors:', error);
            } finally {
                setDoctorsLoading(false);
            }
        };

        const timer = setTimeout(() => fetchDoctors(), 500);
        return () => clearTimeout(timer);
    }, [isAdmin, isLoading, page, pageSize, searchTerm]);

    const handleDelete = async (doctor: Doctor) => {
        if (window.confirm(`Bạn chắc chắn muốn xóa bác sĩ ${doctor.displayName}?`)) {
            try {
                await adminDoctorsApi.delete(doctor.id);
                setDoctors(doctors.filter((d) => d.id !== doctor.id));
                alert('Xóa bác sĩ thành công');
            } catch (error) {
                console.error('Failed to delete doctor:', error);
                alert('Lỗi khi xóa bác sĩ');
            }
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

    const tableColumns = [
        { key: 'displayName' as keyof Doctor, label: 'Tên hiển thị' },
        { key: 'email' as keyof Doctor, label: 'Email' },
        { key: 'specialty' as keyof Doctor, label: 'Chuyên khoa' },
        { key: 'yearsOfExperience' as keyof Doctor, label: 'Kinh nghiệm (năm)' },
        {
            key: 'averageRating' as keyof Doctor,
            label: 'Xếp hạng',
            render: (value: number, item: Doctor) => (
                <span>
                    ⭐ {value.toFixed(1)} ({item.ratingCount} đánh giá)
                </span>
            ),
        },
        {
            key: 'isDeleted' as keyof Doctor,
            label: 'Trạng thái',
            render: (value: boolean) => (
                <Badge variant={value ? 'danger' : 'success'}>
                    {value ? 'Đã xóa' : 'Hoạt động'}
                </Badge>
            ),
        },
        {
            key: 'actions' as any,
            label: 'Hành động',
            render: (_: any, row: Doctor) => (
                <div className="flex space-x-2">
                    <Link
                        href={`/admin/doctors/${row.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Sửa
                    </Link>
                    <button
                        onClick={() => handleDelete(row)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                        Xóa
                    </button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Quản lý Bác sĩ</h2>
                        <p className="text-gray-600 mt-1">Tổng cộng: {total} bác sĩ</p>
                    </div>
                    <Link
                        href="/admin/doctors/create"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        + Thêm Bác sĩ
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, email hoặc chuyên khoa..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <DataTable<Doctor>
                        columns={tableColumns}
                        data={doctors}
                        isLoading={doctorsLoading}
                        onEdit={(doctor) => (window.location.href = `/admin/doctors/${doctor.id}`)}
                        onDelete={handleDelete}
                        emptyMessage="Không có bác sĩ nào"
                    />
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
                    <div className="text-sm text-gray-600">
                        Hiển thị {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} của {total} bác sĩ
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            Trước
                        </button>
                        <span className="px-3 py-1">Trang {page}</span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page * pageSize >= total}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            Tiếp
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
