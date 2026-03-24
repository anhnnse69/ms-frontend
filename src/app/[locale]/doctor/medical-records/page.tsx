"use client";

import { useState } from 'react';
import DoctorLayout from '@/components/layout/DoctorLayout';
import { doctorApi } from '@/services/api/doctorApi';
import type { CreateMedicalRecordRequest, UpdateMedicalRecordRequest, DoctorMedicalRecord } from '@/types/doctor';

export default function DoctorMedicalRecordsPage() {
  const [appointmentId, setAppointmentId] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<DoctorMedicalRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const submit = async () => {
    if (!appointmentId.trim() || !symptoms.trim() || !diagnosis.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc.');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      const payload: CreateMedicalRecordRequest | UpdateMedicalRecordRequest = {
        symptoms: symptoms.trim(),
        diagnosis: diagnosis.trim(),
        notes: notes.trim(),
      };

      const data = isUpdateMode
        ? await doctorApi.updateMedicalRecord(appointmentId.trim(), payload)
        : await doctorApi.createMedicalRecord(appointmentId.trim(), payload);

      setResult(data);
      setError(null);
      window.alert('Thành công.');
    } catch {
      setError('Thao tác không thành công.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DoctorLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        <h2 className="text-2xl font-bold">Tạo / Cập nhật hồ sơ khám</h2>
        <p className="text-gray-600">Tạo hồ sơ khám mới hoặc cập nhật hồ sơ đã có theo appointmentId.</p>

        <div className="space-y-3 p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <input
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
              placeholder="Appointment ID"
              className="flex-1 border rounded-lg px-3 py-2"
            />
            <label className="text-sm">
              <input
                type="checkbox"
                checked={isUpdateMode}
                onChange={(e) => setIsUpdateMode(e.target.checked)}
                className="mr-2"
              />
              Cập nhật
            </label>
          </div>

          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={3}
            placeholder="Triệu chứng"
            className="w-full border rounded-lg p-3"
          />
          <textarea
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            rows={3}
            placeholder="Chẩn đoán"
            className="w-full border rounded-lg p-3"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Ghi chú"
            className="w-full border rounded-lg p-3"
          />

          <button
            onClick={submit}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {isLoading ? 'Đang xử lý...' : isUpdateMode ? 'Cập nhật hồ sơ' : 'Tạo hồ sơ'}
          </button>

          {error && <p className="text-red-500">{error}</p>}
        </div>

        {result && (
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Kết quả hồ sơ</h3>
            <p><strong>Trạng thái lịch:</strong> {result.appointmentStatus}</p>
            <p><strong>Chẩn đoán:</strong> {result.diagnosis}</p>
            <p><strong>Triệu chứng:</strong> {result.symptoms}</p>
            <p><strong>Ghi chú:</strong> {result.notes || '-'}</p>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
