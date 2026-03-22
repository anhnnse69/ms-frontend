"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { authApi } from "@/services/api/authApi";
import type {
    backendApiResponse,
    forgotPasswordRequestDto,
    forgotPasswordResponseDto,
    verifyOtpRequestDto,
    verifyOtpResponseDto,
} from "@/types/auth";

export default function ForgotPasswordPage() {
    const t = useTranslations("common");
    const { locale } = useParams<{ locale: string }>();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
    const [error, setError] = useState<string | null>(null);
    const [otp, setOtp] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const payload: forgotPasswordRequestDto = { Email: email };
            const response: backendApiResponse<forgotPasswordResponseDto> = await authApi.forgotPassword(payload);
            const codeMessage = response.codeMessage ?? response.CodeMessage;

            if (codeMessage && codeMessage.startsWith("APP_MESSAGE_5")) {
                // Any 5xxx message code treat as server error
                try {
                    setError(t(`messages.${codeMessage}` as any));
                } catch {
                    setError(t("forgotPasswordError"));
                }
            } else {
                setStep(2);
            }
        } catch (err: any) {
            const codeMessage = (err?.response?.data?.codeMessage ?? err?.response?.data?.CodeMessage) as
                | string
                | undefined;
            if (codeMessage) {
                try {
                    setError(t(`messages.${codeMessage}` as any));
                } catch {
                    setError(t("forgotPasswordError"));
                }
            } else {
                setError(t("forgotPasswordError"));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const payload: verifyOtpRequestDto = { OtpCode: otp };
            const response: backendApiResponse<verifyOtpResponseDto> = await authApi.verifyOtp(payload);
            const codeMessage = response.codeMessage ?? response.CodeMessage;

            if (codeMessage && codeMessage.startsWith("APP_MESSAGE_5")) {
                try {
                    setError(t(`messages.${codeMessage}` as any));
                } catch {
                    setError(t("forgotPasswordError"));
                }
                return;
            }

            const inner = (response.data ?? (response as any).Data) as verifyOtpResponseDto | null;
            const token = inner?.resetToken ?? inner?.ResetToken;

            if (token) {
                if (typeof window !== "undefined") {
                    sessionStorage.setItem("resetToken", token);
                }
                router.push(`/${locale}/reset-password`);
            } else {
                setError(t("forgotPasswordError"));
            }
        } catch (err: any) {
            const codeMessage = (err?.response?.data?.codeMessage ?? err?.response?.data?.CodeMessage) as
                | string
                | undefined;
            if (codeMessage) {
                try {
                    setError(t(`messages.${codeMessage}` as any));
                } catch {
                    setError(t("forgotPasswordError"));
                }
            } else {
                setError(t("forgotPasswordError"));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        {t("forgotPasswordTitle")}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {t("forgotPasswordDesc")}
                    </p>
                </div>
                {step === 1 ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                {t("email")}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#0076c0] hover:bg-[#005a91] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0076c0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    t("sendResetLink")
                                )}
                            </button>
                        </div>

                        <div className="text-center">
                            <Link
                                href={`/${locale}/login`}
                                className="font-medium text-[#0076c0] hover:text-[#005a91]"
                            >
                                {t("backToLogin")}
                            </Link>
                        </div>
                    </form>
                ) : (
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
                                    <p className="text-sm font-medium text-green-800">
                                        {t("resetLinkSent")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form className="space-y-6" onSubmit={handleVerifyOtp}>
                            {error && (
                                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                    {t("otpCode")}
                                </label>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    maxLength={6}
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm tracking-widest text-center"
                                    placeholder="123456"
                                />
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
                                        t("verifyOtp")
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="text-center">
                            <Link
                                href={`/${locale}/login`}
                                className="font-medium text-[#0076c0] hover:text-[#005a91]"
                            >
                                {t("backToLogin")}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
