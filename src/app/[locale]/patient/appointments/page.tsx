"use client";

import React, { useState } from 'react';
import { usePatientProfile } from '@/hooks/usePatientProfile';
import { usePatientAppointments } from '@/hooks/usePatientAppointments';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Alert } from '@/components/common/Alert';
import { FiActivity, FiCalendar, FiFileText } from 'react-icons/fi';

export default function PatientAppointmentsPage() {
  const t = useTranslations('patient.appointments');
  const { locale } = useParams<{ locale: string }>();
  const { profile, loading: profileLoading } = usePatientProfile();
  const PAGE_SIZE = 5;
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

  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

  const [upcomingStatusFilter, setUpcomingStatusFilter] = useState<string>('all');
  const [upcomingSortKey, setUpcomingSortKey] = useState<'dateAsc' | 'dateDesc' | 'statusAsc' | 'statusDesc'>('dateAsc');
  const [pastStatusFilter, setPastStatusFilter] = useState<string>('all');
  const [pastSortKey, setPastSortKey] = useState<'dateAsc' | 'dateDesc' | 'statusAsc' | 'statusDesc'>('dateDesc');

  const statusStyles: Record<string, string> = {
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
    Rescheduled: 'bg-amber-50 text-amber-700 border-amber-200',
    PendingConfirmation: 'bg-amber-50 text-amber-700 border-amber-200',
    Scheduled: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  if (!profileLoading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
          <p className="text-gray-600 mb-6">
            {t('authMessage')}
          </p>
          <a
            href={`/${locale}/login`}
            className="inline-block bg-[#0076C0] text-white px-6 py-2 rounded-lg hover:bg-[#005a94] transition"
          >
            {t('authGoToLogin')}
          </a>
        </div>
      </div>
    );
  }

  const filteredUpcoming = upcomingAppointments.filter(
    (apt) => upcomingStatusFilter === 'all' || apt.status === upcomingStatusFilter
  );
  const sortedUpcoming = [...filteredUpcoming].sort((a, b) => {
    const timeA = new Date(a.appointmentTime).getTime();
    const timeB = new Date(b.appointmentTime).getTime();
    switch (upcomingSortKey) {
      case 'statusAsc':
        return (a.status || '').localeCompare(b.status || '');
      case 'statusDesc':
        return (b.status || '').localeCompare(a.status || '');
      case 'dateDesc':
        return timeB - timeA;
      case 'dateAsc':
      default:
        return timeA - timeB;
    }
  });

  const filteredPast = pastAppointments.filter(
    (apt) => pastStatusFilter === 'all' || apt.status === pastStatusFilter
  );
  const sortedPast = [...filteredPast].sort((a, b) => {
    const timeA = new Date(a.appointmentTime).getTime();
    const timeB = new Date(b.appointmentTime).getTime();
    switch (pastSortKey) {
      case 'statusAsc':
        return (a.status || '').localeCompare(b.status || '');
      case 'statusDesc':
        return (b.status || '').localeCompare(a.status || '');
      case 'dateAsc':
        return timeA - timeB;
      case 'dateDesc':
      default:
        return timeB - timeA;
    }
  });

  const upcomingTotalPages = Math.max(1, Math.ceil(sortedUpcoming.length / PAGE_SIZE) || 1);
  const pastTotalPages = Math.max(1, Math.ceil(sortedPast.length / PAGE_SIZE) || 1);

  const safeUpcomingPage = Math.min(upcomingPage, upcomingTotalPages);
  const safePastPage = Math.min(pastPage, pastTotalPages);

  const visibleUpcoming = sortedUpcoming.slice(
    (safeUpcomingPage - 1) * PAGE_SIZE,
    safeUpcomingPage * PAGE_SIZE
  );
  const visiblePast = sortedPast.slice(
    (safePastPage - 1) * PAGE_SIZE,
    safePastPage * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600 mb-1">
              {t('headerBrand')}
            </p>
            <h1 className="text-3xl font-bold text-slate-900">{t('title')}</h1>
          </div>
          <div className="hidden sm:flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm border border-slate-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sky-600 text-lg">
              <FiActivity className="h-5 w-5 text-sky-600" aria-hidden="true" />
            </div>
            <div className="text-xs text-slate-600">
              <p className="font-medium">
                {upcomingAppointments.length + pastAppointments.length} appointments
              </p>
              <p className="text-slate-500">{t('headerSubtitle')}</p>
            </div>
          </div>
        </header>

        {appointmentsError && (
          <div className="mb-6">
            <Alert variant="error">
              <div className="flex flex-col gap-1">
                <p className="font-medium">{appointmentsError.message}</p>
                <button
                  onClick={() => refetch()}
                  className="self-start mt-1 text-xs font-medium text-red-700 underline underline-offset-4 hover:text-red-800"
                >
                  {t('errorRetry')}
                </button>
              </div>
            </Alert>
          </div>
        )}

        {appointmentsLoading ? (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full border-2 border-sky-100 border-t-sky-500 animate-spin" />
              <p className="text-slate-600 text-sm">{t('loading')}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* UPCOMING */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {t('upcomingTitle', { count: sortedUpcoming.length })}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {t('upcomingSubtitle')}
                  </p>
                </div>
                <span className="inline-flex items-center justify-center h-7 min-w-[2.25rem] rounded-full bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-100">
                  {sortedUpcoming.length}
                </span>
              </div>
              <div className="mt-2 mb-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">
                    {t('filterStatus')}
                  </span>
                  <select
                    value={upcomingStatusFilter}
                    onChange={(e) => {
                      setUpcomingStatusFilter(e.target.value);
                      setUpcomingPage(1);
                    }}
                    className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0076C0] focus:border-[#0076C0]"
                  >
                    <option value="all">{t('filterAllStatuses')}</option>
                    {Object.keys(statusStyles).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">
                    {t('sortLabel')}
                  </span>
                  <select
                    value={upcomingSortKey}
                    onChange={(e) =>
                      setUpcomingSortKey(
                        e.target.value as 'dateAsc' | 'dateDesc' | 'statusAsc' | 'statusDesc',
                      )
                    }
                    className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0076C0] focus:border-[#0076C0]"
                  >
                    <option value="dateAsc">{t('sortDateAsc')}</option>
                    <option value="dateDesc">{t('sortDateDesc')}</option>
                    <option value="statusAsc">{t('sortStatusAsc')}</option>
                    <option value="statusDesc">{t('sortStatusDesc')}</option>
                  </select>
                </div>
              </div>
              {sortedUpcoming.length === 0 ? (
                <div className="mt-2 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-slate-500">
                    <FiCalendar className="h-5 w-5 text-slate-500" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-slate-600 max-w-xs">
                    {t('upcomingEmpty')}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-2 overflow-hidden rounded-xl border border-slate-100">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold text-slate-700">
                            {t('tableDoctor')}
                          </th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-700">
                            {t('tableSpecialty')}
                          </th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-700">
                            {t('tableFacility')}
                          </th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-700">
                            {t('tableDateTime')}
                          </th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-700">
                            {t('tableStatus')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {visibleUpcoming.map((apt) => {
                          const date = new Date(apt.appointmentTime);
                          const dateLabel = date.toLocaleDateString(String(locale), {
                            weekday: 'short',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          });
                          const timeLabel = date.toLocaleTimeString(String(locale), {
                            hour: '2-digit',
                            minute: '2-digit',
                          });
                          const statusClass =
                            statusStyles[apt.status] ||
                            'bg-sky-50 text-sky-700 border-sky-200';

                          return (
                            <tr key={apt.id} className="hover:bg-slate-50/60">
                              <td className="px-4 py-3 align-top">
                                <div className="font-medium text-slate-900">
                                  {t('cardDoctorPrefix', {
                                    name: apt.doctorName || 'N/A',
                                  })}
                                </div>
                              </td>
                              <td className="px-4 py-3 align-top text-slate-700">
                                {apt.specialtyName || '-'}
                              </td>
                              <td className="px-4 py-3 align-top text-slate-700">
                                {apt.facilityName || '-'}
                              </td>
                              <td className="px-4 py-3 align-top text-slate-700">
                                <div className="flex flex-col gap-0.5 text-xs">
                                  <span className="font-medium">{dateLabel}</span>
                                  <span className="text-slate-500">{timeLabel}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 align-top">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClass}`}
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                  {apt.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {upcomingTotalPages > 1 && (
                    <div className="mt-3 flex justify-end">
                      <PaginationControls
                        currentPage={safeUpcomingPage}
                        totalPages={upcomingTotalPages}
                        onPageChange={setUpcomingPage}
                        prevLabel={t('paginationPrev')}
                        nextLabel={t('paginationNext')}
                        infoLabel={t('paginationInfo', {
                          currentPage: safeUpcomingPage,
                          totalPages: upcomingTotalPages,
                        })}
                      />
                    </div>
                  )}
                </>
              )}
            </section>

            {/* PAST */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {t('pastTitle', { count: sortedPast.length })}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {t('pastSubtitle')}
                  </p>
                </div>
                <span className="inline-flex items-center justify-center h-7 min-w-[2.25rem] rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                  {sortedPast.length}
                </span>
              </div>
              <div className="mt-2 mb-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">
                    {t('filterStatus')}
                  </span>
                  <select
                    value={pastStatusFilter}
                    onChange={(e) => {
                      setPastStatusFilter(e.target.value);
                      setPastPage(1);
                    }}
                    className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0076C0] focus:border-[#0076C0]"
                  >
                    <option value="all">{t('filterAllStatuses')}</option>
                    {Object.keys(statusStyles).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">
                    {t('sortLabel')}
                  </span>
                  <select
                    value={pastSortKey}
                    onChange={(e) =>
                      setPastSortKey(
                        e.target.value as 'dateAsc' | 'dateDesc' | 'statusAsc' | 'statusDesc',
                      )
                    }
                    className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0076C0] focus:border-[#0076C0]"
                  >
                    <option value="dateDesc">{t('sortDateDesc')}</option>
                    <option value="dateAsc">{t('sortDateAsc')}</option>
                    <option value="statusAsc">{t('sortStatusAsc')}</option>
                    <option value="statusDesc">{t('sortStatusDesc')}</option>
                  </select>
                </div>
              </div>
              {sortedPast.length === 0 ? (
                <div className="mt-2 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-slate-500">
                    <FiFileText className="h-5 w-5 text-slate-500" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-slate-600 max-w-xs">
                    {t('pastEmpty')}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-2 overflow-hidden rounded-xl border border-slate-100">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold text-slate-700">
                            {t('tableDoctor')}
                          </th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-700">
                            {t('tableSpecialty')}
                          </th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-700">
                            {t('tableFacility')}
                          </th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-700">
                            {t('tableDateTime')}
                          </th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-700">
                            {t('tableStatus')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {visiblePast.map((apt) => {
                          const date = new Date(apt.appointmentTime);
                          const dateLabel = date.toLocaleDateString(String(locale), {
                            weekday: 'short',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          });
                          const timeLabel = date.toLocaleTimeString(String(locale), {
                            hour: '2-digit',
                            minute: '2-digit',
                          });
                          const statusClass =
                            statusStyles[apt.status] ||
                            'bg-sky-50 text-sky-700 border-sky-200';

                          return (
                            <tr key={apt.id} className="hover:bg-slate-50/60">
                              <td className="px-4 py-3 align-top">
                                <div className="font-medium text-slate-900">
                                  {t('cardDoctorPrefix', {
                                    name: apt.doctorName || 'N/A',
                                  })}
                                </div>
                              </td>
                              <td className="px-4 py-3 align-top text-slate-700">
                                {apt.specialtyName || '-'}
                              </td>
                              <td className="px-4 py-3 align-top text-slate-700">
                                {apt.facilityName || '-'}
                              </td>
                              <td className="px-4 py-3 align-top text-slate-700">
                                <div className="flex flex-col gap-0.5 text-xs">
                                  <span className="font-medium">{dateLabel}</span>
                                  <span className="text-slate-500">{timeLabel}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 align-top">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClass}`}
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                  {apt.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {pastTotalPages > 1 && (
                    <div className="mt-3 flex justify-end">
                      <PaginationControls
                        currentPage={safePastPage}
                        totalPages={pastTotalPages}
                        onPageChange={setPastPage}
                        prevLabel={t('paginationPrev')}
                        nextLabel={t('paginationNext')}
                        infoLabel={t('paginationInfo', {
                          currentPage: safePastPage,
                          totalPages: pastTotalPages,
                        })}
                      />
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  prevLabel,
  nextLabel,
  infoLabel,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  prevLabel: string;
  nextLabel: string;
  infoLabel: string;
}) {
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="inline-flex items-center gap-3 text-xs text-slate-600">
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => canPrev && onPageChange(currentPage - 1)}
        className={`rounded-full border px-2.5 py-1 font-medium transition-colors ${
          canPrev
            ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            : 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
        }`}
      >
        {prevLabel}
      </button>
      <span className="text-xs text-slate-500">
        {infoLabel}
      </span>
      <button
        type="button"
        disabled={!canNext}
        onClick={() => canNext && onPageChange(currentPage + 1)}
        className={`rounded-full border px-2.5 py-1 font-medium transition-colors ${
          canNext
            ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            : 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
        }`}
      >
        {nextLabel}
      </button>
    </div>
  );
}