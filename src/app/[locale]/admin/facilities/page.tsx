'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { DataTable, Badge } from '@/components/ui/AdminDataTable';
import { adminFacilitiesApi } from '@/services/api/adminApi';
import { Facility, ApiResponse } from '@/types/admin';
import Link from 'next/link';
import { useAdminCheck } from '@/hooks/useAuth';

export default function FacilitiesPage() {
    const { isAdmin, isLoading } = useAdminCheck();
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [facilitiesLoading, setFacilitiesLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!isAdmin || isLoading) return;

        const fetchFacilities = async () => {
            try {
                setFacilitiesLoading(true);
                const response: ApiResponse<Facility[]> = await adminFacilitiesApi.getAll(page, pageSize);
                console.log('Facilities API Response:', response);
                console.log('Is success:', response.isSuccess);
                console.log('Response data:', response.data);
                console.log('Full response object:', JSON.stringify(response, null, 2));

                const isSuccess = response.isSuccess || response.codeMessage === "APP_MESSAGE_2000";

                if (isSuccess && response.data) {
                    console.log('Facilities data:', response.data);
                    console.log('Response meta:', response.meta);

                    const filteredFacilities = response.data.filter(
                        (facility) =>
                            facility.nameVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            facility.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            facility.address.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    setFacilities(filteredFacilities);
                    setTotal(response.meta?.totalCount || response.meta?.total || 0);
                } else {
                    console.log('Response not successful or no data. isSuccess:', response.isSuccess, 'codeMessage:', response.codeMessage, 'data:', response.data);
                }
            } catch (error) {
                console.error('Failed to fetch facilities:', error);
            } finally {
                setFacilitiesLoading(false);
            }
        };

        const timer = setTimeout(() => fetchFacilities(), 500);
        return () => clearTimeout(timer);
    }, [isAdmin, isLoading, page, pageSize, searchTerm]);

    const handleDelete = async (facility: Facility) => {
        if (window.confirm(`Bạn chắc chắn muốn xóa cơ sở ${facility.nameVi}?`)) {
            try {
                await adminFacilitiesApi.delete(facility.id!);
                setFacilities(facilities.filter((f) => f.id !== facility.id));
                alert('Xóa cơ sở thành công');
            } catch (error) {
                alert('Lỗi khi xóa cơ sở');
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
        { key: 'nameVi' as keyof Facility, label: 'Tên tiếng Việt' },
        { key: 'nameEn' as keyof Facility, label: 'Tên tiếng Anh' },
        { key: 'address' as keyof Facility, label: 'Địa chỉ' },
        { key: 'phone' as keyof Facility, label: 'Điện thoại' },
        { key: 'email' as keyof Facility, label: 'Email' },
        { key: 'city' as keyof Facility, label: 'Thành phố' },
        {
            key: 'type' as keyof Facility,
            label: 'Loại',
            render: (value: string) => (
                <Badge variant={value === 'Hospital' ? 'info' : 'info'}>
                    {value === 'Hospital' ? 'Bệnh viện' : 
                     value === 'Clinic' ? 'Phòng khám' :
                     value === 'DiagnosticCenter' ? 'Trung tâm chẩn đoán' : 'Trung tâm tiêm chủng'}
                </Badge>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Quản lý Cơ sở Y tế</h2>
                        <p className="text-gray-600 mt-1">Tổng cộng: {total} cơ sở</p>
                    </div>
                    <Link
                        href="/admin/facilities/create"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                        + Thêm Cơ sở
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, địa chỉ..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <DataTable<Facility>
                        columns={tableColumns}
                        data={facilities}
                        isLoading={facilitiesLoading}
                        onEdit={(facility) => (window.location.href = `/admin/facilities/${facility.id}`)}
                        onDelete={handleDelete}
                        emptyMessage="Không có cơ sở nào"
                    />
                </div>

                <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
                    <div className="text-sm text-gray-600">
                        Hiển thị {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} của {total} cơ sở
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
