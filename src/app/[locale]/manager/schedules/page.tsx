'use client';

import React, { useState } from 'react';
import ManagerLayout from '@/components/layout/ManagerLayout';
import { useManagerCheck } from '@/hooks/useAuth';
import { useDoctorSchedules } from '@/hooks/useManagerDoctorSchedules';

export default function DoctorSchedulePage() {
  const { user } = useManagerCheck();
  const [page, setPage] = useState(1);

  const { data, loading, meta } = useDoctorSchedules({
    facilityId: user?.facilityId,
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
            📋 Lịch làm việc bác sĩ
          </h2>
          <p className="text-gray-500 mt-1">
            Quản lý lịch khám theo cơ sở
          </p>
        </div>

        {/* ===== Content Card ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">

          {/* Meta */}
          <div className="p-4 border-b flex justify-between text-sm text-gray-500">
            <span>
              Tổng: <b className="text-gray-700">{meta.total}</b> bác sĩ
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
            <div className="divide-y">
              {data.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  Không có dữ liệu
                </div>
              ) : (
                data.map((doc) => (
                  <div
                    key={doc.doctorId}
                    className="p-4 hover:bg-gray-50 transition"
                  >
                    {/* Doctor name */}
                    <div className="font-semibold text-gray-800 mb-2">
                      👨‍⚕️ {doc.doctorName}
                    </div>

                    {/* Schedules */}
                    {doc.schedules.length === 0 ? (
                      <div className="text-sm text-gray-400">
                        Không có lịch làm việc
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {doc.schedules.map((s, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700"
                          >
                            <div className="font-medium">
                              {formatDay(s.dayOfWeek)}
                            </div>

                            <div>
                              {formatTime(s.startTime)} - {formatTime(s.endTime)}
                            </div>

                            <div className="text-gray-500">
                              {s.slotDurationMinutes} phút
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ===== Pagination ===== */}
          <div className="flex items-center justify-between p-4 border-t">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!hasPrevious || loading}
              className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              ← Trước
            </button>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNext || loading}
              className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              Sau →
            </button>
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
}

// ===== Helpers =====

const formatDay = (day: number) => {
  const map = [
    'CN',
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7',
  ];
  return map[day] || '';
};

const formatTime = (time: string) => {
  return time?.slice(0, 5) || '';
};