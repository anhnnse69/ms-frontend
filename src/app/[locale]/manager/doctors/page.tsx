'use client';

import React, { useState } from 'react';
import ManagerLayout from '@/components/layout/ManagerLayout';
import { useManagerCheck } from '@/hooks/useAuth';
import { useDoctors } from '@/hooks/useManagerDoctors';

export default function DoctorListPage() {
  const { user } = useManagerCheck();
  const [page, setPage] = useState(1);

  const { data: doctors, loading, meta } = useDoctors({
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
            👨‍⚕️ Quản lý Bác sĩ
          </h2>
          <p className="text-gray-500 mt-1">
            Danh sách bác sĩ theo cơ sở
          </p>
        </div>

        {/* ===== Content Card ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {/* ===== Meta ===== */}
          <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-sm text-gray-500">
              Tổng: <span className="font-semibold text-gray-700">{meta.total}</span> bác sĩ
            </div>

            <div className="text-sm text-gray-500">
              Trang {meta.page} /{' '}
              {Math.max(1, Math.ceil(meta.total / meta.size))}
            </div>
          </div>

          {/* ===== Table ===== */}
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase">
                    <th className="p-3 text-left">Bác sĩ</th>
                    <th className="p-3 text-left">Chuyên khoa</th>
                    <th className="p-3 text-left">Kinh nghiệm</th>
                    <th className="p-3 text-left">Đánh giá</th>
                  </tr>
                </thead>

                <tbody>
                  {doctors.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-gray-400">
                        Không có bác sĩ
                      </td>
                    </tr>
                  ) : (
                    doctors.map((doc) => (
                      <tr
                        key={doc.id}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        {/* Doctor info */}
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={doc.avatarUrl}
                              alt={doc.fullName}
                              className="w-11 h-11 rounded-full object-cover border"
                            />

                            <div>
                              <p className="font-semibold text-gray-800">
                                {doc.displayName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {doc.fullName}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Specialty */}
                        <td className="p-3 text-gray-700">
                          {doc.specialtyName}
                        </td>

                        {/* Experience */}
                        <td className="p-3">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            {doc.yearsOfExperience} năm
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="p-3">
                          <div className="flex items-center gap-1 text-yellow-500 font-medium">
                            ⭐ {doc.averageRating.toFixed(1)}
                          </div>
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