# 🏥 Patient & Patient Profile Frontend Integration Guide

Complete production-ready frontend integration for ASP.NET Backend Patient APIs.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication & Token Management](#authentication--token-management)
3. [API Service Layer](#api-service-layer)
4. [TypeScript Types](#typescript-types)
5. [Custom Hooks](#custom-hooks)
6. [Component Integration](#component-integration)
7. [Error Handling Strategy](#error-handling-strategy)
8. [Best Practices](#best-practices)
9. [API Flow Examples](#api-flow-examples)
10. [Folder Structure](#folder-structure)

---

## Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────────┐
│        React Components (Pages/UI)      │
│  (Patient Profile, Appointments, etc.)  │
└─────────────────────┬───────────────────┘
                      │
┌─────────────────────▼───────────────────┐
│      Custom Hooks (Data Logic)          │
│  (usePatientProfile, useAppointments)   │
└─────────────────────┬───────────────────┘
                      │
┌─────────────────────▼───────────────────┐
│     API Service Layer (Functions)       │
│  (patient.api.ts, userProfile.api.ts)   │
└─────────────────────┬───────────────────┘
                      │
┌─────────────────────▼───────────────────┐
│  HTTP Client with Interceptors          │
│        (apiClient.ts - Axios)           │
│  - JWT Token Attachment                 │
│  - Error Handling (401, 403, 500)       │
└─────────────────────┬───────────────────┘
                      │
          ┌───────────▼───────────┐
          │  Backend ASP.NET API  │
          └───────────────────────┘
```

---

## Authentication & Token Management

### 1. Where to Store Token

**Recommended: localStorage** (for this app)
- Simple to implement
- Persists across sessions
- Works with server-side rendering after hydration

**Alternatives:**
- `sessionStorage`: Cleared when tab closes
- `HttpOnly Cookie`: More secure (requires backend support)

### 2. Save Token After Login

```typescript
// After successful login API call (in auth service)
const loginResponse = await authApi.login(credentials);
setAuthToken(loginResponse.token); // Stores in localStorage
```

### 3. Attach Token to Every Request

**Automatically handled by axios interceptor in `apiClient.ts`:**

```typescript
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Result:** Every API request includes header:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Handle Token Expiration (401)

**When server returns 401 Unauthorized:**

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear stored token
      clearAuthToken();
      // Trigger app-wide logout event
      window.dispatchEvent(new Event('auth:expired'));
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## API Service Layer

### File: `/services/api/apiClient.ts`

Base axios instance with:
- ✅ JWT token attachment
- ✅ Automatic 401 handling
- ✅ Request/response interceptors
- ✅ Timeout configuration

### File: `/services/api/patient.api.ts`

Patient-related functions:
- `bookAppointment()` - POST
- `getPatientAppointments()` - GET
- `searchDoctors()` - GET with query params
- `getDoctorDetail()` - GET by ID
- `addFavoriteDoctor()` - POST
- `removeFavoriteDoctor()` - DELETE
- `getFavoriteDoctors()` - GET
- `submitReview()` - POST
- `cancelAppointment()` - POST
- `rescheduleAppointment()` - POST

### File: `/services/api/userProfile.api.ts`

Profile-related functions:
- `getUserProfile()` - GET
- `updateUserProfile()` - PUT

**Error Handling:** All functions throw typed errors with specific messages.

---

## TypeScript Types

### File: `/types/patient.ts`

All types are based on backend DTOs:

```typescript
// User profile
interface UserProfile {
  id: string;
  displayName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl?: string;
}

// Update request
interface UpdateUserProfileRequest {
  displayName: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl?: string;
}

// Appointment
interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  facilityId: string;
  facilityName: string;
  specialtyId: string;
  specialtyName: string;
  appointmentTime: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  notes?: string;
  createdAt: string;
}

// Book appointment request
interface BookAppointmentRequest {
  facilityId: string;
  specialtyId: string;
  doctorId: string;
  appointmentTime: string;
  notes?: string;
}

// And more...
```

---

## Custom Hooks

### 1. `usePatientProfile()`

**Purpose:** Fetch and manage patient profile

```typescript
const { profile, loading, error, refetch, isAuthenticated } = usePatientProfile();

// Access data
if (profile) {
  console.log(profile.displayName);
}

// Refetch if needed
refetch();

// Check authentication
if (!isAuthenticated) {
  redirectToLogin();
}
```

**Features:**
- Automatic fetch on mount
- Caches data to prevent duplicates
- Handles 401 expiration
- Manual refetch capability

### 2. `useUpdatePatientProfile(options?)`

**Purpose:** Handle profile updates

```typescript
const { updateProfile, loading, error, success, clearError } =
  useUpdatePatientProfile({
    onSuccess: (updatedProfile) => {
      console.log('Profile updated!');
      showNotification('Success!');
    },
    onError: (error) => {
      console.error('Update failed:', error);
    },
  });

// Call when form submitted
await updateProfile({
  displayName: 'John D.',
  fullName: 'John Doe',
  phoneNumber: '1234567890',
});
```

**Features:**
- Form validation before send
- Detailed error messages
- Success callbacks
- Optimistic UI updates

### 3. `usePatientAppointments()`

**Purpose:** Fetch and manage appointments

```typescript
const { appointments, upcomingAppointments, pastAppointments, loading, error, refetch } =
  usePatientAppointments();

// This automatically separates appointments
upcomingAppointments.forEach((apt) => {
  console.log(`${apt.doctorName} on ${apt.appointmentTime}`);
});
```

**Features:**
- Automatic separation of upcoming/past
- Caching
- Manual refetch

---

## Component Integration

### Example: Patient Profile Page

**File:** `/app/[locale]/patient/profile/page.tsx`

**Shows:**
- ✅ Using `usePatientProfile()` to fetch data
- ✅ Using `useUpdatePatientProfile()` to update
- ✅ Form validation
- ✅ Error handling & display
- ✅ Loading states
- ✅ Success notifications
- ✅ Read-only vs editable fields

**Key Sections:**

1. **Initial Load:**
   ```typescript
   const { profile, loading, error } = usePatientProfile();
   
   if (loading) return <LoadingSpinner />;
   if (error) return <ErrorMessage error={error} />;
   ```

2. **Form State:**
   ```typescript
   const [formData, setFormData] = useState<UpdateUserProfileRequest>({...});
   
   // Sync with profile data
   useEffect(() => {
     if (profile) {
       setFormData({
         displayName: profile.displayName,
         ...
       });
     }
   }, [profile]);
   ```

3. **Form Submission:**
   ```typescript
   const handleSubmit = async (e: FormEvent) => {
     e.preventDefault();
     // Validate
     // Call updateProfile()
     await updateProfile(formData);
   };
   ```

4. **Feedback:**
   ```typescript
   {success && <SuccessAlert />}
   {updateError && <ErrorAlert error={updateError} />}
   ```

---

## Error Handling Strategy

### HTTP Status Code Handling

| Status | Meaning | Frontend Action |
|--------|---------|-----------------|
| **200** | Success | Update UI, show data |
| **400** | Validation Error | Show field errors to user |
| **401** | Unauthorized/Token Expired | Clear token, redirect to login |
| **403** | Forbidden/Insufficient Role | Show permission error |
| **404** | Not Found | Show "not found" message |
| **500** | Server Error | Show retry button |
| **Network Error** | No connection | Show offline message |

### Error Handling in Components

```typescript
// 1. API layer catches and shapes errors
async function updateUserProfile(request) {
  try {
    const response = await apiClient.put(...);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 400) {
      // Return validation errors with field names
      throw new Error(`Field Error: ${error.response.data.errors}`);
    }
    if (error.response?.status === 401) {
      throw new Error('Session expired');
    }
    throw error;
  }
}

// 2. Hook catches and provides state
const { updateProfile, error } = useUpdatePatientProfile();
try {
  await updateProfile(data);
} catch (err) {
  setError(err);
}

// 3. Component displays error to user
{error && <div className="text-red-600">{error.message}</div>}
```

### Validation Errors (400 Bad Request)

Backend returns:
```json
{
  "success": false,
  "errors": {
    "displayName": ["Display name cannot be blank"],
    "phoneNumber": ["Phone number is not valid"]
  }
}
```

Frontend displays:
```typescript
if (data.errors) {
  Object.entries(data.errors).forEach(([field, messages]) => {
    showFieldError(field, messages[0]);
  });
}
```

---

## Best Practices

### 1. ✅ Always Use TypeScript Types

```typescript
// ✅ GOOD
const profile: UserProfile = await getUserProfile();
const handleUpdate = (data: UpdateUserProfileRequest) => { };

// ❌ BAD
const profile: any = await getUserProfile();
const handleUpdate = (data: any) => { };
```

### 2. ✅ Separate Concerns

- **API Layer** (`/services/api/`): Only handles HTTP calls
- **Hooks Layer** (`/hooks/`): Handles state and business logic
- **Component Layer** (`/app/`): Handles UI and user interaction

```typescript
// ❌ BAD - Logic in component
const MyComponent = () => {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    axios.get('/api/v1/users/profile').then(res => setProfile(res.data));
  }, []);
};

// ✅ GOOD - Using hook
const MyComponent = () => {
  const { profile } = usePatientProfile();
};
```

### 3. ✅ Handle Loading States

```typescript
// ✅ GOOD
if (loading) return <Spinner />;
if (error) return <ErrorMessage />;
return <ProfileForm profile={profile} />;

// ❌ BAD
return (
  <div>
    {profile && <ProfileForm profile={profile} />}
  </div>
);
```

### 4. ✅ Validate Before Sending

```typescript
// ✅ GOOD - Hook validates
const updateProfile = useCallback(async (data) => {
  if (!data.displayName.trim()) {
    throw new Error('Display name required');
  }
  await apiCall(data);
}, []);

// ❌ BAD - No validation
const updateProfile = useCallback(async (data) => {
  await apiCall(data);
}, []);
```

### 5. ✅ Use Optimistic Updates (if applicable)

```typescript
// ✅ GOOD - Update UI immediately, then API
const { updateProfile } = useUpdatePatientProfile({
  onSuccess: (newData) => {
    // Update local state first
    setProfile(newData);
    // Show success
    showNotification('Updated!');
  },
});

// ❌ BAD - Wait for API response
const updateProfile = async (data) => {
  const result = await apiCall(data);
  setProfile(result);
};
```

### 6. ✅ Cache Data Appropriately

- **Profile**: Cache after first fetch (rarely changes)
- **Appointments**: Cache with 5-10 second TTL
- **Search Results**: Cache with page/filter key

```typescript
// Hook already does this
const { profile } = usePatientProfile(); // Cached after mount
const { refetch } = usePatientProfile(); // Manual refetch when needed
```

### 7. ✅ Handle Race Conditions

```typescript
// ✅ GOOD - Cancel previous request if new one starts
let isMounted = true;

useEffect(() => {
  isMounted = true;
  fetchData();
  return () => {
    isMounted = false; // Ignore response if unmounted
  };
}, []);
```

### 8. ✅ Provide Clear Feedback

```typescript
// ✅ GOOD - Clear state management
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);
const [success, setSuccess] = useState(false);

// Show appropriate UI
if (loading) return <Spinner />;
if (error) return <ErrorAlert error={error} onRetry={refetch} />;
if (success) return <SuccessAlert />;
```

---

## API Flow Examples

### Flow 1: User Login → Profile Load

```
1. User enters credentials on login page
   ↓
2. Call authApi.login(email, password)
   ↓
3. Backend returns token + user info
   ↓
4. Frontend: setAuthToken(token) → saves to localStorage
   ↓
5. Redirect to /patient/profile
   ↓
6. Profile page calls usePatientProfile()
   ↓
7. Hook calls getUserProfile()
   ↓
8. axios interceptor adds: Authorization: Bearer {token}
   ↓
9. GET /api/v1/users/profile
   ↓
10. Backend decodes token, finds user ID
    ↓
11. Returns user profile data
    ↓
12. Component renders profile with display name, email, etc.
```

### Flow 2: Update Patient Profile

```
1. User clicks "Edit Profile" button
   ↓
2. Form populated with current profile data
   ↓
3. User changes phone number + display name
   ↓
4. User clicks "Save Changes"
   ↓
5. handleSubmit() → validate data
   ↓
6. updateProfile({displayName, fullName, phoneNumber, avatarUrl})
   ↓
7. Hook checks: display name not blank, phone valid, etc.
   ↓
8. Call updateUserProfile(data)
   ↓
9. axios interceptor adds token
   ↓
10. PUT /api/v1/users/profile with JSON body
    ↓
11. Backend validates:
    - displayName: not blank, no HTML/SQL
    - phoneNumber: valid format
    - etc.
    ↓
12. If invalid → 400 Bad Request with errors
    Hook throws Error with field details
    Component shows: "Phone number is not valid"
    ↓
13. If valid → 200 OK, update database
    Hook calls onSuccess callback
    Component shows "Profile updated!"
    Component refetches profile
    ↓
14. UI updated with new data
```

### Flow 3: Book an Appointment

```
1. User searches for doctors
   GET /api/v1/patient/doctors?specialty=Cardiology&page=1
   ↓
2. Results displayed, user selects doctor
   ↓
3. User picks appointment time
   ↓
4. User clicks "Book Appointment"
   ↓
5. Call bookAppointment({
     facilityId: "...",
     specialtyId: "...",
     doctorId: "...",
     appointmentTime: "2026-03-25T10:00:00Z",
     notes: "..."
   })
   ↓
6. Authorization header added automatically
   ↓
7. POST /api/v1/patient/appointments
   ↓
8. Backend:
   - Extracts patient ID from token
   - Validates facility, specialty, doctor exist
   - Checks appointment time is not in past
   - Creates appointment linked to patient
   ↓
9. Returns 200 OK with appointment data
   ↓
10. Component shows: "Appointment booked successfully!"
    ↓
11. usePatientAppointments().refetch()
    ↓
12. New appointment appears in list
```

### Flow 4: Handle Token Expiration

```
1. User logged in, using app normally
   ↓
2. Token stored in localStorage (valid for 24 hours)
   ↓
3. User leaves page open overnight → token expires
   ↓
4. User clicks button to book appointment
   ↓
5. POST request includes old token in Authorization header
   ↓
6. Backend: "This token is expired"
   Returns 401 Unauthorized
   ↓
7. axios interceptor catches 401
   ↓
8. Response interceptor:
   - clearAuthToken() → removes from localStorage
   - window.dispatchEvent(new Event('auth:expired'))
   ↓
9. Hook listens to 'auth:expired' event
   setProfile(null)
   setIsAuthenticated(false)
   ↓
10. Component checks: if (!isAuthenticated)
    Shows: "Your session has expired. Please log in again."
    ↓
11. User clicks link → redirected to /login
    ↓
12. User logs in again → new token obtained
    ↓
13. Back to normal operation
```

---

## Folder Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── patient/
│   │   │   ├── profile/
│   │   │   │   └── page.tsx          # Patient profile page (example)
│   │   │   ├── appointments/
│   │   │   │   └── page.tsx          # Appointments list page
│   │   │   └── book-appointment/
│   │   │       └── page.tsx          # Booking form page
│   │   └── ...
│   └── ...
│
├── services/
│   └── api/
│       ├── apiClient.ts              # Base axios + interceptors
│       ├── patient.api.ts            # Patient API functions
│       ├── userProfile.api.ts        # Profile API functions
│       ├── authApi.ts                # [EXISTING]
│       ├── adminApi.ts               # [EXISTING]
│       └── baseApi.ts                # [EXISTING]
│
├── hooks/
│   ├── usePatientProfile.ts          # Fetch patient profile
│   ├── useUpdatePatientProfile.ts    # Update profile
│   ├── usePatientAppointments.ts     # Fetch appointments
│   ├── useAuth.ts                    # [EXISTING]
│   └── ... (other hooks)
│
├── types/
│   ├── patient.ts                    # Patient & profile types
│   ├── auth.ts                       # [EXISTING]
│   ├── admin.ts                      # [EXISTING]
│   └── index.ts                      # [EXISTING]
│
├── components/
│   ├── common/                       # [EXISTING]
│   ├── layout/                       # [EXISTING]
│   ├── page/
│   │   ├── patient-profile/          # NEW - Profile components
│   │   ├── appointments/             # NEW - Appointment components
│   │   └── ...
│   └── ...
│
├── lib/
│   ├── utils.ts                      # [EXISTING]
│   └── ...
│
└── i18n/
    └── ... [EXISTING]
```

---

## Quick Setup Checklist

- [x] Create `/services/api/apiClient.ts` - Axios config + interceptors
- [x] Create `/services/api/patient.api.ts` - Patient API functions
- [x] Create `/services/api/userProfile.api.ts` - Profile API functions
- [x] Create `/types/patient.ts` - TypeScript types
- [x] Create `/hooks/usePatientProfile.ts` - Profile hook
- [x] Create `/hooks/useUpdatePatientProfile.ts` - Update hook
- [x] Create `/hooks/usePatientAppointments.ts` - Appointments hook
- [x] Create example page: `/app/[locale]/patient/profile/page.tsx`
- [ ] Update `.env.local` with API base URL:
  ```env
  NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
  ```
- [ ] Implement toast notification system (replace `showNotification()`)
- [ ] Add protected route wrapper for patient pages
- [ ] Create appointment booking page using similar patterns
- [ ] Add global error boundary for 401 handling
- [ ] Create loading skeleton components

---

## Common Mistakes to Avoid

### ❌ 1. Missing Token in Requests
**Problem:** Calling patient endpoints without token
```typescript
// ❌ BAD
const appointments = await axios.get('/api/v1/GetPatientAppointment/me/appointments');
// Returns 401 Unauthorized
```

**Solution:** Token always included via interceptor
```typescript
// ✅ GOOD - Automatic via interceptor
const appointments = await getPatientAppointments();
// Token included automatically
```

### ❌ 2. Wrong Error Handling
**Problem:** Not catching validation errors properly
```typescript
// ❌ BAD
try {
  await updateProfile(data);
} catch (error) {
  console.log(error); // Shows HTTP status only
}
```

**Solution:** Parse response errors correctly
```typescript
// ✅ GOOD
try {
  await updateProfile(data);
} catch (error) {
  const message = error.message; // Already contains details
  showError(message); // Shows "Display name cannot be blank"
}
```

### ❌ 3. HTML/Script Injection in Profile Fields
**Problem:** Sending unsanitized user input
```typescript
// ❌ BAD - Backend will reject
await updateProfile({
  displayName: '<script>alert("hacked")</script>',
  ...
});
// Returns 400 Bad Request - No HTML allowed
```

**Solution:** Trust backend validation, or sanitize on frontend
```typescript
// ✅ GOOD - Backend validates, but also good practice
const sanitized = displayName.replace(/<[^>]*>/g, '');
await updateProfile({
  displayName: sanitized,
  ...
});
```

### ❌ 4. Sending User ID in Profile Update
**Problem:** Including userId in request body
```typescript
// ❌ BAD - Backend ignores and gets ID from token anyway
await updateProfile({
  id: userId, // Not needed, not used
  displayName: '...',
  ...
});
```

**Solution:** Backend reads ID from token
```typescript
// ✅ GOOD - Only send fields to update
await updateProfile({
  displayName: '...',
  fullName: '...',
  phoneNumber: '...',
  avatarUrl: '...',
});
```

### ❌ 5. Not Handling Async Properly
**Problem:** Race conditions, stale state
```typescript
// ❌ BAD - useEffect without cleanup
useEffect(() => {
  fetchProfile();
  // If component unmounts, state update still happens
}, []);
```

**Solution:** Hooks handle this already, but ensure cleanup
```typescript
// ✅ GOOD - Hook manages internally
const { profile } = usePatientProfile();
// Automatically handles unmount + cleanup
```

---

## Summary

### Files Created/Modified

| File | Purpose |
|------|---------|
| `/services/api/apiClient.ts` | Axios instance + JWT interceptors |
| `/services/api/patient.api.ts` | Patient API endpoints |
| `/services/api/userProfile.api.ts` | Profile API endpoints |
| `/types/patient.ts` | TypeScript types (from DTOs) |
| `/hooks/usePatientProfile.ts` | Fetch profile hook |
| `/hooks/useUpdatePatientProfile.ts` | Update profile hook |
| `/hooks/usePatientAppointments.ts` | Fetch appointments hook |
| `/app/[locale]/patient/profile/page.tsx` | Example component |

### Key Concepts

| Concept | Usage |
|---------|-------|
| **JWT Token** | Stored in localStorage, attached to Auth header |
| **Interceptors** | Automatically add token + handle 401 |
| **API Layer** | Thin wrapper around axios (error handling) |
| **Custom Hooks** | Encapsulate state + API calls |
| **TypeScript** | Type-safe data flow |
| **Error Handling** | Graceful failures with user feedback |

---

## ✅ Production Checklist

- [ ] All files created and tested
- [ ] Environment variables set (API_BASE_URL)
- [ ] Token management working (login → localStorage → requests)
- [ ] 401 handling redirects to login
- [ ] Validation errors displayed to user
- [ ] Loading states shown in UI
- [ ] Form validation before API calls
- [ ] Error boundaries implemented
- [ ] TypeScript strict mode enabled
- [ ] API calls use custom hooks (not direct axios)
- [ ] No sensitive data logged to console
- [ ] HTTPS used in production
- [ ] CORS configured on backend (if needed)
- [ ] Rate limiting considered
- [ ] Monitoring/logging in place

---

## Next Steps

1. **Install dependencies:**
   ```bash
   npm install axios
   ```

2. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
   ```

3. **Test authentication flow:**
   - Login page → get token
   - Verify token saved to localStorage
   - Verify token attached to requests

4. **Create appointment booking page** using same pattern as profile

5. **Implement appointment management:**
   - View upcoming/past appointments
   - Cancel appointment
   - Reschedule appointment
   - Leave review

6. **Add doctor search page:**
   - Search by specialty
   - Filter by facility
   - View doctor details
   - Add to favorites

---

**Happy coding! 🚀**

For questions or issues, refer back to the backend API README and ensure your requests match the exact payload formats.
