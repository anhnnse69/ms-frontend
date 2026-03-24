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
    const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editSpecialty, setEditSpecialty] = useState<Specialty | null>(null);

    const handleDelete = async (specialty: Specialty) => {
        if (!specialty.id) {
            alert('Không tìm thấy ID chuyên khoa');
            return;
        }
        if (window.confirm(`Bạn chắc chắn muốn xóa chuyên khoa ${specialty.nameVi}?`)) {
            try {
                await adminSpecialtiesApi.delete(specialty.id);
                setSpecialties((prev) => prev.filter((s) => s.id !== specialty.id));
                alert('Xóa chuyên khoa thành công');
            } catch (error) {
                console.error('Failed to delete specialty:', error);
                alert('Lỗi khi xóa chuyên khoa');
            }
        }
    };

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
                        onEdit={(specialty) => {
                            setSelectedSpecialty(specialty);
                            setEditSpecialty(specialty);
                            setShowEditModal(true);
                        }}
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

                {showEditModal && selectedSpecialty && (
                    <div
						className="fixed inset-0 m-0 bg-gray-500/40 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={() => {
                            setShowEditModal(false);
                            setSelectedSpecialty(null);
                            setEditSpecialty(null);
                        }}
                    >
                        <div
                            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold mb-4">Chỉnh sửa chuyên khoa</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên (VI)</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={editSpecialty?.nameVi ?? ''}
                                        onChange={(e) =>
                                            setEditSpecialty((prev) =>
                                                prev ? { ...prev, nameVi: e.target.value } : prev
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên (EN)</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={editSpecialty?.nameEn ?? ''}
                                        onChange={(e) =>
                                            setEditSpecialty((prev) =>
                                                prev ? { ...prev, nameEn: e.target.value } : prev
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (VI)</label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        rows={3}
                                        value={editSpecialty?.descriptionVi ?? ''}
                                        onChange={(e) =>
                                            setEditSpecialty((prev) =>
                                                prev
                                                    ? { ...prev, descriptionVi: e.target.value }
                                                    : prev
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (EN)</label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        rows={3}
                                        value={editSpecialty?.descriptionEn ?? ''}
                                        onChange={(e) =>
                                            setEditSpecialty((prev) =>
                                                prev
                                                    ? { ...prev, descriptionEn: e.target.value }
                                                    : prev
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedSpecialty(null);
                                        setEditSpecialty(null);
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
                                    onClick={async () => {
                                        if (!selectedSpecialty || !editSpecialty) return;
                                        if (!selectedSpecialty.id) {
                                            alert('Không tìm thấy ID chuyên khoa');
                                            return;
                                        }
                                        try {
                                            setSpecialtiesLoading(true);
                                            await adminSpecialtiesApi.update(selectedSpecialty.id, {
                                                NameVi: editSpecialty.nameVi,
                                                NameEn: editSpecialty.nameEn,
                                                DescriptionVi: editSpecialty.descriptionVi,
                                                DescriptionEn: editSpecialty.descriptionEn,
                                            } as any);

                                            setSpecialties((prev) =>
                                                prev.map((s) =>
                                                    s.id === selectedSpecialty.id
                                                        ? { ...s, ...editSpecialty }
                                                        : s
                                                )
                                            );

                                            setShowEditModal(false);
                                            setSelectedSpecialty(null);
                                            setEditSpecialty(null);
                                        } catch (error) {
                                            console.error('Failed to update specialty:', error);
                                            alert('Lỗi khi cập nhật chuyên khoa');
                                        } finally {
                                            setSpecialtiesLoading(false);
                                        }
                                    }}
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
