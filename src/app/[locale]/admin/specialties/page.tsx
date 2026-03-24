'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { DataTable, Badge } from '@/components/ui/AdminDataTable';
import { adminSpecialtiesApi } from '@/services/api/adminApi';
import { Specialty, ApiResponse } from '@/types/admin';
import Link from 'next/link';
import { useAdminCheck } from '@/hooks/useAuth';

export default function SpecialtiesPage() {
    const { isAdmin, isLoading } = useAdminCheck();
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [specialtiesLoading, setSpecialtiesLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!isAdmin || isLoading) return;

        const fetchSpecialties = async () => {
            try {
                setSpecialtiesLoading(true);
                const response: ApiResponse<Specialty[]> = await adminSpecialtiesApi.getAll(page, pageSize);
                console.log('Specialties API Response:', response);
                console.log('Is success:', response.isSuccess);
                console.log('Response data:', response.data);
                console.log('Full response object:', JSON.stringify(response, null, 2));

                const isSuccess = response.isSuccess || response.codeMessage === "APP_MESSAGE_2000";

                if (isSuccess && response.data) {
                    console.log('Specialties data:', response.data);
                    console.log('Response meta:', response.meta);

                    const filteredSpecialties = response.data.filter(
                        (specialty) =>
                            specialty.nameVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            specialty.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    setSpecialties(filteredSpecialties);
                    setTotal(response.meta?.totalCount || response.meta?.total || 0);
                } else {
                    console.log('Response not successful or no data. isSuccess:', response.isSuccess, 'codeMessage:', response.codeMessage, 'data:', response.data);
                }
            } catch (error) {
                console.error('Failed to fetch specialties:', error);
            } finally {
                setSpecialtiesLoading(false);
            }
        };

        const timer = setTimeout(() => fetchSpecialties(), 500);
        return () => clearTimeout(timer);
    }, [isAdmin, isLoading, page, pageSize, searchTerm]);

    const handleDelete = async (specialty: Specialty) => {
        if (window.confirm(`Bạn chắc chắn muốn xóa chuyên khoa ${specialty.nameVi}?`)) {
            try {
                await adminSpecialtiesApi.delete(specialty.id!);
                setSpecialties(specialties.filter((s) => s.id !== specialty.id));
                alert('Xóa chuyên khoa thành công');
            } catch (error) {
                alert('Lỗi khi xóa chuyên khoa');
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
        { key: 'nameVi' as const, label: 'Tên (VI)' },
        { key: 'nameEn' as const, label: 'Tên (EN)' },
        { key: 'descriptionVi' as const, label: 'Mô tả (VI)', className: 'max-w-xs truncate' },
        {
            key: 'isDeleted' as const,
            label: 'Trạng thái',
            render: (value: boolean) => (
                <Badge variant={value ? 'danger' : 'success'}>
                    {value ? 'Đã xóa' : 'Hoạt động'}
                </Badge>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Quản lý Chuyên khoa</h2>
                        <p className="text-gray-600 mt-1">Tổng cộng: {total} chuyên khoa</p>
                    </div>
                    <Link
                        href="/admin/specialties/create"
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                        + Thêm Chuyên khoa
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <DataTable<Specialty>
                        columns={tableColumns}
                        data={specialties}
                        isLoading={specialtiesLoading}
                        onEdit={(specialty) => (window.location.href = `/admin/specialties/${specialty.id}`)}
                        onDelete={handleDelete}
                        emptyMessage="Không có chuyên khoa nào"
                    />
                </div>

                <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
                    <div className="text-sm text-gray-600">
                        Hiển thị {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} của {total} chuyên khoa
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 text-sm"
                        >
                            Trước
                        </button>
                        <span className="px-3 py-1">Trang {page}</span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page * pageSize >= total}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 text-sm"
                        >
                            Tiếp
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
