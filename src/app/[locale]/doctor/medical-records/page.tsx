"use client";

import { useEffect, useMemo, useState } from "react";
import DoctorLayout from "@/components/layout/DoctorLayout";
import { doctorApi } from "@/services/api/doctorApi";
import type {
  DoctorAppointment,
  DoctorMedicalRecord,
  AppointmentStatus,
} from "@/types/doctor";
import { STATUS_MAP } from "@/types/doctor";

// Normalize status
function normalizeStatus(status: AppointmentStatus | number): AppointmentStatus {
  if (typeof status === "number") {
    return STATUS_MAP[status] ?? "PendingConfirmation";
  }
  return status;
}

export default function DoctorMedicalRecordsPage() {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [selected, setSelected] = useState<DoctorAppointment | null>(null);

  const [record, setRecord] = useState<DoctorMedicalRecord | null>(null);

  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");

  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  // ================= LOAD LIST =================
  const loadAppointments = async () => {
    try {
      setLoadingList(true);
      const data = await doctorApi.getAppointments(1, 50);
      setAppointments(data);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // ================= AUTO CLEAR MESSAGE =================
  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  // ================= FILTER =================
  const filteredAppointments = useMemo(() => {
    const keyword = search.toLowerCase();

    return appointments.filter((a) =>
      (a.patientName ?? "").toLowerCase().includes(keyword) ||
      (a.patientPhoneNumber ?? "").toLowerCase().includes(keyword) ||
      (a.patientIdentityCard ?? "").toLowerCase().includes(keyword)
    );
  }, [appointments, search]);

  // ================= RELOAD RECORD =================
  const reloadRecord = async (appointmentId: string) => {
    try {
      const data = await doctorApi.getMedicalRecord(appointmentId);
      setRecord(data);
      setSymptoms(data.symptoms || "");
      setDiagnosis(data.diagnosis || "");
      setNotes(data.notes || "");
    } catch {
      setRecord(null);
    }
  };

  // ================= SELECT =================
  const handleSelect = async (item: DoctorAppointment) => {
    setSelected(item);
    setRecord(null);
    setError(null);

    // KHÔNG reset successMsg nữa
    // setSuccessMsg(null);

    setSymptoms("");
    setDiagnosis("");
    setNotes("");

    try {
      setLoadingDetail(true);
      await reloadRecord(item.appointmentId);
    } finally {
      setLoadingDetail(false);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!selected) return;

    if (!symptoms || !diagnosis) {
      setError("Nhập triệu chứng và chẩn đoán");
      return;
    }

    const status = normalizeStatus(selected.status);

    if (!record && status !== "InProgress") {
      setError("Chỉ có thể tạo hồ sơ khi lịch khám đang InProgress");
      return;
    }

    if (record && status !== "Completed") {
      setError("Chỉ có thể cập nhật hồ sơ khi lịch khám đã Completed");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccessMsg(null);

      const payload = { symptoms, diagnosis, notes };

      if (record) {
        await doctorApi.updateMedicalRecord(selected.appointmentId, payload);
        setSuccessMsg("Cập nhật hồ sơ thành công!");
      } else {
        await doctorApi.createMedicalRecord(selected.appointmentId, payload);
        setSuccessMsg("Tạo hồ sơ bệnh án thành công!");
      }

      // chỉ reload record, không reset UI
      await reloadRecord(selected.appointmentId);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Thao tác thất bại";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ================= UI =================
  return (
    <DoctorLayout>
      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Medical Records</h2>

          <input
            placeholder="Tìm bệnh nhân..."
            className="border px-3 py-2 rounded-lg w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="bg-white rounded-2xl shadow p-4 space-y-3">
            <h3 className="font-semibold">Appointments</h3>

            {loadingList && <p>Loading...</p>}

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredAppointments.map((item) => {
                const itemStatus = normalizeStatus(item.status);
                return (
                  <div
                    key={item.appointmentId}
                    onClick={() => handleSelect(item)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${selected?.appointmentId === item.appointmentId
                        ? "bg-blue-50 border-blue-500"
                        : "hover:bg-gray-100"
                      }`}
                  >
                    <p className="font-medium">{item.patientName}</p>
                    <p className="text-sm">SĐT: {item.patientPhoneNumber}</p>
                    <p className="text-sm">CCCD: {item.patientIdentityCard}</p>
                    <p className="text-xs text-gray-500">{item.facilityName}</p>
                    <p className="text-xs text-gray-400">{item.appointmentTime}</p>

                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${itemStatus === "InProgress"
                        ? "bg-green-100 text-green-700"
                        : itemStatus === "Completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                      {itemStatus}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-span-2 space-y-4">

            {!selected ? (
              <div className="bg-white p-6 rounded-2xl shadow text-gray-500">
                Chọn lịch khám để bắt đầu
              </div>
            ) : (
              <>
                {/* PATIENT */}
                <div className="bg-white p-4 rounded-2xl shadow">
                  <h3 className="font-semibold text-lg">{selected.patientName}</h3>
                  <p className="text-sm text-gray-500">{selected.facilityName}</p>
                  <p className="text-sm mt-2">SĐT: {selected.patientPhoneNumber}</p>
                  <p className="text-sm">CCCD: {selected.patientIdentityCard}</p>
                </div>

                {/*  MESSAGE (ĐẶT NGOÀI FORM) */}
                {(successMsg || error) && (
                  <div className="bg-white p-4 rounded-2xl shadow">
                    {successMsg && (
                      <p className="text-green-600 font-medium">✔ {successMsg}</p>
                    )}
                    {error && (
                      <p className="text-red-500 font-medium">✖ {error}</p>
                    )}
                  </div>
                )}

                {/* FORM */}
                <div className="bg-white p-6 rounded-2xl shadow space-y-4 relative">

                  {/*  LOADING OVERLAY (không mất UI) */}
                  {(loadingDetail || submitting) && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-2xl">
                      Processing...
                    </div>
                  )}

                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Symptoms"
                    className="w-full border p-3 rounded-lg"
                  />

                  <textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Diagnosis"
                    className="w-full border p-3 rounded-lg"
                  />

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notes"
                    className="w-full border p-3 rounded-lg"
                  />

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-6 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700"
                  >
                    {submitting
                      ? "Processing..."
                      : record
                        ? "Update Record"
                        : "Create Record"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}