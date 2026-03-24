'use client';

import React, { useState } from 'react';
import ManagerLayout from '@/components/layout/ManagerLayout';
import { useAppointments } from '@/hooks/useManagerAppointments';

export default function AppointmentPage() {
  const [page, setPage] = useState(1);

  const { data, loading, meta } = useAppointments({
    page,
    size: 10,
  });

  const hasPrevious = page > 1;
  const hasNext = page * meta.size < meta.total;

  return (
    <ManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold">Quản lý Lịch hẹn</h2>
          <p className="text-gray-600 mt-2">
            Danh sách lịch hẹn theo cơ sở
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-md shadow-sm p-4">
          <div className="text-sm text-gray-500 mb-2">
            Tổng: {meta.total} lịch hẹn | Trang {meta.page} /{' '}
            {Math.max(1, Math.ceil(meta.total / meta.size))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">ID</th>
                    <th className="p-2">Bệnh nhân</th>
                    <th className="p-2">Bác sĩ</th>
                    <th className="p-2">Thời gian</th>
                    <th className="p-2">Trạng thái</th>
                    <th className="p-2">Ghi chú</th>
                  </tr>
                </thead>

                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-500">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    data.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="p-2">{item.id}</td>
                        <td className="p-2">{item.patientName}</td>
                        <td className="p-2">{item.doctorName}</td>
                        <td className="p-2">
                          {new Date(item.appointmentTime).toLocaleString()}
                        </td>
                        <td className="p-2">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="p-2">{item.notes || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!hasPrevious || loading}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNext || loading}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
}

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    PendingConfirmation: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-blue-100 text-blue-800',
    CheckedIn: 'bg-indigo-100 text-indigo-800',
    InProgress: 'bg-purple-100 text-purple-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
    NoShow: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${map[status] || ''}`}>
      {status}
    </span>
  );
};