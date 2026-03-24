"use client";

import { useEffect, useState } from 'react';
import DoctorLayout from '@/components/layout/DoctorLayout';
import { doctorApi } from '@/services/api/doctorApi';
import { getErrorMessage, isAuthenticationError } from '@/services/api/errorHandler';
import type { DoctorAppointment, AppointmentStatus } from '@/types/doctor';
import { STATUS_MAP } from '@/types/doctor';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Helper function to convert numeric status to string
  const getStatusString = (status: AppointmentStatus | number): AppointmentStatus => {
    if (typeof status === 'string') return status;
    return STATUS_MAP[status] || 'Confirmed';
  };

  const loadAppointments = async (page = 1, size = 5) => {
    try {
      setLoading(true);
      const data = await doctorApi.getAppointments(page, size);
      setAppointments(data);
      setHasNextPage(data.length === size);
    } catch (err) {
      setError('Không tải được lịch hẹn.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const onConfirm = async (id: string) => {
    try {
      setLoadingId(id);
      setError(null);
      console.log('Confirming appointment:', id);
      const result = await doctorApi.confirmAppointment(id);
      console.log('Confirm response:', result, 'mapped status:', getStatusString(result.status as AppointmentStatus | number));
      setSuccessMessage('Lịch hẹn đã được xác nhận thành công!');
      setTimeout(() => setSuccessMessage(null), 3000);
      // Reload appointments
      await loadAppointments(currentPage, pageSize);
    } catch (err: any) {
      console.error('Confirm error:', err);
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      if (isAuthenticationError(err)) {
        // Redirect to login or refresh token
        window.location.href = '/login';
      }
    } finally {
      setLoadingId(null);
    }
  };

  const onReject = async (id: string) => {
    try {
      setLoadingId(id);
      setError(null);
      console.log('Rejecting appointment:', id);
      // Send a default reason to satisfy backend validation (min 10 chars) without asking user
      const reason = 'Bác sĩ từ chối lịch hẹn.';
      const result = await doctorApi.rejectAppointment(id, reason);
      console.log('Reject response:', result, 'mapped status:', getStatusString(result.status as AppointmentStatus | number));
      setSuccessMessage('Lịch hẹn đã được từ chối thành công!');
      setTimeout(() => setSuccessMessage(null), 3000);
      // Reload appointments
      await loadAppointments(currentPage, pageSize);
    } catch (err: any) {
      console.error('Reject error:', err);
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      if (isAuthenticationError(err)) {
        window.location.href = '/login';
      }
    } finally {
      setLoadingId(null);
    }
  };

  const onStartProcess = async (id: string) => {
    try {
      setLoadingId(id);
      setError(null);

      console.log('Starting process for:', id);

      await doctorApi.updateAppointmentStatus(id, 'InProgress');

      setSuccessMessage('Lịch hẹn đã chuyển sang trạng thái đang khám!');
      setTimeout(() => setSuccessMessage(null), 3000);

      await loadAppointments(currentPage, pageSize);
    } catch (err: any) {
      console.error('Start process error:', err);
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);

      if (isAuthenticationError(err)) {
        window.location.href = '/login';
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <DoctorLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Xác nhận / Từ chối lịch hẹn</h2>
        <p className="text-gray-600 mb-4">Quản lý trạng thái các lịch hẹn hiện có.</p>

        {loading && <p>Đang tải...</p>}
        {error && (
          <div className="text-red-600 mb-3 px-4 py-3 bg-red-50 rounded-lg border border-red-200">
            <p className="font-semibold">Lỗi:</p>
            <p>{error}</p>
          </div>
        )}
        {successMessage && <p className="text-green-700 mb-3 px-4 py-2 bg-green-50 rounded-lg border border-green-200">{successMessage}</p>}

        {!loading && appointments.length === 0 && <p>Không có lịch hẹn nào.</p>}

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="inline-flex items-center gap-2">
              <label className="text-sm font-medium">Số dòng mỗi trang:</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setPageSize(value);
                  setCurrentPage(1);
                }}
                className="border rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Trang {currentPage} (hiển thị {appointments.length} mục)
            </div>
          </div>

          {appointments.map((item) => (
            <div key={item.appointmentId} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-lg">{item.patientName}</p>
                  <p className="text-sm text-gray-500">{item.facilityName} — {new Date(item.appointmentTime).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">SĐT: {item.patientPhoneNumber || '-'}</p>
                  <p className="text-sm text-gray-600">CCCD: {item.patientIdentityCard || '-'}</p>
                  <p className="text-sm text-gray-600">Ghi chú: {item.notes || '-'}</p>
                  <p className="text-sm font-semibold mt-2">Trạng thái hiện tại: <span className="text-blue-600">{getStatusString(item.status)}</span></p>
                </div>
              </div>

               {/* Phần 1: Xác nhận / Từ chối */}
              {getStatusString(item.status) === 'PendingConfirmation' && (
                <div className="mt-4 p-3 border-t">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Xác nhận / Từ chối lịch hẹn</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => onConfirm(item.appointmentId)}
                      disabled={loadingId === item.appointmentId}
                    >
                      {loadingId === item.appointmentId ? '⏳ Đang xử lý...' : '✓ Xác nhận'}
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => onReject(item.appointmentId)}
                      disabled={loadingId === item.appointmentId}
                    >
                      {loadingId === item.appointmentId ? '⏳ Đang xử lý...' : '✕ Từ chối'}
                    </button>
                  </div>
                </div>
              )}

              {/* Phần 2: Chuyển sang InProcess */}
              {getStatusString(item.status) === 'Confirmed' && (
                <div className="mt-4 p-3 border-t">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Bắt đầu khám</h4>
                  <button
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => onStartProcess(item.appointmentId)}
                    disabled={loadingId === item.appointmentId}
                  >
                    {loadingId === item.appointmentId ? '⏳ Đang xử lý...' : '▶ Bắt đầu khám'}
                  </button>
                </div>
              )}
              
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Trước
          </button>
          <div className="text-sm text-gray-600">Trang {currentPage}</div>
          <button
            onClick={() => hasNextPage && setCurrentPage((p) => p + 1)}
            disabled={!hasNextPage}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>
    </DoctorLayout>
  );
}
