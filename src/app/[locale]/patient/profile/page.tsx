/**
 * Example: Patient Profile Page Component
 * 
 * PRODUCTION-READY EXAMPLE showing:
 * - Fetching profile data
 * - Form management for profile updates
 * - Error handling
 * - Loading states
 * - Success feedback
 * - TypeScript strict mode
 */

'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePatientProfile } from '@/hooks/usePatientProfile';
import { useUpdatePatientProfile } from '@/hooks/useUpdatePatientProfile';
import { useChangePassword } from '@/hooks/useChangePassword';
import { useAuth } from '@/hooks/useAuth';
import { UpdateUserProfileRequest, UserProfile } from '@/types/patient';
import { changePasswordRequestDto } from '@/types/auth';
import { Alert } from '@/components/common/Alert';
import { useTranslations } from 'next-intl';

/**
 * Patient Profile Page Component
 * Page URL: /patient/profile (or /[locale]/patient/profile)
 */
export default function PatientProfilePage() {
  const tAuth = useTranslations('patient.auth');
  const tProfile = useTranslations('patient.profile');
  // Fetch current profile
  const { profile, loading, error, refetch, isAuthenticated } = usePatientProfile();
  const { logout } = useAuth();
  const router = useRouter();

  // Handle profile updates
  const { updateProfile, loading: updating, error: updateError, success } =
    useUpdatePatientProfile({
      onSuccess: () => {
        // Refetch profile after successful update
        refetch();
        setGlobalMessage(tProfile('updateSuccess'));
        setGlobalMessageType('success');
      },
      onError: (error) => {
        setGlobalMessage(error.message);
        setGlobalMessageType('error');
      },
    });

  // Handle password change
  const { changePassword: changePasswordFn, loading: changingPassword, error: passwordError, success: passwordSuccess, clearError: clearPasswordError, clearSuccess: clearPasswordSuccess } =
    useChangePassword({
      onSuccess: () => {
        setGlobalMessage(tProfile('passwordChangeSuccess'));
        setGlobalMessageType('success');
        setPasswordForm({
          CurrentPassword: '',
          NewPassword: '',
        });
      },
      onError: (error) => {
        setGlobalMessage(error.message);
        setGlobalMessageType('error');
      },
    });

  // Form state - sync with profile data
  const [formData, setFormData] = useState<UpdateUserProfileRequest>({
    displayName: '',
    fullName: '',
    phoneNumber: '',
    avatarUrl: '',
  });

  // Password change form state
  const [passwordForm, setPasswordForm] = useState<changePasswordRequestDto>({
    CurrentPassword: '',
    NewPassword: '',
  });

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Global UI message for this page
  const [globalMessage, setGlobalMessage] = useState<string | null>(null);
  const [globalMessageType, setGlobalMessageType] = useState<'success' | 'error' | 'info'>('info');

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName,
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
        avatarUrl: profile.avatarUrl || '',
      });
    }
  }, [profile]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form data
    if (!formData.displayName.trim()) {
      setGlobalMessage(tProfile('displayNameRequired'));
      setGlobalMessageType('error');
      return;
    }
    if (!formData.fullName.trim()) {
      setGlobalMessage(tProfile('fullNameRequired'));
      setGlobalMessageType('error');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setGlobalMessage(tProfile('phoneRequired'));
      setGlobalMessageType('error');
      return;
    }

    // Phone number validation (basic)
    if (!/^\d{10,15}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      setGlobalMessage(tProfile('phoneInvalid'));
      setGlobalMessageType('error');
      return;
    }

    // Submit update
    await updateProfile(formData);
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous messages
    clearPasswordError();
    clearPasswordSuccess();

    // Submit password change
    await changePasswordFn(passwordForm);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{tProfile('loading')}</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{tAuth('requiredTitle')}</h1>
          <p className="text-gray-600 mb-6">{tAuth('profileMessage')}</p>
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {tAuth('goToLogin')}
          </a>
        </div>
      </div>
    );
  }

  // Error loading profile
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{tProfile('errorTitle')}</h1>
          <p className="text-red-600 mb-6">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {tProfile('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  // Profile loaded - render form
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {globalMessage && (
          <div className="mb-6">
            <Alert variant={globalMessageType}>{globalMessage}</Alert>
          </div>
        )}
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{tProfile('title')}</h1>
          <p className="mt-2 text-gray-600">{tProfile('subtitle')}</p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-8 space-y-6">
          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {tProfile('emailLabel')}
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Read-only field</p>
          </div>

          {/* Display Name (editable) */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
              {tProfile('displayNameLabel') ?? 'Display Name *'}
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              disabled={updating}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="e.g., John D."
              required
            />
          </div>

          {/* Full Name (editable) */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              {tProfile('fullNameLabel')}
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={updating}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="e.g., John Doe"
              required
            />
          </div>

          {/* Phone Number (editable) */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              {tProfile('phoneLabel')}
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={updating}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="e.g., 1234567890"
              required
            />
            <p className="mt-1 text-xs text-gray-500">10-15 digits required</p>
          </div>

          {/* Avatar URL (editable) */}
          <div>
            <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-1">
              {tProfile('avatarUrlLabel')}
            </label>
            <input
              type="url"
              id="avatarUrl"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleInputChange}
              disabled={updating}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder={tProfile('avatarPlaceholder')}
            />
            <p className="mt-1 text-xs text-gray-500">{tProfile('avatarHelp')}</p>
          </div>

          {/* Avatar Preview */}
          {formData.avatarUrl && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">{tProfile('avatarPreview')}</p>
              <img
                src={formData.avatarUrl}
                alt="Avatar preview"
                className="w-20 h-20 rounded-full object-cover border border-gray-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <p className="mt-2 text-xs text-gray-500">{tProfile('avatarError')}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={updating}
              className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {updating ? tProfile('saving') : tProfile('save')}
            </button>
            <button
              type="button"
              onClick={() => {
                if (profile) {
                  setFormData({
                    displayName: profile.displayName,
                    fullName: profile.fullName,
                    phoneNumber: profile.phoneNumber,
                    avatarUrl: profile.avatarUrl || '',
                  });
                }
              }}
              disabled={updating}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition disabled:cursor-not-allowed font-medium"
            >
              {tProfile('discard')}
            </button>
          </div>
        </form>

        {/* Password Change Form */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{tProfile('passwordSectionTitle')}</h2>
          <form onSubmit={handlePasswordSubmit} className="bg-white shadow rounded-lg p-8 space-y-6">
            {/* Success notification */}
            {passwordSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700">{tProfile('passwordChangeSuccess')}</p>
              </div>
            )}

            {/* Error notification */}
            {passwordError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{passwordError.message}</p>
              </div>
            )}

            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {tProfile('currentPasswordLabel')}
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  name="CurrentPassword"
                  value={passwordForm.CurrentPassword}
                  onChange={handlePasswordChange}
                  disabled={changingPassword}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Enter your current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label={showCurrentPassword ? tProfile('passwordHide') : tProfile('passwordShow')}
                >
                  {showCurrentPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-6.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">{tProfile('currentPasswordHelp')}</p>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {tProfile('newPasswordLabel')}
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="NewPassword"
                  value={passwordForm.NewPassword}
                  onChange={handlePasswordChange}
                  disabled={changingPassword}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label={showNewPassword ? tProfile('passwordHide') : tProfile('passwordShow')}
                >
                  {showNewPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-6.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">{tProfile('newPasswordHelp')}</p>
            </div>

            {/* Form Actions */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={changingPassword}
                className="w-full bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {changingPassword ? tProfile('passwordSubmitting') : tProfile('passwordSubmit')}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">{tProfile('aboutTitle')}</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>{tProfile('aboutItem1')}</li>
            <li>{tProfile('aboutItem2')}</li>
            <li>{tProfile('aboutItem3')}</li>
            <li>{tProfile('aboutItem4')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Legacy showNotification helper removed in favor of Alert-based UI messaging
