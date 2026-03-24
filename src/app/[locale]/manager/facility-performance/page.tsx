'use client';

import React, { useEffect, useState } from 'react';
import ManagerLayout from '@/components/layout/ManagerLayout';
import { managerReportApi } from '@/services/api/manager.api';

export default function PerformancePage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    doctorId: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await managerReportApi.performance(filter);

      if (res.codeMessage === 'APP_MESSAGE_2000') {
        setData(res.data);
      } else {
        alert('Lỗi lấy report');
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ManagerLayout>
      <div className="space-y-8">
        {/* ===== Header ===== */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            📈 Báo cáo hiệu suất
          </h2>
          <p className="text-gray-500 mt-1">
            Thống kê hoạt động theo thời gian và bác sĩ
          </p>
        </div>

        {/* ===== Filter ===== */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-xs text-gray-500">Từ ngày</label>
            <input
              type="date"
              value={filter.startDate}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="border rounded-lg p-2 mt-1 text-sm w-[150px]"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Đến ngày</label>
            <input
              type="date"
              value={filter.endDate}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="border rounded-lg p-2 mt-1 text-sm w-[150px]"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Doctor ID</label>
            <input
              placeholder="Optional"
              value={filter.doctorId}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, doctorId: e.target.value }))
              }
              className="border rounded-lg p-2 mt-1 text-sm w-[150px]"
            />
          </div>

          <button
            onClick={fetchData}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm"
          >
            🔍 Lọc dữ liệu
          </button>
        </div>

        {/* ===== Loading ===== */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full" />
          </div>
        ) : data ? (
          <>
            {/* ===== Overview ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard title="Tổng lịch hẹn" value={data.totalAppointments} />
              <StatCard title="Hoàn thành" value={data.completedAppointments} />
              <StatCard title="Đã hủy" value={data.cancelledAppointments} />
              <StatCard
                title="Tỉ lệ hoàn thành"
                value={data.completionRate + '%'}
                highlight
              />
            </div>

            {/* ===== Doctor Table ===== */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 border-b font-semibold text-gray-800">
                Hiệu suất bác sĩ
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-xs uppercase">
                      <th className="p-3 text-left">Bác sĩ</th>
                      <th className="p-3 text-center">Tổng</th>
                      <th className="p-3 text-center">Hoàn thành</th>
                      <th className="p-3 text-center">Hủy</th>
                      <th className="p-3 text-center">Tỉ lệ</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.doctorPerformances.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center p-6 text-gray-400">
                          Không có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      data.doctorPerformances.map((doc: any) => (
                        <tr
                          key={doc.doctorId}
                          className="border-t hover:bg-gray-50 transition"
                        >
                          <td className="p-3 font-medium text-gray-800">
                            {doc.doctorName}
                          </td>

                          <td className="p-3 text-center">
                            {doc.totalAppointments}
                          </td>

                          <td className="p-3 text-center text-green-600 font-medium">
                            {doc.completedAppointments}
                          </td>

                          <td className="p-3 text-center text-red-500 font-medium">
                            {doc.cancelledAppointments}
                          </td>

                          <td className="p-3 text-center">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                              {doc.completionRate}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </ManagerLayout>
  );
}

// ===== Stat Card =====
const StatCard = ({
  title,
  value,
  highlight,
}: {
  title: string;
  value: any;
  highlight?: boolean;
}) => (
  <div
    className={`rounded-2xl p-5 shadow-sm border border-gray-100 ${
      highlight
        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
        : 'bg-white'
    }`}
  >
    <p
      className={`text-sm ${
        highlight ? 'opacity-90' : 'text-gray-500'
      }`}
    >
      {title}
    </p>

    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);