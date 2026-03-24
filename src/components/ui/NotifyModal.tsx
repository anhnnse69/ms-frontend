'use client';

import { useState } from 'react';
import { managerNotificationApi } from '@/services/api/manager.api';

export default function NotifyModal({
  open,
  onClose,
  appointmentId,
  patientId,
}: {
  open: boolean;
  onClose: () => void;
  appointmentId: string;
  patientId: string;
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    titleVi: '',
    titleEn: '',
    contentVi: '',
    contentEn: '',
    type: 0,
    channel: 2,
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        appointmentId,
        patientId, // ✅ QUAN TRỌNG
        ...form,
      };

      console.log('SEND PAYLOAD', payload);

      const res = await managerNotificationApi.send(payload);

      if (res.codeMessage === 'APP_MESSAGE_2000') {
        alert('Gửi thành công');
        onClose();
      } else {
        alert(res.codeMessage);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi gửi notification');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-[500px] space-y-4">
        <h3 className="text-xl font-bold">Gửi thông báo</h3>

        <input
          placeholder="Tiêu đề (VI)"
          className="border p-2 w-full"
          onChange={(e) => handleChange('titleVi', e.target.value)}
        />

        <input
          placeholder="Tiêu đề (EN)"
          className="border p-2 w-full"
          onChange={(e) => handleChange('titleEn', e.target.value)}
        />

        <textarea
          placeholder="Nội dung (VI)"
          className="border p-2 w-full"
          onChange={(e) => handleChange('contentVi', e.target.value)}
        />

        <textarea
          placeholder="Nội dung (EN)"
          className="border p-2 w-full"
          onChange={(e) => handleChange('contentEn', e.target.value)}
        />

        <select
          className="border p-2 w-full"
          onChange={(e) => handleChange('channel', Number(e.target.value))}
        >
          <option value={0}>Email</option>
          <option value={1}>SMS</option>
          <option value={2}>InApp</option>
          <option value={3}>Push</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Hủy</button>

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? 'Đang gửi...' : 'Gửi'}
          </button>
        </div>
      </div>
    </div>
  );
}