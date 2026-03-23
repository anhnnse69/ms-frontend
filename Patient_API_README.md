# 🏥 Patient & Patient Profile APIs Documentation

This documentation provides a clean, frontend-ready guide to integrating the **Patient** and **Patient Profile** modules in the ASP.NET Web API backend.

---

## 1. Overview
- **Patient Module**: Handles all medical-related actions for a patient. This includes searching for doctors, viewing doctor details, booking/canceling/rescheduling appointments, managing favorite doctors/facilities, and submitting reviews.
- **Patient Profile**: Represents the user-facing personal information (Display Name, Full Name, Phone, Avatar) of the patient. The profile is linked to the core [User](file:///D:/8/PRN232/GP_BackEnd2/ms-backend-api/MSBackendAPI/MS.Domain/Entities/User.cs#7-38) account, which maintains a 1-to-1 relationship with the [Patient](file:///D:/8/PRN232/GP_BackEnd2/ms-backend-api/MSBackendAPI/MS.Domain/Entities/Patient.cs#7-38) entity.

---

## 2. Authentication
- **Type**: **JWT (JSON Web Token)**
- **Role Requirement**: 
  - Profile APIs: Require standard authentication (`[Authorize]`).
  - Patient APIs: Most require the [Patient](file:///D:/8/PRN232/GP_BackEnd2/ms-backend-api/MSBackendAPI/MS.Domain/Entities/Patient.cs#7-38) role specifically (`[Authorize(Roles = "Patient")]`).
- **How Frontend Should Authenticate**:
  1. Login via the Authentication endpoint to receive a JWT token.
  2. Attach the token to every protected request in the `Authorization` header.
  - **Header Format**: `Authorization: Bearer <your_jwt_token_here>`

---

## 3. Base API Info
- **Base URL**: `http(s)://<your-api-domain>`
- **Common Route Prefixes**: 
  - Profile APIs: `/api/v1/users`
  - Patient APIs: `/api/v1/patient` (and some controller-specific routes)

---

## 4. Patient APIs

### 4.1. Book Appointment
- **Endpoint**: Book Appointment
- **HTTP Method**: `POST`
- **Route**: `/api/v1/patient/appointments`
- **Description**: Books a new medical appointment for the authenticated patient. Requires [Patient](file:///D:/8/PRN232/GP_BackEnd2/ms-backend-api/MSBackendAPI/MS.Domain/Entities/Patient.cs#7-38) role.

**Request:**
- **Body**: JSON
```json
{
  "facilityId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "specialtyId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "doctorId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "appointmentTime": "2026-03-23T14:30:00Z",
  "notes": "Optional notes for the doctor"
}
```

**Response:**
- **Success (200 OK)**: Wrapped in standard `ApiResponse<T>`.
- **Unauthorized (401)**: Missing or invalid token.
- **Forbidden (403)**: Token is valid but user lacks [Patient](file:///D:/8/PRN232/GP_BackEnd2/ms-backend-api/MSBackendAPI/MS.Domain/Entities/Patient.cs#7-38) role.

---

### 4.2. Get My Appointments
- **Endpoint**: Get My Appointments
- **HTTP Method**: `GET`
- **Route**: `/api/v1/GetPatientAppointment/me/appointments`
- **Description**: Retrieves the current and past appointments of the authenticated patient. Requires [Patient](file:///D:/8/PRN232/GP_BackEnd2/ms-backend-api/MSBackendAPI/MS.Domain/Entities/Patient.cs#7-38) role.

**Request:**
- None (Identity derived from token).

**Response:**
- **Success (200 OK)**: Returns list of appointments inside `ApiResponse<GetPatientAppointmentsResponse>`.
```json
{
  "success": true,
  "data": {
    "appointments": [ ... ]
  }
}
```

---

### 4.3. Search Doctors
- **Endpoint**: Search Doctors
- **HTTP Method**: `GET`
- **Route**: `/api/v1/patient/doctors`
- **Description**: Searches for doctors by keyword, specialty, facility, location, etc.

**Request:**
- **Query Params**:
  - `keyword` *(string, optional)*: Search by doctor/facility name.
  - `specialtyId` *(guid, optional)*: Filter by specialty.
  - `facilityId` *(guid, optional)*: Filter by facility.
  - `location` *(string, optional)*: City or address.
  - `page` *(int)*: Default `1`.
  - `size` *(int)*: Default `10`.

---

### 4.4. Additional Patient Endpoints (Summary)
*(These follow similar conventions using `Authorization: Bearer <token>` and standard JSON payloads)*
- **Get Doctor Detail**: `GET /api/v1/patient/doctors/{id}`
- **Add Favorite**: `POST /api/v1/patient/favorites`
- **Delete Favorite**: `DELETE /api/v1/patient/favorites/{id}`
- **Get Favorites**: `GET /api/v1/patient/favorites`
- **Submit Review**: `POST /api/v1/patient/reviews`
- **Cancel Appointment**: `POST /api/CancelAppointment`
- **Reschedule Appointment**: `POST /api/RescheduleAppointment`

---

## 5. Patient Profile APIs

### 5.1. Get User Profile
- **Endpoint**: Get Profile
- **HTTP Method**: `GET`
- **Route**: `/api/v1/users/profile`
- **Description**: Retrieves the personal profile of the currently authenticated user.

**Request:**
- None (Headers: `Authorization: Bearer <token>`).

**Response (200 OK):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "displayName": "John Doe",
  "fullName": "Johnathan Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "1234567890",
  "avatarUrl": "https://example.com/avatars/johndoe.jpg"
}
```

---

### 5.2. Update User Profile
- **Endpoint**: Update Profile
- **HTTP Method**: `PUT`
- **Route**: `/api/v1/users/profile`
- **Description**: Updates the personal profile of the currently authenticated user.

**Request:**
- **Body**: [UpdateUserProfileRequest](file:///D:/8/PRN232/GP_BackEnd2/ms-backend-api/MSBackendAPI/MS.Application/Services/PatientServices/UpdateUserProfileService/UpdateUserProfileRequest.cs#10-33)
```json
{
  "displayName": "John D.",
  "fullName": "Johnathan Doe",
  "phoneNumber": "0987654321",
  "avatarUrl": "https://example.com/avatars/new-avatar.jpg"
}
```

**Response:**
- **Success (200 OK)**: Returns `true` wrapped in an `ApiResponse<T>`.

---
### 5.3. Change Password
Endpoint: Change Password
HTTP Method: POST
Route: /api/v1/ChangePassword
Description: Allows the authenticated user (Patient) to change their account password. The user identity is extracted from the JWT token — no userId is required in the request body.
🔐 Authorization
Required: Authorization: Bearer <token>
User must be authenticated ([Authorize])
📥 Request
Body: JSON
{
  "currentPassword": "oldPassword123",
  "newPassword": "NewPassword@123"
}
📌 Request Rules (Validation)
Field	Required	Rules
currentPassword	✅ Yes	Min 8 chars, No HTML, No SQL Injection
newPassword	✅ Yes	Min 8 chars, Must meet password strength
📤 Response
✅ Success (200 OK)
{
  "success": true,
  "message": "APP_MESSAGE_2000",
  "data": {
    "message": "Password changed successfully"
  }
}
#### Error Cases
Status	Condition	Message
401	Missing/Invalid token	Unauthorized
400	User not found	APP_MESSAGE_4010
400	Current password incorrect	APP_MESSAGE_4016
400	Validation failed	APP_MESSAGE_4003 / APP_MESSAGE_4019
#### Business Logic
UserId is extracted from JWT token (NOT from request body)
Flow:
Get user by ID
Check user exists
Verify current password
Hash new password
Update database

## 6. DTO & Data Models

### 6.1. GetUserProfileResponse (Patient Profile DTO)
| Field Name    | Data Type | Required/Optional | Description |
|---------------|-----------|-------------------|-------------|
| `Id`          | `Guid`    | Required          | Unique identifier of the user |
| `DisplayName` | `string`  | Required          | Display name |
| `FullName`    | `string`  | Required          | Full legal name |
| `Email`       | `string`  | Required          | Read-only email address |
| `PhoneNumber` | `string`  | Required          | Contact number |
| `AvatarUrl`   | `string`  | Optional          | URL to profile picture |

### 6.2. UpdateUserProfileRequest
| Field Name    | Data Type | Required/Optional | Validation Rules |
|---------------|-----------|-------------------|------------------|
| `DisplayName` | `string`  | Required          | Not Blank, No HTML, No SQL Injection |
| `FullName`    | `string`  | Required          | Not Blank, No HTML, No SQL Injection |
| `PhoneNumber` | `string`  | Required          | Valid Phone Format |
| `AvatarUrl`   | `string`  | Optional          | No HTML, No SQL Injection |

### 6.3. BookAppointmentRequest
| Field Name        | Data Type        | Required/Optional | Validation Rules |
|-------------------|------------------|-------------------|------------------|
| `FacilityId`      | `Guid`           | Required          | Valid Guid       |
| `SpecialtyId`     | `Guid`           | Required          | Valid Guid       |
| `DoctorId`        | `Guid`           | Required          | Valid Guid       |
| `AppointmentTime` | `DateTimeOffset` | Required          | Valid UTC Date   |
| `Notes`           | `string`         | Optional          | No HTML/SQL Inj. |

---

## 7. Business Logic Notes

- **User & Patient Link**: A [Patient](file:///D:/8/PRN232/GP_BackEnd2/ms-backend-api/MSBackendAPI/MS.Domain/Entities/Patient.cs#7-38) entity is strictly tied to a [User](file:///D:/8/PRN232/GP_BackEnd2/ms-backend-api/MSBackendAPI/MS.Domain/Entities/User.cs#7-38) entity via `UserId` (1-to-1). The profile APIs (`/api/v1/users/profile`) fetch and update data directly on the [User](file:///D:/8/PRN232/GP_BackEnd2/ms-backend-api/MSBackendAPI/MS.Domain/Entities/User.cs#7-38) entity (and propagate to [Patient](file:///D:/8/PRN232/GP_BackEnd2/ms-backend-api/MSBackendAPI/MS.Domain/Entities/Patient.cs#7-38) if needed depending on backend mapping logic) because base accounts govern logins and identity.
- **Token Identity**: The backend relies **exclusively** on the token claims to identify the user (`User.FindFirst(ClaimTypes.NameIdentifier)`). You do **not** pass `userId` or `patientId` in the request body for profile updates or fetching "my appointments". It guarantees users cannot modify other users' data.
- **Validation Rules**: Strict sanitization is in place using custom attributes (`[NoHtml]`, `[NoSqlInjection]`, `[NotBlank]`, `[PhoneNumber]`). A `400 Bad Request` will be thrown with standardized `App_Message_*` codes if validation fails.

---

## 8. Frontend Integration Guide (VERY IMPORTANT)

### 🔑 Authentication Header
Every request to the APIs above MUST include the following HTTP Header:
```http
Authorization: Bearer YOUR.JWT.TOKEN
```

### 🚨 Common Mistakes to Avoid:
1. **Missing Token**: Will result in a `401 Unauthorized` status.
2. **Expired Token**: Also results in `401 Unauthorized`. Make sure your frontend checks for 401s and triggers a UI log-out or token refresh.
3. **Wrong Role**: Reaching a patient endpoint (e.g., booking an appointment) with a non-Patient account (like a Doctor account) will yield a `403 Forbidden`.
4. **Sending IDs in Body when updating Profile**: The backend reads the User's ID directly from the JWT Token. Avoid passing `Id` in the JSON body when using PUT `/api/v1/users/profile`.
5. **Invalid Payload Data**: Passing HTML tags `<script>` or SQL expressions like `' OR 1=1` in the `Notes` or `FullName` fields will trigger custom validation logic and reject the request (`400 Bad Request`).

---
### 🔑 Change Password Flow

1. User enters:
   - Current password
   - New password

2. Call:
   POST /api/v1/ChangePassword

3. If success:
   - Show success message
   - Logout user or refresh authentication

4. If fail:
   - Show error message:
     + Wrong current password
     + Validation error

## 9. Example Flow

### Step 1: Login
- Send credentials to the Auth endpoint (e.g., `/api/v1/auth/login`).
- Save the returned `token` into `localStorage` or `sessionStorage` (or an HttpOnly Cookie).

### Step 2: Get Patient Profile
- When the dashboard loads, fetch the user data.
- `GET /api/v1/users/profile` (Attach `Authorization: Bearer <token>`).
- Use the returned `DisplayName` and `AvatarUrl` to populate the top navigation bar.

### Step 3: Update Patient Profile
- User navigates to Settings and changes their phone number.
- `PUT /api/v1/users/profile` with body:
  `{ "displayName": "John", "fullName": "John Doe", "phoneNumber": "1231231234", "avatarUrl": null }`
- On success (200 OK), update the frontend Global State / Context to reflect the new info.

### Step 4: Book Appointment
- User finds a doctor via `GET /api/v1/patient/doctors`.
- User executes `POST /api/v1/patient/appointments` with the selected `doctorId`, `facilityId`, `specialtyId`, and time.
- Backend extracts user ID from the token and links the appointment exactly to this patient.
