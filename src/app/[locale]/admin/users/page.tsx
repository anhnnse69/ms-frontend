'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { DataTable, Badge } from '@/components/ui/AdminDataTable';
import { adminUsersApi } from '@/services/api/adminApi';
import { AdminUser, ApiResponse } from '@/types/admin';
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
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        if (!isAdmin || isLoading) return;

        const fetchUsers = async () => {
            try {
                setUsersLoading(true);
                const response: ApiResponse<AdminUser[]> = await adminUsersApi.getAll(page, pageSize);
                console.log('Users API Response:', response);
                console.log('Is success:', response.isSuccess);
                console.log('Response data:', response.data);
                console.log('Full response object:', JSON.stringify(response, null, 2));

                const isSuccess = response.isSuccess || response.codeMessage === "APP_MESSAGE_2000";

                if (isSuccess && response.data) {
                    console.log('Users data:', response.data);
                    console.log('Response meta:', response.meta);

                    const usersWithId = response.data.map(user => ({
                        ...user,
                        id: user.id || (user as any).Id
                    }));

                    const filteredUsers = usersWithId.filter(
                        (user) =>
                            user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    setUsers(filteredUsers);
                    setTotal(response.meta?.totalCount || response.meta?.total || 0);
                } else {
                    console.log('Response not successful or no data. isSuccess:', response.isSuccess, 'codeMessage:', response.codeMessage, 'data:', response.data);
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
                setUsers((prev) => prev.filter((u) => u.id !== user.id));
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
        { key: 'displayName' as keyof AdminUser, label: 'Tên hiển thị' },
        { key: 'email' as keyof AdminUser, label: 'Email' },
        { key: 'username' as keyof AdminUser, label: 'Tên đăng nhập' },
        {
            key: 'role' as keyof AdminUser,
            label: 'Vai trò',
            render: (value: string) => (
                <Badge variant={value === 'ITAdmin' ? 'danger' : 'info'}>
                    {value === 'ITAdmin' ? 'Quản trị viên' : value}
                </Badge>
            ),
        },
        {
            key: 'isDeleted' as keyof AdminUser,
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
                        onEdit={(user) => {
                            setSelectedUser(user);
                            setEditUser(user);
                            setShowEditModal(true);
                        }}
                        onDelete={handleDelete}
                        emptyMessage="Không có người dùng nào"
                    />
                </div>

                {showEditModal && selectedUser && (
                    <div
						className="fixed inset-0 m-0 bg-gray-500/40 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={() => {
                            setShowEditModal(false);
                            setSelectedUser(null);
                            setEditUser(null);
                        }}
                    >
                        <div
                            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold mb-4">Chỉnh sửa người dùng</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={editUser?.displayName ?? ''}
                                        onChange={(e) =>
                                            setEditUser((prev) =>
                                                prev ? { ...prev, displayName: e.target.value } : prev
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={editUser?.email ?? ''}
                                        onChange={(e) =>
                                            setEditUser((prev) =>
                                                prev ? { ...prev, email: e.target.value } : prev
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={editUser?.username ?? ''}
                                        onChange={(e) =>
                                            setEditUser((prev) =>
                                                prev ? { ...prev, username: e.target.value } : prev
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
                                        setSelectedUser(null);
                                        setEditUser(null);
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
                                    onClick={async () => {
                                        if (!selectedUser || !editUser) return;
                                        try {
                                            setUsersLoading(true);
                                            await adminUsersApi.update(selectedUser.id, {
                                                DisplayName: editUser.displayName,
                                                Email: editUser.email,
                                                Username: editUser.username,
                                            } as any);

                                            setUsers((prev) =>
                                                prev.map((u) =>
                                                    u.id === selectedUser.id ? { ...u, ...editUser } : u
                                                )
                                            );

                                            setShowEditModal(false);
                                            setSelectedUser(null);
                                            setEditUser(null);
                                        } catch (error) {
                                            console.error('Failed to update user:', error);
                                            alert('Lỗi khi cập nhật người dùng');
                                        } finally {
                                            setUsersLoading(false);
                                        }
                                    }}
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
