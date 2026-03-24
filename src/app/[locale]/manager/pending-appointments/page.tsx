'use client';

import React, { useState } from 'react';
import ManagerLayout from '@/components/layout/ManagerLayout';
import { usePendingAppointments } from '@/hooks/useManagerPendingAppointments';
import { PendingAppointment } from '@/types/manager';
import NotifyModal from '@/components/ui/NotifyModal';

export default function PendingAppointmentPage() {
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<PendingAppointment | null>(null);

    const { data, loading, meta } = usePendingAppointments({
        page,
        size: 10,
    });

    const hasPrevious = page > 1;
    const hasNext = page * meta.size < meta.total;

    return (
        <ManagerLayout>
            <div className="space-y-8">

                {/* ===== Header ===== */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        ⏳ Lịch hẹn chờ xác nhận
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Danh sách bệnh nhân đang chờ xác nhận lịch khám
                    </p>
                </div>

                {/* ===== Table Card ===== */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">

                    {/* Meta */}
                    <div className="p-4 border-b flex justify-between text-sm text-gray-500">
                        <span>
                            Tổng: <b className="text-gray-700">{meta.total}</b>
                        </span>
                        <span>
                            Trang {meta.page} / {Math.max(1, Math.ceil(meta.total / meta.size))}
                        </span>
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-xs uppercase">
                                        <th className="p-3 text-left">Bệnh nhân</th>
                                        <th className="p-3">SĐT</th>
                                        <th className="p-3">Bác sĩ</th>
                                        <th className="p-3">Chuyên khoa</th>
                                        <th className="p-3">Cơ sở</th>
                                        <th className="p-3">Thời gian</th>
                                        <th className="p-3">Trạng thái</th>
                                        <th className="p-3 text-center">Hành động</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center p-6 text-gray-400">
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((item) => (
                                            <tr
                                                key={item.appointmentId}
                                                className="border-t hover:bg-gray-50 transition"
                                            >
                                                {/* Patient */}
                                                <td className="p-3">
                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            {item.patientName}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            ID: {item.appointmentId}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="p-3 text-gray-700">
                                                    {item.phoneNumber}
                                                </td>

                                                <td className="p-3 text-gray-700">
                                                    {item.doctorName || '-'}
                                                </td>

                                                <td className="p-3 text-gray-700">
                                                    {item.specialtyName}
                                                </td>

                                                <td className="p-3 text-gray-600">
                                                    {item.facilityName}
                                                </td>

                                                <td className="p-3 text-gray-600 whitespace-nowrap">
                                                    {new Date(item.appointmentTime).toLocaleString()}
                                                </td>

                                                <td className="p-3">
                                                    <StatusBadge status={item.status} />
                                                </td>

                                                {/* Action */}
                                                <td className="p-3 text-center">
                                                    <button
                                                        onClick={() => setSelected(item)}
                                                        className="px-3 py-1.5 text-xs rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
                                                    >
                                                        📩 Gửi
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ===== Pagination ===== */}
                    <div className="flex items-center justify-between p-4 border-t">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={!hasPrevious}
                            className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100 disabled:opacity-50"
                        >
                            ← Trước
                        </button>

                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={!hasNext}
                            className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100 disabled:opacity-50"
                        >
                            Sau →
                        </button>
                    </div>
                </div>

                {/* ===== Modal ===== */}
                <NotifyModal
                    open={!!selected}
                    onClose={() => setSelected(null)}
                    appointmentId={selected?.appointmentId || ''}
                    patientId={''}
                />
            </div>
        </ManagerLayout>
    );
}

//////////////////////////////////////////////////////
// STATUS BADGE
//////////////////////////////////////////////////////

const STATUS_MAP: Record<number, string> = {
    0: 'Chờ xác nhận',
    1: 'Đã xác nhận',
    2: 'Đã check-in',
    3: 'Đang khám',
    4: 'Hoàn thành',
    5: 'Đã hủy',
    6: 'Không đến',
};

const StatusBadge = ({ status }: { status: number }) => {
    const label = STATUS_MAP[status];

    const colorMap: Record<string, string> = {
        'Chờ xác nhận': 'bg-yellow-100 text-yellow-700',
        'Đã xác nhận': 'bg-blue-100 text-blue-700',
        'Đã check-in': 'bg-indigo-100 text-indigo-700',
        'Đang khám': 'bg-purple-100 text-purple-700',
        'Hoàn thành': 'bg-green-100 text-green-700',
        'Đã hủy': 'bg-red-100 text-red-700',
        'Không đến': 'bg-gray-100 text-gray-700',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorMap[label]}`}>
            {label}
        </span>
    );
};