"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { authApi } from "@/services/api/authApi";
import type { backendApiResponse, loginRequestDto, loginResponseDto } from "@/types/auth";
import type { CurrentUser } from "@/types/admin";

function EyeIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    );
}

export default function LoginPage() {
    const t = useTranslations("common");
    const { locale } = useParams<{ locale: string }>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const redirectByRole = () => {
        if (typeof window === "undefined") return;
        const raw = localStorage.getItem("user");
        if (!raw) {
            router.push(`/${locale}`);
            return;
        }
        let user: CurrentUser | null = null;
        try {
            user = JSON.parse(raw) as CurrentUser;
        } catch {
            router.push(`/${locale}`);
            return;
        }

        const role = (user?.role || "").toString().trim().toLowerCase();

        switch (role) {
            case "itadmin":
                router.push(`/${locale}/admin`);
                break;
            case "manager":
                router.push(`/${locale}/manager`);
                break;
            case "doctor":
                router.push(`/${locale}/doctor`);
                break;
            case "patient":
            default:
                router.push(`/${locale}`);
                break;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const payload: loginRequestDto = {
                EmailAddress: email,
                Password: password,
            };

            const response: backendApiResponse<loginResponseDto> = await authApi.login(payload);
            const codeMessage = response.codeMessage ?? response.CodeMessage;

            if (codeMessage === "APP_MESSAGE_4016") {
                setError(t("messages.APP_MESSAGE_4016"));
                return;
            }

            setSuccess(t("loginSuccess"));
            redirectByRole();
        } catch (err: any) {
            const codeMessage = (err?.response?.data?.codeMessage ?? err?.response?.data?.CodeMessage) as
                | string
                | undefined;
            if (codeMessage) {
                try {
                    setError(t(`messages.${codeMessage}` as any));
                } catch {
                    setError(t("loginError"));
                }
            } else {
                setError(t("loginError"));
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
                        {t("loginTitle")}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {t("noAccount")}{" "}
                        <Link
                            href={`/${locale}/register`}
                            className="font-medium text-[#0076c0] hover:text-[#005a91]"
                        >
                            {t("register")}
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}
                    <div className="space-y-4">
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
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                {t("password")}
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-[#0076c0] focus:ring-[#0076c0] border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                {t("rememberMe")}
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link
                                href={`/${locale}/forgot-password`}
                                className="font-medium text-[#0076c0] hover:text-[#005a91]"
                            >
                                {t("forgotPassword")}
                            </Link>
                        </div>
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
                                t("login")
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
