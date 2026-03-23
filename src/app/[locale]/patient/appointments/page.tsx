'use client';

import React, { useState } from 'react';
import { usePatientProfile } from '@/hooks/usePatientProfile';
import { usePatientAppointments } from '@/hooks/usePatientAppointments';
import {
  cancelAppointment,
  rescheduleAppointment,
  submitReview,
} from '@/services/api/patient.api';
import { Appointment, SubmitReviewRequest } from '@/types/patient';

export default function PatientAppointmentsPage() {
  const { profile, loading: profileLoading } = usePatientProfile();
  const {
    upcomingAppointments,
    pastAppointments,
    loading: appointmentsLoading,
    error: appointmentsError,
    refetch,
  } = usePatientAppointments();

  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newTime, setNewTime] = useState('');
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  if (!profileLoading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">
            Please log in to view your appointments.
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const handleCancel = async () => {
    if (!cancelingId) return;
    try {
      setCancelLoading(true);
      await cancelAppointment({ appointmentId: cancelingId, reason: cancelReason });
      setCancelingId(null);
      setCancelReason('');
      await refetch();
    } finally {
      setCancelLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleId || !newTime) return;
    try {
      setRescheduleLoading(true);
      await rescheduleAppointment({
        appointmentId: rescheduleId,
        newAppointmentTime: new Date(newTime).toISOString(),
      });
      setRescheduleId(null);
      setNewTime('');
      await refetch();
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewingId) return;

    const appointment = [...upcomingAppointments, ...pastAppointments].find(
      (apt) => apt.id === reviewingId
    );
    if (!appointment) return;

    const reviewRequest: SubmitReviewRequest = {
      doctorId: appointment.doctorId,
      appointmentId: reviewingId,
      rating,
      comment: reviewComment,
    };

    try {
      setReviewLoading(true);
      await submitReview(reviewRequest);
      setReviewingId(null);
      setRating(5);
      setReviewComment('');
      await refetch();
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Appointments</h1>

        {appointmentsError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{appointmentsError.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-red-600 underline text-sm"
            >
              Try again
            </button>
          </div>
        )}

        {appointmentsLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading appointments...</p>
            </div>
          </div>
        ) : (
          <>
            {/* UPCOMING */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">
                📅 Upcoming Appointments ({upcomingAppointments.length})
              </h2>
              {upcomingAppointments.length === 0 ? (
                <p className="text-gray-600">You have no upcoming appointments</p>
              ) : (
                upcomingAppointments.map((apt) => (
                  <AppointmentCard
                    key={apt.id}
                    appointment={apt}
                    onCancel={() => setCancelingId(apt.id)}
                    onReschedule={() => setRescheduleId(apt.id)}
                    isUpcoming
                  />
                ))
              )}
            </section>

            {/* PAST */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                ✅ Past Appointments ({pastAppointments.length})
              </h2>
              {pastAppointments.length === 0 ? (
                <p className="text-gray-600">You have no past appointments yet</p>
              ) : (
                pastAppointments.map((apt) => (
                  <AppointmentCard
                    key={apt.id}
                    appointment={apt}
                    onReview={() => setReviewingId(apt.id)}
                    isUpcoming={false}
                  />
                ))
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function AppointmentCard({
  appointment,
  onCancel,
  onReschedule,
  onReview,
  isUpcoming = true,
}: {
  appointment: Appointment;
  onCancel?: () => void;
  onReschedule?: () => void;
  onReview?: () => void;
  isUpcoming?: boolean;
}) {
  const date = new Date(appointment.appointmentTime);

  return (
    <div className="bg-white p-6 rounded-lg border mb-4">
      <h3 className="font-semibold">Dr. {appointment.doctorName}</h3>
      <p>
        {date.toLocaleDateString()} - {date.toLocaleTimeString()}
      </p>
      <div className="flex gap-2 mt-4">
        {isUpcoming && (
          <>
            <button
              onClick={onReschedule}
              className="px-3 py-1 text-sm bg-yellow-100 rounded"
            >
              Reschedule
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-1 text-sm bg-red-100 rounded"
            >
              Cancel
            </button>
          </>
        )}
        {!isUpcoming && (
          <button
            onClick={onReview}
            className="px-3 py-1 text-sm bg-green-100 rounded"
          >
            Review
          </button>
        )}
      </div>
    </div>
  );
}