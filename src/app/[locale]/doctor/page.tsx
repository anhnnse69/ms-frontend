"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import DoctorLayout from '@/components/layout/DoctorLayout';
import { useAuth } from '@/hooks/useAuth';
import { doctorApi } from '@/services/api/doctorApi';
import type { DoctorAvailabilityResponse } from '@/types/doctor';

const SECTION_CONTENT = {
  schedule: {
    title: 'Lịch làm việc của tôi',
    body: 'Xem lịch làm việc theo ngày/tháng, trạng thái ca làm và ca trực. Bạn có thể điều chỉnh khung giờ sẵn sàng tiếp nhận bệnh nhân.',
  },
  appointments: {
    title: 'Quản lý lịch hẹn',
    body: 'Xác nhận/từ chối lịch hẹn và cập nhật trạng thái (Đã tiếp nhận, Đang diễn ra, Đã hoàn thành, Đã hủy).',
  },
  patients: {
    title: 'Thông tin bệnh nhân',
    body: 'Tra cứu hồ sơ bệnh nhân, lịch sử khám, kết quả cận lâm sàng và thông tin liên hệ.',
  },
  medicalRecords: {
    title: 'Hồ sơ khám bệnh',
    body: 'Tạo mới hồ sơ khám, cập nhật chẩn đoán, đơn thuốc và các ghi chú y tế quan trọng.',
  },
};

export default function DoctorDashboardPage() {
  const t = useTranslations("common");
  const { user, isLoading: authLoading } = useAuth();
  const [activeSection, setActiveSection] = useState<'schedule' | 'appointments' | 'patients' | 'medicalRecords'>('schedule');
  const [availabilityCount, setAvailabilityCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const current = SECTION_CONTENT[activeSection];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response: DoctorAvailabilityResponse = await doctorApi.getAvailabilities(1, 1000);
        setAvailabilityCount(response.meta?.total ?? response.data.length);
      } catch (err) {
        setError('Không thể tải dữ liệu lịch làm việc');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DoctorLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('doctorDashboard')}</h1>
          <p className="text-gray-600 mb-4">{t('doctorDashboardIntro')}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            

            <div className="p-4 border rounded-lg bg-blue-50">
              <h3 className="font-semibold">Lịch làm việc</h3>
              {loading ? (
                <p>Đang nạp...</p>
              ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : (
                <p className="text-sm text-gray-700">Tổng lịch có sẵn: <strong>{availabilityCount}</strong></p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {Object.entries(SECTION_CONTENT).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key as any)}
                className={`text-left p-4 rounded-lg transition-all border ${activeSection === key ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-white hover:border-green-400 hover:bg-green-50'}`}
              >
                <h3 className="font-semibold text-lg">{section.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{section.body}</p>
              </button>
            ))}
          </div>
        </div>

        <div id={activeSection} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">{current.title}</h2>
          <p className="text-gray-700 mb-6">{current.body}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Mô tả</h4>
              <p className="text-gray-600">Nội dung quản lý {current.title.toLowerCase()} được hiển thị chi tiết, tích hợp biểu đồ KPI và danh sách nhanh.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Tính năng</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Tìm kiếm / lọc nhanh</li>
                <li>Cập nhật trạng thái ngay lập tức</li>
                <li>Lưu log thao tác</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
