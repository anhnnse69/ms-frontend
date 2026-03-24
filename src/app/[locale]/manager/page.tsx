'use client';

import React, { useEffect, useState } from 'react';
import ManagerLayout from '@/components/layout/ManagerLayout';
import { useManagerCheck } from '@/hooks/useAuth';
import { managerAppointmentApi } from '@/services/api/manager.api';
import { mapAppointmentReport } from '@/lib/appointmentReport.mapper';
import { AppointmentReport } from '@/types/manager';
import { useFacilitySpecialties } from '@/hooks/useManagerFacilitySpecialties';

// ===== Stat Card =====
const StatCard = ({
    title,
    value,
    color,
    icon,
}: {
    title: string;
    value: number;
    color: string;
    icon: string;
}) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
        <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{title}</p>

            <div
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-white text-sm ${color}`}
            >
                {icon}
            </div>
        </div>

        <p className="text-3xl font-bold mt-3 text-gray-800">{value}</p>
    </div>
);

// ===== Page =====
export default function ManagerDashboardPage() {
    const { user, isLoading } = useManagerCheck();
    const { data: specialties, loading: spLoading } =
        useFacilitySpecialties(user?.facilityId);

    const [report, setReport] = useState<AppointmentReport | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const facilityId = user?.facilityId;

        if (!facilityId) {
            setLoading(false);
            return;
        }

        const fetchReport = async () => {
            try {
                setLoading(true);
                const today = new Date().toISOString().split('T')[0];

                const res = await managerAppointmentApi.getReport({
                    facilityId,
                    type: 'year',
                    date: today,
                });

                setReport(mapAppointmentReport(res.data));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [user?.facilityId]);

    // ===== Loading =====
    if (isLoading || loading) {
        return (
            <ManagerLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full" />
                </div>
            </ManagerLayout>
        );
    }

    return (
        <ManagerLayout>
            <div className="space-y-8">
                {/* ===== Header ===== */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        📊 Dashboard Lịch hẹn
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Tổng quan hoạt động lịch hẹn tại cơ sở
                    </p>
                </div>

                {!report ? (
                    <div className="text-gray-500">Không có dữ liệu</div>
                ) : (
                    <>
                        {/* ===== Tổng ===== */}
                        <div className="rounded-2xl p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md">
                            <p className="text-sm opacity-90">
                                Tổng lịch hẹn năm nay
                            </p>
                            <p className="text-5xl font-bold mt-2">
                                {report.total}
                            </p>
                        </div>

                        {/* ===== Stats ===== */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <StatCard title="Chờ xác nhận" value={report.pending} color="bg-yellow-500" icon="⏳" />
                            <StatCard title="Đã xác nhận" value={report.confirmed} color="bg-blue-500" icon="✔️" />
                            <StatCard title="Đã check-in" value={report.checkedIn} color="bg-indigo-500" icon="📍" />
                            <StatCard title="Đang khám" value={report.inProgress} color="bg-purple-500" icon="🩺" />
                            <StatCard title="Hoàn thành" value={report.completed} color="bg-green-500" icon="✅" />
                            <StatCard title="Đã hủy" value={report.cancelled} color="bg-red-500" icon="❌" />
                            <StatCard title="Không đến" value={report.noShow} color="bg-gray-400" icon="🚫" />
                        </div>
                    </>
                )}

                {/* ===== Specialties ===== */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                        Chuyên khoa tại cơ sở
                    </h3>

                    {spLoading ? (
                        <div className="text-gray-500">
                            Đang tải chuyên khoa...
                        </div>
                    ) : specialties.length === 0 ? (
                        <div className="text-gray-500">
                            Không có chuyên khoa
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            {specialties.map((sp) => (
                                <div
                                    key={sp.specialtyId}
                                    className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 text-lg">
                                            🏥
                                        </div>

                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {sp.nameVi}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                {sp.descriptionVi}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ManagerLayout>
    );
}