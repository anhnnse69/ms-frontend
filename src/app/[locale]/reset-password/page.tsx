"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authApi } from "@/services/api/authApi";
import type { backendApiResponse, resetPasswordRequestDto, resetPasswordResponseDto } from "@/types/auth";

export default function ResetPasswordPage() {
    const t = useTranslations("common");
    const { locale } = useParams<{ locale: string }>();
    const router = useRouter();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [hasToken, setHasToken] = useState(true);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const token = sessionStorage.getItem("resetToken");
        if (!token) {
            setHasToken(false);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError(t("passwordsDoNotMatch"));
            return;
        }

        if (typeof window === "undefined") return;

        const token = sessionStorage.getItem("resetToken");
        if (!token) {
            setHasToken(false);
            setError(t("resetPasswordError"));
            return;
        }

        setIsLoading(true);

        try {
            const payload: resetPasswordRequestDto = {
                ResetToken: token,
                NewPassword: newPassword,
                ConfirmPassword: confirmPassword,
            };
            const response: backendApiResponse<resetPasswordResponseDto> = await authApi.resetPassword(payload);
            const codeMessage = response.codeMessage ?? response.CodeMessage;

            if (codeMessage && codeMessage.startsWith("APP_MESSAGE_5")) {
                try {
                    setError(t(`messages.${codeMessage}` as any));
                } catch {
                    setError(t("resetPasswordError"));
                }
            } else {
                setSuccess(true);
                sessionStorage.removeItem("resetToken");
            }
        } catch (err: any) {
            const codeMessage = (err?.response?.data?.codeMessage ?? err?.response?.data?.CodeMessage) as
                | string
                | undefined;
            if (codeMessage) {
                try {
                    setError(t(`messages.${codeMessage}` as any));
                } catch {
                    setError(t("resetPasswordError"));
                }
            } else {
                setError(t("resetPasswordError"));
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!hasToken && !success) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">{t("resetPasswordTitle")}</h2>
                    <p className="mt-2 text-sm text-gray-600">{t("resetPasswordInvalidOrExpired")}</p>
                    <div className="mt-6">
                        <Link
                            href={`/${locale}/forgot-password`}
                            className="font-medium text-[#0076c0] hover:text-[#005a91]"
                        >
                            {t("forgotPasswordTitle")}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">{t("resetPasswordTitle")}</h2>
                    <p className="mt-2 text-sm text-gray-600">{t("resetPasswordDesc")}</p>
                </div>

                {success ? (
                    <div className="mt-8 space-y-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">{t("resetPasswordSuccess")}</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => router.push(`/${locale}/login`)}
                                className="font-medium text-[#0076c0] hover:text-[#005a91]"
                            >
                                {t("backToLogin")}
                            </button>
                        </div>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                {t("newPassword")}
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    aria-label={showNewPassword ? "Hide password" : "Show password"}
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
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                {t("confirmPassword")}
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? (
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
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#0076c0] hover:bg-[#005a91] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0076c0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                ) : (
                                    t("resetPasswordButton")
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
