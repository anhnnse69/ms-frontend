# 📖 API Integration Examples & Best Practices

Production-ready code snippets for common scenarios.

---

## 🔐 Authentication Flow Example

### 1. Login & Token Storage

```typescript
// File: services/api/authApi.ts (You may already have this)
import apiClient, { setAuthToken, clearAuthToken } from './apiClient';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/api/v1/auth/login', credentials);
  
  // IMPORTANT: Save token immediately after successful login
  const token = response.data.token;
  setAuthToken(token);
  
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  // Optional: Call logout endpoint on backend
  // await apiClient.post('/api/v1/auth/logout');
  
  // Clear token from localStorage
  clearAuthToken();
};
```

### 2. Login Component

```typescript
'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/api/authApi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await loginUser({ email, password });
      console.log('Login successful!', result.user);
      
      // Redirect to dashboard
      router.push('/patient/appointments');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="text-red-600">{error.message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## 👤 Profile Management Examples

### 1. Profile Display Component

```typescript
'use client';

import { usePatientProfile } from '@/hooks/usePatientProfile';

export function ProfileHeader() {
  const { profile, loading, error } = usePatientProfile();

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-600">Failed to load profile</div>;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      {profile.avatarUrl && (
        <img
          src={profile.avatarUrl}
          alt={profile.displayName}
          className="w-12 h-12 rounded-full object-cover"
        />
      )}
      <div>
        <p className="text-lg font-semibold">{profile.displayName}</p>
        <p className="text-gray-600 text-sm">{profile.email}</p>
        <p className="text-gray-600 text-sm">{profile.phoneNumber}</p>
      </div>
    </div>
  );
}
```

### 2. Edit Profile Modal

```typescript
'use client';

