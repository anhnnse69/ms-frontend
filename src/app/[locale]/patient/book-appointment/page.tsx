/**
 * Example: Appointment Booking Page Component
 * 
 * PRODUCTION-READY EXAMPLE showing:
 * - Booking an appointment
 * - Doctor search
 * - Form handling
 * - Error handling
 * - TypeScript strict mode
 */

'use client';

import { FormEvent, useState, useEffect } from 'react';
import { usePatientProfile } from '@/hooks/usePatientProfile';
import {
  searchDoctors,
  getDoctorDetail,
  bookAppointment,
  SearchDoctorsParams,
} from '@/services/api/patient.api';
import {
  Doctor,
  DoctorDetail,
  BookAppointmentRequest,
} from '@/types/patient';

/**
 * Appointment Booking Page Component
 * Page URL: /patient/book-appointment
 */
export default function BookAppointmentPage() {
  // Check authentication
  const { profile, loading: profileLoading } = usePatientProfile();

  // Doctor search state
  const [searchParams, setSearchParams] = useState<SearchDoctorsParams>({
    page: 1,
    size: 10,
  });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<Error | null>(null);

  // Doctor detail state
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [doctorDetail, setDoctorDetail] = useState<DoctorDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<Error | null>(null);

  // Booking form state
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<Error | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Step tracking for multi-step form
  type Step = 'search' | 'doctor-detail' | 'confirm';
  const [currentStep, setCurrentStep] = useState<Step>('search');

  // 1. Search doctors on component mount
  useEffect(() => {
    if (!profileLoading) {
      handleSearchDoctors();
    }
  }, [profileLoading]);

  // 2. Handle doctor search
  const handleSearchDoctors = async () => {
    try {
      setSearchLoading(true);
      setSearchError(null);

      const response = await searchDoctors({
        keyword: searchParams.keyword,
        specialtyId: searchParams.specialtyId,
        facilityId: searchParams.facilityId,
        location: searchParams.location,
        page: searchParams.page || 1,
        size: searchParams.size || 10,
      });

      setDoctors(response.doctors);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to search doctors');
      setSearchError(error);
      setDoctors([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // 3. Handle doctor selection (view detail)
  const handleSelectDoctor = async (doctorId: string) => {
    try {
      setDetailLoading(true);
      setDetailError(null);
      setSelectedDoctorId(doctorId);

      const detail = await getDoctorDetail(doctorId);
      setDoctorDetail(detail);
      setCurrentStep('doctor-detail');
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to fetch doctor details');
      setDetailError(error);
      setDoctorDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // 4. Handle appointment booking
  const handleBookAppointment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDoctorId || !doctorDetail) {
      setBookingError(new Error('No doctor selected'));
      return;
    }

    if (!appointmentTime) {
      setBookingError(new Error('Please select an appointment time'));
      return;
    }

    // Validate time is in future
    const selectedTime = new Date(appointmentTime);
    const now = new Date();
    if (selectedTime <= now) {
      setBookingError(
        new Error('Appointment time must be in the future')
      );
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError(null);
      setBookingSuccess(false);

      const bookingRequest: BookAppointmentRequest = {
        facilityId: doctorDetail.facilityId,
        specialtyId: doctorDetail.specialtyId,
        doctorId: selectedDoctorId,
        appointmentTime: selectedTime.toISOString(),
        notes: appointmentNotes || undefined,
      };

      await bookAppointment(bookingRequest);

      setBookingSuccess(true);
      // Reset form
      setAppointmentTime('');
      setAppointmentNotes('');
      setDoctorDetail(null);
      setSelectedDoctorId(null);
      setCurrentStep('search');

      // Show message
      showNotification('Appointment booked successfully!', 'success');

      // Redirect after a delay
      setTimeout(() => {
        window.location.href = '/patient/appointments';
      }, 2000);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to book appointment');
      setBookingError(error);
    } finally {
      setBookingLoading(false);
    }
  };

  // Not authenticated
  if (!profileLoading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">Please log in to book an appointment.</p>
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

  // Main page
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="mt-2 text-gray-600">Find and book an appointment with a doctor</p>
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex gap-2">
          <div
            className={`flex-1 py-2 px-4 rounded-lg text-center font-medium transition ${
              currentStep === 'search'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            1. Search Doctors
          </div>
          <div
            className={`flex-1 py-2 px-4 rounded-lg text-center font-medium transition ${
              currentStep === 'doctor-detail'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            2. Doctor Details
          </div>
          <div
            className={`flex-1 py-2 px-4 rounded-lg text-center font-medium transition ${
              currentStep === 'confirm'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            3. Confirm Booking
          </div>
        </div>

        {/* STEP 1: Search Doctors */}
        {currentStep === 'search' && (
          <div className="bg-white shadow rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Search Doctors</h2>

            {/* Search form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor or Facility Name
                </label>
                <input
                  type="text"
                  id="keyword"
                  value={searchParams.keyword || ''}
                  onChange={(e) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      keyword: e.target.value,
                      page: 1,
                    }))
                  }
                  disabled={searchLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50"
                  placeholder="Search by doctor or facility name"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={searchParams.location || ''}
                  onChange={(e) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      location: e.target.value,
                      page: 1,
                    }))
                  }
                  disabled={searchLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50"
                  placeholder="e.g., City name"
                />
              </div>

              <button
                onClick={handleSearchDoctors}
                disabled={searchLoading}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Error */}
            {searchError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{searchError.message}</p>
              </div>
            )}

            {/* Results */}
            {searchLoading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {doctors.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {doctors.length} Doctor{doctors.length !== 1 ? 's' : ''} Found
                </h3>
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="p-4 border border-gray-300 rounded-lg hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {doctor.name}
                        </h4>
                        <p className="text-gray-600">{doctor.specialty}</p>
                        <p className="text-sm text-gray-500">{doctor.facility}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          📧 {doctor.email} | 💼 License: {doctor.license}
                        </p>
                        {doctor.experience && (
                          <p className="text-sm text-gray-500">
                            ⭐ {doctor.experience} years experience
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleSelectDoctor(doctor.id)}
                        disabled={detailLoading}
                        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-medium whitespace-nowrap"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!searchLoading && doctors.length === 0 && !searchError && (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Click "Search" to find available doctors
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Doctor Details */}
        {currentStep === 'doctor-detail' && doctorDetail && (
          <div className="bg-white shadow rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Doctor Details</h2>

            {detailLoading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {detailError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{detailError.message}</p>
              </div>
            )}

            {!detailLoading && (
              <>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {doctorDetail.name}
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Specialty:</strong> {doctorDetail.specialty}
                    </p>
                    <p>
                      <strong>Facility:</strong> {doctorDetail.facility}
                    </p>
                    <p>
                      <strong>Email:</strong> {doctorDetail.email}
                    </p>
                    <p>
                      <strong>License:</strong> {doctorDetail.license}
                    </p>
                    <p>
                      <strong>Experience:</strong> {doctorDetail.experience} years
                    </p>
                    {doctorDetail.bio && (
                      <p>
                        <strong>Bio:</strong> {doctorDetail.bio}
                      </p>
                    )}
                    {doctorDetail.about && (
                      <p>
                        <strong>About:</strong> {doctorDetail.about}
                      </p>
                    )}
                  </div>
                </div>

                {/* Reviews */}
                {doctorDetail.reviews && doctorDetail.reviews.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Reviews ({doctorDetail.reviews.length})
                    </h4>
                    <div className="space-y-3">
                      {doctorDetail.reviews.slice(0, 3).map((review, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium text-gray-900">
                              {review.patientName}
                            </p>
                            <span className="text-yellow-500">
                              {'⭐'.repeat(review.rating)}
                            </span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setCurrentStep('confirm');
                    }}
                    className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Proceed to Booking
                  </button>
                  <button
                    onClick={() => {
                      setCurrentStep('search');
                      setDoctorDetail(null);
                      setSelectedDoctorId(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    Back to Search
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 3: Confirm Booking */}
        {currentStep === 'confirm' && doctorDetail && (
          <form onSubmit={handleBookAppointment} className="bg-white shadow rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Confirm Booking</h2>

            {/* Selected doctor info */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700 mb-1">Doctor Selected</p>
              <p className="font-semibold text-gray-900">{doctorDetail.name}</p>
              <p className="text-sm text-gray-600">{doctorDetail.specialty}</p>
            </div>

            {/* Appointment time */}
            <div>
              <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-1">
                Appointment Date & Time *
              </label>
              <input
                type="datetime-local"
                id="appointmentTime"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                disabled={bookingLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Select a future date and time</p>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="appointmentNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                id="appointmentNotes"
                value={appointmentNotes}
                onChange={(e) => setAppointmentNotes(e.target.value)}
                disabled={bookingLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50"
                placeholder="Any specific concerns or notes for the doctor..."
                rows={4}
              />
            </div>

            {/* Error */}
            {bookingError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{bookingError.message}</p>
              </div>
            )}

            {/* Success */}
            {bookingSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700">✅ Appointment booked successfully! Redirecting...</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={bookingLoading || bookingSuccess}
                className="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {bookingLoading ? 'Booking...' : 'Confirm & Book'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentStep('doctor-detail');
                  setAppointmentTime('');
                  setAppointmentNotes('');
                }}
                disabled={bookingLoading}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition disabled:cursor-not-allowed font-medium"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * Toast notification helper (placeholder)
 */
function showNotification(message: string, type: 'success' | 'error') {
  if (type === 'success') {
    console.log('✅ Success:', message);
  } else {
    console.error('❌ Error:', message);
  }
}
