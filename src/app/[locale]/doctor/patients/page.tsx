"use client";

import { useEffect, useMemo, useState } from 'react';
import DoctorLayout from '@/components/layout/DoctorLayout';
import { doctorApi } from '@/services/api/doctorApi';
import type { DoctorAppointment, DoctorPatient } from '@/types/doctor';

export default function DoctorPatientsPage() {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<DoctorPatient | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = async () => {
    try {
      setError(null);
      setLoadingAppointments(true);
      const data = await doctorApi.getAppointments(1, 100);
      setAppointments(data);
    } catch (err) {
      console.error(err);
      setError('Không tải được danh sách bệnh nhân.');
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadPatientDetail = async (appointmentId: string) => {
    try {
      setError(null);
      setLoadingPatient(true);
      setSelectedPatient(null);
      setSelectedAppointmentId(appointmentId);

      const data = await doctorApi.getPatientByAppointment(appointmentId);
      setSelectedPatient(data);
    } catch (err) {
      console.error(err);
      setError('Không lấy được thông tin bệnh nhân.');
      setSelectedPatient(null);
    } finally {
      setLoadingPatient(false);
    }
  };

  const patients = useMemo(() => {
    const unique = new Map<string, DoctorAppointment>();

    appointments.forEach((item) => {
      const key = `${item.patientName}-${item.facilityName}`;
      if (!unique.has(key)) {
        unique.set(key, item);
      }
    });

    const list = Array.from(unique.values());
    const query = searchText.trim().toLowerCase();

    if (!query) return list;

    return list.filter((item) => {
      const patientName = item.patientName?.toLowerCase() || '';
      const facilityName = item.facilityName?.toLowerCase() || '';
      const phone = item.patientPhoneNumber?.toLowerCase() || '';
      const identity = item.patientIdentityCard?.toLowerCase() || '';

      return (
        patientName.includes(query) ||
        facilityName.includes(query) ||
        phone.includes(query) ||
        identity.includes(query)
      );
    });
  }, [appointments, searchText]);

  return (
    <DoctorLayout>
      <div className="max-w-7xl mx-auto p-6"> {/* 🔥 rộng hơn */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Danh sách bệnh nhân của bác sĩ
        </h2>
        <p className="text-gray-600 mb-4">
          Chọn một bệnh nhân để xem chi tiết.
        </p>

        <div className="mb-4">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Tìm theo tên, số điện thoại, CCCD..."
            className="w-full md:w-1/2 border rounded-lg px-3 py-2"
          />
        </div>

        {loadingAppointments && <p>Đang tải danh sách...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* 🔥 GRID MỚI */}
        <div className="grid md:grid-cols-3 gap-4">

          {/* TABLE */}
          <div className="md:col-span-2">
            <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
              <table className="min-w-full text-left table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2">Bệnh nhân</th>
                    <th className="px-3 py-2">Cơ sở</th>
                    <th className="px-3 py-2">SĐT</th>
                    <th className="px-3 py-2">CCCD</th>
                    <th className="px-3 py-2">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 && !loadingAppointments ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-center text-gray-500">
                        Không có bệnh nhân.
                      </td>
                    </tr>
                  ) : (
                    patients.map((item) => (
                      <tr key={item.appointmentId} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2">{item.patientName}</td>
                        <td className="px-3 py-2">{item.facilityName}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{item.patientPhoneNumber || '-'}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{item.patientIdentityCard || '-'}</td>
                        <td className="px-3 py-2">
                          <button
                            className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                            onClick={() => loadPatientDetail(item.appointmentId)}
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* DETAIL */}
          <div className="md:col-span-1 border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-xl font-semibold mb-2">
              Thông tin chi tiết
            </h3>

            {loadingPatient && <p>Đang tải thông tin bệnh nhân...</p>}

            {!selectedAppointmentId && !loadingPatient && (
              <p className="text-gray-500">Chọn một bệnh nhân để xem.</p>
            )}

            {selectedAppointmentId && !selectedPatient && !loadingPatient && (
              <p className="text-gray-500">
                Không tìm thấy thông tin bệnh nhân.
              </p>
            )}

            {selectedPatient && (
              <div className="space-y-2 text-gray-700">
                <p><strong>Họ tên:</strong> {selectedPatient.fullName}</p>
                <p><strong>Ngày sinh:</strong> {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}</p>
                <p><strong>Giới tính:</strong> {selectedPatient.gender}</p>
                <p><strong>SĐT:</strong> {selectedPatient.phoneNumber}</p>
                <p><strong>Email:</strong> {selectedPatient.email}</p>
                <p><strong>Địa chỉ:</strong> {selectedPatient.address}</p>
                <p><strong>CCCD:</strong> {selectedPatient.identityCard}</p>
                <p><strong>Bảo hiểm:</strong> {selectedPatient.insuranceNumber}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </DoctorLayout>
  );
}