import { FormEvent, useState, useEffect } from 'react';
import { UpdateUserProfileRequest } from '@/types/patient';
import { usePatientProfile } from '@/hooks/usePatientProfile';
import { useUpdatePatientProfile } from '@/hooks/useUpdatePatientProfile';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { profile, refetch } = usePatientProfile();
  const { updateProfile, loading, error, success } = useUpdatePatientProfile({
    onSuccess: () => {
      refetch();
      setTimeout(onClose, 1000);
    },
  });

  const [formData, setFormData] = useState<UpdateUserProfileRequest>({
    displayName: '',
    fullName: '',
    phoneNumber: '',
    avatarUrl: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName,
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
        avatarUrl: profile.avatarUrl || '',
      });
    }
  }, [profile, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
            placeholder="Display Name"
            required
          />
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            placeholder="Full Name"
            required
          />
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
            placeholder="Phone Number"
            required
          />
          <input
            type="url"
            value={formData.avatarUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
            placeholder="Avatar URL"
          />

          {error && <p className="text-red-600 text-sm">{error.message}</p>}
          {success && <p className="text-green-600 text-sm">Profile updated!</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

## 📅 Appointment Management Examples

### 1. Upcoming Appointment List

```typescript
'use client';

import { usePatientAppointments } from '@/hooks/usePatientAppointments';

export function UpcomingAppointmentsList() {
  const { upcomingAppointments, loading, error, refetch } = usePatientAppointments();

  if (loading) return <div>Loading appointments...</div>;

  if (error) {
    return (
      <div>
        <p className="text-red-600 mb-2">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (upcomingAppointments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No upcoming appointments</p>
        <a href="/patient/book-appointment" className="text-blue-600 underline">
          Book one now
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your Appointments</h2>
      {upcomingAppointments.map((apt) => (
        <div key={apt.id} className="p-4 border rounded-lg">
          <h3 className="font-semibold">Dr. {apt.doctorName}</h3>
          <p className="text-gray-600">
            {new Date(apt.appointmentTime).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">{apt.facilityName}</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. Cancel Appointment with Confirmation

```typescript
'use client';

import { useState } from 'react';
import { cancelAppointment } from '@/services/api/patient.api';
import { usePatientAppointments } from '@/hooks/usePatientAppointments';

export function AppointmentActions({ appointmentId }: { appointmentId: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { refetch } = usePatientAppointments();

  const handleCancel = async () => {
    try {
      setLoading(true);
      setError(null);

      await cancelAppointment({
        appointmentId,
        reason: reason || undefined,
      });

      alert('Appointment cancelled');
      setShowConfirm(false);
      setReason('');
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to cancel'));
    } finally {
      setLoading(false);
    }
  };

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50"
      >
        Cancel Appointment
      </button>
    );
  }

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded">
      <p className="font-semibold mb-2">Cancel this appointment?</p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (optional)"
        className="w-full p-2 border rounded mb-2"
        rows={3}
      />
      {error && <p className="text-red-600 text-sm mb-2">{error.message}</p>}
      <div className="flex gap-2">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          {loading ? 'Cancelling...' : 'Confirm Cancel'}
        </button>
        <button
          onClick={() => {
            setShowConfirm(false);
            setReason('');
            setError(null);
          }}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Keep It
        </button>
      </div>
    </div>
  );
}
```

---

## 🔍 Doctor Search Examples

### 1. Doctor Search Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { searchDoctors, SearchDoctorsParams } from '@/services/api/patient.api';
import { Doctor } from '@/types/patient';

export function DoctorSearchForm() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: SearchDoctorsParams = {
        keyword: keyword || undefined,
        location: location || undefined,
        page: 1,
        size: 10,
      };

      const result = await searchDoctors(params);
      setDoctors(result.doctors);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Search failed'));
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Doctor name or specialty"
          className="flex-1 px-4 py-2 border rounded"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="flex-1 px-4 py-2 border rounded"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-600">{error.message}</p>}

      {doctors.map((doctor) => (
        <div key={doctor.id} className="p-4 border rounded-lg">
          <h3 className="font-semibold">{doctor.name}</h3>
          <p className="text-gray-600">{doctor.specialty}</p>
          <p className="text-sm text-gray-500">{doctor.facility}</p>
          <button
            onClick={() => {
              window.location.href = `/patient/book-appointment?doctorId=${doctor.id}`;
            }}
            className="mt-2 px-4 py-1 bg-blue-600 text-white rounded text-sm"
          >
            Book Appointment
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 2. Doctor Detail with Favorites

```typescript
'use client';

import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync'; // Or fetch manually
import { getDoctorDetail, addFavoriteDoctor, removeFavoriteDoctor } from '@/services/api/patient.api';
import { DoctorDetail } from '@/types/patient';

interface DoctorProfileProps {
  doctorId: string;
}

export function DoctorProfile({ doctorId }: DoctorProfileProps) {
  const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data = await getDoctorDetail(doctorId);
        setDoctor(data);
      } catch (err) {
        console.error('Failed to fetch doctor', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleToggleFavorite = async () => {
    if (!doctor) return;

    try {
      setFavLoading(true);
      if (isFavorite) {
        // Remove from favorites
        // Note: Need favorite ID, adjust based on your response
        // await removeFavoriteDoctor(favoriteId);
      } else {
        // Add to favorites
        await addFavoriteDoctor(doctorId);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Failed to update favorite', err);
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!doctor) return <div>Doctor not found</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">Dr. {doctor.name}</h1>
          <p className="text-gray-600">{doctor.specialty}</p>
        </div>
        <button
          onClick={handleToggleFavorite}
          disabled={favLoading}
          className={`px-4 py-2 rounded text-white ${
            isFavorite ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 hover:bg-gray-500'
          }`}
        >
          {isFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
        </button>
      </div>

      <div className="space-y-4">
        <p><strong>Experience:</strong> {doctor.experience} years</p>
        <p><strong>Facility:</strong> {doctor.facility}</p>
        <p><strong>Email:</strong> {doctor.email}</p>
        <p><strong>License:</strong> {doctor.license}</p>
        <p><strong>About:</strong> {doctor.about}</p>
      </div>

      {doctor.reviews && doctor.reviews.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">Reviews</h2>
          {doctor.reviews.map((review) => (
            <div key={review.id} className="p-3 bg-gray-50 rounded mb-2">
              <p className="font-semibold">{review.patientName}</p>
              <p className="text-yellow-500">{'⭐'.repeat(review.rating)}</p>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => {
          window.location.href = `/patient/book-appointment?doctorId=${doctorId}`;
        }}
        className="mt-6 w-full px-6 py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700"
      >
        Book Appointment with Dr. {doctor.name}
      </button>
    </div>
  );
}
```

---

## ⭐ Leave Review Examples

### 1. Review Form

```typescript
'use client';

import { FormEvent, useState } from 'react';
import { submitReview } from '@/services/api/patient.api';

interface ReviewFormProps {
  doctorId: string;
  appointmentId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ doctorId, appointmentId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      setError(new Error('Please write a review'));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await submitReview({
        doctorId,
        appointmentId,
        rating,
        comment,
      });

      setSuccess(true);
      setComment('');
      setRating(5);
      
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to submit review'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded text-center">
        <p className="text-green-700 font-semibold">✅ Thank you for your review!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">Leave a Review</h2>

      <div>
        <label className="block font-semibold mb-2">Rating</label>
        <div className="flex gap-2 text-3xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Your Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows={4}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error.message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
```

---

## 🛡️ Error Handling Best Practices

### 1. Global Error Boundary

```typescript
'use client';

import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Error caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-bold text-red-900 mb-2">Something went wrong</h2>
          <p className="text-red-700 mb-4">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 2. Safe API Call Wrapper

```typescript
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function safeApiCall<T>(
  fn: () => Promise<T>
): Promise<T | null> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        // Handle unauthorized
        console.log('User unauthorized');
      }
      throw err;
    }
    throw new Error('Unknown error occurred');
  }
}
```

---

## 🎯 Performance Tips

### 1. Memoize Components

```typescript
import { memo } from 'react';

export const ProfileCard = memo(function ProfileCard({ profile }: Props) {
  return (
    <div>
      <h3>{profile.displayName}</h3>
      <p>{profile.email}</p>
    </div>
  );
});
```

### 2. Cache API Responses

```typescript
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute

export async function getCachedDoctors(specialtyId: string) {
  const cacheKey = `doctors-${specialtyId}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await searchDoctors({ specialtyId });
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}
```

### 3. Debounce Search

```typescript
import { useEffect, useState } from 'react';

export function DoctorSearch() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setSearching(true);
      const result = await searchDoctors({ keyword });
      setResults(result.doctors);
      setSearching(false);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [keyword]);

  return (
    <input
      type="text"
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      placeholder="Type to search..."
    />
  );
}
```

---

## 📱 Responsive Design Tips

### 1. Mobile-Friendly Appointment Card

```typescript
export function AppointmentCardResponsive(props: Props) {
  return (
    <div className="p-4 md:p-6 bg-white rounded-lg border">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-semibold">{props.doctor}</h3>
          <p className="text-xs md:text-sm text-gray-600">{props.time}</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-3 py-2 text-sm">Reschedule</button>
          <button className="flex-1 md:flex-none px-3 py-2 text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}
```

---

## 🧪 Testing Best Practices

### 1. Mock API for Testing

```typescript
// src/__mocks__/patient.api.ts
export const mockSearchDoctors = async () => {
  return {
    doctors: [
      {
        id: '1',
        name: 'Dr. John Doe',
        specialty: 'Cardiology',
        facility: 'City Hospital',
        email: 'john@example.com',
        license: 'LIC123',
        experience: 10,
      },
    ],
  };
};
```

### 2. Component Test Example

```typescript
import { render, screen } from '@testing-library/react';
import { ProfileHeader } from '@/components/ProfileHeader';

// Mock the hook
jest.mock('@/hooks/usePatientProfile', () => ({
  usePatientProfile: () => ({
    profile: {
      displayName: 'John Doe',
      email: 'john@example.com',
    },
    loading: false,
    error: null,
  }),
}));

test('displays profile name', () => {
  render(<ProfileHeader />);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

---

**End of Examples**

These patterns demonstrate production-ready code for common scenarios.
