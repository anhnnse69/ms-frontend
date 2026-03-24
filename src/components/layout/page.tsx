'use client';

import React, { useEffect, useState } from 'react';
import ManagerLayout from '@/components/layout/ManagerLayout';
import { useManagerCheck } from '@/hooks/useAuth';
import { useTranslations } from 'next-intl';

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

export default function ManagerDashboardPage() {
    const t = useTranslations("common");
    const { isLoading } = useManagerCheck();
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalDoctors: 0,
        totalFacilities: 0,
        totalSpecialties: 0,
    });
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        if (isLoading) return;

        const fetchStats = async () => {
            try {
                setStatsLoading(true);
                // Placeholder stats - update with actual API calls if needed
                setStats({
                    totalUsers: 0,
                    totalDoctors: 0,
                    totalFacilities: 0,
                    totalSpecialties: 0,
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchStats();
    }, [isLoading]);

    if (isLoading) {
        return (
            <ManagerLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            </ManagerLayout>
        );
    }

    return (
        <ManagerLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">{t("managerDashboard")}</h2>
                    <p className="text-gray-600 mt-1">{t("managerDashboardIntro")}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Tổng Người dùnggggggg"
                        value={stats.totalUsers}
                        icon="👥"
                        color="bg-gradient-to-br from-green-500 to-green-600"
                    />
                    <StatCard
                        title="Tổng Bác sĩ"
                        value={stats.totalDoctors}
                        icon="👨‍⚕️"
                        color="bg-gradient-to-br from-blue-500 to-blue-600"
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
                        <button className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left">
                            <p className="text-sm font-semibold text-green-900">Thêm Người dùng</p>
                        </button>
                        <button className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left">
                            <p className="text-sm font-semibold text-blue-900">Thêm Bác sĩ</p>
                        </button>
                        <button className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left">
                            <p className="text-sm font-semibold text-purple-900">Thêm Cơ sở</p>
                        </button>
                        <button className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left">
                            <p className="text-sm font-semibold text-orange-900">Thêm Chuyên khoa</p>
                        </button>
                    </div>
                </div>
            </div>
        </ManagerLayout>
    );
}
