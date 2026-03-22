'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { DataTable, Badge } from '@/components/ui/AdminDataTable';
import { adminUsersApi } from '@/services/api/adminApi';
import { AdminUser, PaginatedResponse, ApiResponse } from '@/types/admin';
import Link from 'next/link';
import { useAdminCheck } from '@/hooks/useAuth';

export default function UsersPage() {
    const { isAdmin, isLoading } = useAdminCheck();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!isAdmin || isLoading) return;

        const fetchUsers = async () => {
            try {
                setUsersLoading(true);
                const response: ApiResponse<PaginatedResponse<AdminUser>> = await adminUsersApi.getAll(page, pageSize);
                if (response.isSuccess && response.data) {
                    const filteredUsers = response.data.items.filter(
                        (user) =>
                            user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.username.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    setUsers(filteredUsers);
                    setTotal(response.data.totalCount);
                }
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setUsersLoading(false);
            }
        };

        const timer = setTimeout(() => fetchUsers(), 500);
        return () => clearTimeout(timer);
    }, [isAdmin, isLoading, page, pageSize, searchTerm]);

    const handleDelete = async (user: AdminUser) => {
        if (window.confirm(`Bạn chắc chắn muốn xóa người dùng ${user.displayName}?`)) {
            try {
                await adminUsersApi.delete(user.id);
                setUsers(users.filter((u) => u.id !== user.id));
                alert('Xóa người dùng thành công');
            } catch (error) {
                console.error('Failed to delete user:', error);
                alert('Lỗi khi xóa người dùng');
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
        { key: 'displayName' as const, label: 'Tên hiển thị' },
        { key: 'email' as const, label: 'Email' },
        { key: 'username' as const, label: 'Tên đăng nhập' },
        {
            key: 'role' as const,
            label: 'Vai trò',
            render: (value: string) => (
                <Badge variant={value === 'ITAdmin' ? 'danger' : 'info'}>
                    {value === 'ITAdmin' ? 'Quản trị viên' : value}
                </Badge>
            ),
        },
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
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Quản lý Người dùng</h2>
                        <p className="text-gray-600 mt-1">Tổng cộng: {total} người dùng</p>
                    </div>
                    <Link
                        href="/admin/users/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        + Thêm Người dùng
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, email hoặc tên đăng nhập..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <DataTable<AdminUser>
                        columns={tableColumns}
                        data={users}
                        isLoading={usersLoading}
                        onEdit={(user) => (window.location.href = `/admin/users/${user.id}`)}
                        onDelete={handleDelete}
                        emptyMessage="Không có người dùng nào"
                    />
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
                    <div className="text-sm text-gray-600">
                        Hiển thị {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} của {total} người dùng
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
