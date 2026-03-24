"use client";

import { useEffect, useState } from 'react';
import DoctorLayout from '@/components/layout/DoctorLayout';
import { doctorApi } from '@/services/api/doctorApi';
import type { DoctorAvailability, DoctorAvailabilityResponse } from '@/types/doctor';

function getDayName(dayOfWeek: number) {
  const names = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  return names[dayOfWeek] ?? 'Không xác định';
}

function getNearestDateFromDayOfWeek(dayOfWeek: number): string {
  if (dayOfWeek < 0 || dayOfWeek > 6) return '';

  const today = new Date();
  const current = today.getDay();
  let diff = dayOfWeek - current;
  if (diff < 0) diff += 7;

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + diff);

  return nextDate.toISOString().slice(0, 10); // yyyy-mm-dd
}

export default function DoctorSchedulePage() {
  const [availabilities, setAvailabilities] = useState<DoctorAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [allAvailabilities, setAllAvailabilities] = useState<DoctorAvailability[]>([]);
  const [allLoaded, setAllLoaded] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStartTime, setFilterStartTime] = useState('');
  const [filterEndTime, setFilterEndTime] = useState('');

  const hasActiveFilter = Boolean(searchQuery || filterDate || filterStartTime || filterEndTime);

  useEffect(() => {
    if (hasActiveFilter) return; // Khi đang lọc theo điều kiện, dữ liệu lấy từ allAvailabilities

    const load = async () => {
      try {
        setLoading(true);
        const response: DoctorAvailabilityResponse = await doctorApi.getAvailabilities(currentPage, pageSize);
        setAvailabilities(response.data);
        setTotal(response.meta.total);
      } catch (err) {
        setError('Không tải được lịch làm việc.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentPage, pageSize, hasActiveFilter]);

  useEffect(() => {
    if (!hasActiveFilter || allLoaded) return;

    const loadAll = async () => {
      try {
        setLoading(true);
        const response: DoctorAvailabilityResponse = await doctorApi.getAvailabilities(1, 1000);
        setAllAvailabilities(response.data);
        setAllLoaded(true);
      } catch (err) {
        setError('Không tải được lịch làm việc toàn bộ.');
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [hasActiveFilter, allLoaded]);

  const baseAvailabilities = hasActiveFilter ? allAvailabilities : availabilities;

  const filteredAvailabilities = baseAvailabilities.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      const matchFacility = item.facilityName?.toLowerCase().includes(query);
      const matchDate = item.date?.includes(query) ?? false;
      const matchDay = getDayName(item.dayOfWeek).toLowerCase().includes(query);
      if (!matchFacility && !matchDate && !matchDay) {
        return false;
      }
    }

    if (filterDate) {
      const date = filterDate;
      const isExactDate = item.date === date;
      const isInRange = item.fromDate && item.toDate && item.fromDate <= date && date <= item.toDate;
      const isDayMatch = !item.date && getNearestDateFromDayOfWeek(item.dayOfWeek) === date;
      if (!isExactDate && !isInRange && !isDayMatch) {
        return false;
      }
    }

    if (filterStartTime || filterEndTime) {
      const itemStart = item.startTime;
      const itemEnd = item.endTime;
      const filterStart = filterStartTime || '00:00';
      const filterEnd = filterEndTime || '23:59';

      // Check for overlap: item overlaps with [filterStart, filterEnd]
      const hasOverlap = itemStart < filterEnd && itemEnd > filterStart;
      if (!hasOverlap) {
        return false;
      }
    }

    return true;
  });

  const totalDisplay = hasActiveFilter ? filteredAvailabilities.length : total;
  const totalPages = Math.max(1, Math.ceil(totalDisplay / pageSize));
  const pagedAvailabilities = hasActiveFilter
    ? filteredAvailabilities.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filteredAvailabilities;

  const currentPageSafe = Math.min(currentPage, totalPages);

  return (
    <DoctorLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Lịch làm việc của tôi</h2>
        <p className="text-gray-600">Danh sách ca làm việc và khung giờ khả dụng của bác sĩ.</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 bg-white p-4 rounded-lg shadow-sm">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm theo cơ sở / thứ"
            className="col-span-1 lg:col-span-2 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="col-span-1">
            <label className="block text-sm text-gray-600">Ngày</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                setCurrentPage(1);
              }}
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-1 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-600">Bắt đầu</label>
              <input
                type="time"
                value={filterStartTime}
                onChange={(e) => {
                  setFilterStartTime(e.target.value);
                  setCurrentPage(1);
                }}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Kết thúc</label>
              <input
                type="time"
                value={filterEndTime}
                onChange={(e) => {
                  setFilterEndTime(e.target.value);
                  setCurrentPage(1);
                }}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setFilterDate('');
              setFilterStartTime('');
              setFilterEndTime('');
              setCurrentPage(1);
            }}
            className="col-span-1 lg:col-span-4 mt-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2"
          >
            Xóa bộ lọc
          </button>
        </div>

        {loading && <p>Đang tải...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="bg-white border rounded-lg shadow-sm p-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Kết quả lọc ({filteredAvailabilities.length})</h3>

            {pagedAvailabilities.length === 0 ? (
              <p className="text-gray-500">Không có lịch phù hợp với bộ lọc.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pagedAvailabilities.map((item) => (
                  <div key={item.id} className="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition">
                    <h3 className="font-semibold text-lg text-blue-700">{item.facilityName}</h3>
                    {item.date ? (
                      <p className="text-sm text-gray-500">Ngày: {item.date}</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-500">{getDayName(item.dayOfWeek)} ({getNearestDateFromDayOfWeek(item.dayOfWeek)})</p>
                       </>
                    )}
                    <p className="text-sm text-gray-700 mt-1">Giờ: {item.startTime} - {item.endTime}</p>
                    {item.fromDate && item.toDate && (
                      <p className="text-sm text-gray-500">Khoảng: {item.fromDate} → {item.toDate}</p>
                    )}
                    <p className="text-sm text-gray-500">Thời lượng mỗi slot: {item.slotDurationMinutes} phút</p>
                    <p className={`text-xs ${item.isDeleted ? 'text-red-500' : 'text-green-500'}`}>
                      {item.isDeleted ? 'Đã vô hiệu hóa' : 'Đang hoạt động'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages >= 1 && (
              <div className="mt-6 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="text-sm text-gray-500">
                  Hiển thị {pageSize} mục mỗi trang - tổng {totalDisplay} mục
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPageSafe - 1))}
                    disabled={currentPageSafe === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Trước
                  </button>
                  <span className="text-sm">
                    Trang {currentPageSafe} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPageSafe + 1))}
                    disabled={currentPageSafe === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
