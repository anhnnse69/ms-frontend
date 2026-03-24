'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAdminCheck } from '@/hooks/useAuth';
import { adminUsersApi, adminDoctorsApi, adminFacilitiesApi, adminSpecialtiesApi } from '@/services/api/adminApi';

interface DashboardStats {
    totalUsers: number;
    totalDoctors: number;
    totalFacilities: number;
    totalSpecialties: number;
}

const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) => (
    <div className={`${color} rounded-lg shadow-md p-6 text-white`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium opacity-90">{title}</p>
                <p className="text-3xl font-bold mt-2">{value}</p>
            </div>
            <div className="text-5xl opacity-30">{icon}</div>
        </div>
    </div>
);

export default function AdminDashboard() {
    const { isAdmin, isLoading } = useAdminCheck();
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalDoctors: 0,
        totalFacilities: 0,
        totalSpecialties: 0,
    });
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        if (!isAdmin || isLoading) return;

        const fetchStats = async () => {
            try {
                setStatsLoading(true);
                const [usersRes, doctorsRes, facilitiesRes, specialtiesRes] = await Promise.all([
                    adminUsersApi.getAll(1, 1),
                    adminDoctorsApi.getAll(1, 1),
                    adminFacilitiesApi.getAll(1, 1),
                    adminSpecialtiesApi.getAll(1, 1),
                ]);

                setStats({
                    totalUsers: usersRes.meta?.totalCount || 0,
                    totalDoctors: doctorsRes.meta?.totalCount || 0,
                    totalFacilities: facilitiesRes.meta?.totalCount || 0,
                    totalSpecialties: specialtiesRes.meta?.totalCount || 0,
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchStats();
    }, [isAdmin, isLoading]);

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                    <p className="text-gray-600 mt-1">Tổng quan về hệ thống quản lý</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Tổng Người dùng"
                        value={stats.totalUsers}
                        icon="👥"
                        color="bg-gradient-to-br from-blue-500 to-blue-600"
                    />
                    <StatCard
                        title="Tổng Bác sĩ"
                        value={stats.totalDoctors}
                        icon="👨‍⚕️"
                        color="bg-gradient-to-br from-green-500 to-green-600"
                    />
                    <StatCard
                        title="Tổng Cơ sở Y tế"
                        value={stats.totalFacilities}
                        icon="🏥"
                        color="bg-gradient-to-br from-purple-500 to-purple-600"
                    />
                    <StatCard
                        title="Tổng Chuyên khoa"
                        value={stats.totalSpecialties}
                        icon="📋"
                        color="bg-gradient-to-br from-orange-500 to-orange-600"
                    />
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Hành động nhanh</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <a
                            href="/admin/users?action=create"
                            className="px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-center font-medium text-blue-700"
                        >
                            + Thêm Người dùng
                        </a>
                        <a
                            href="/admin/doctors?action=create"
                            className="px-4 py-3 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors text-center font-medium text-green-700"
                        >
                            + Thêm Bác sĩ
                        </a>
                        <a
                            href="/admin/facilities?action=create"
                            className="px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-center font-medium text-purple-700"
                        >
                            + Thêm Cơ sở Y tế
                        </a>
                        <a
                            href="/admin/specialties?action=create"
                            className="px-4 py-3 bg-orange-50 border-2 border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-center font-medium text-orange-700"
                        >
                            + Thêm Chuyên khoa
                        </a>
                    </div>
                </div>

                {/* Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                        <h4 className="text-lg font-bold text-blue-900 mb-2">📊 Thống kê</h4>
                        <p className="text-blue-700 text-sm">
                            Theo dõi và quản lý toàn bộ dữ liệu người dùng, bác sĩ, cơ sở y tế và chuyên khoa trong hệ thống.
                        </p>
                    </div>
                    <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                        <h4 className="text-lg font-bold text-green-900 mb-2">✨ Tính năng</h4>
                        <p className="text-green-700 text-sm">
                            Tạo, sửa, xóa và quản lý toàn bộ thông tin trong hệ thống với giao diện thân thiện.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
