"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function MomoReturnPage() {
    const searchParams = useSearchParams();
    const { locale } = useParams<{ locale: string }>();
    const router = useRouter();

    const t = useTranslations("patient.payment");

    const resultCode = searchParams.get("resultCode");
    const message = searchParams.get("message");
    const amount = searchParams.get("amount");

    const isSuccess = resultCode === "0";

    const handleGoToAppointments = () => {
        router.push(`/${locale}/patient/appointments`);
    };

    const handleGoHome = () => {
        router.push(`/${locale}`);
    };

    const formattedAmount = amount
        ? new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(Number(amount))
        : null;

    const displayMessage = message
        ? decodeURIComponent(message)
        : isSuccess
            ? "Hệ thống đã ghi nhận thanh toán đặt cọc cho lịch hẹn của bạn."
            : "Đã có lỗi xảy ra trong quá trình thanh toán.";

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
            <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-blue-50">
                <div className="flex flex-col items-center mb-6">
                    <div
                        className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 ${isSuccess
                                ? "border-green-100 bg-green-50 text-green-600"
                                : "border-red-100 bg-red-50 text-red-600"
                            }`}
                    >
                        <span className="text-3xl">{isSuccess ? "✓" : "!"}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 text-center">
                        {isSuccess ? t("momoSuccessTitle") : t("momoFailureTitle")}
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 text-center max-w-md">
                        {displayMessage}
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm space-y-2 mb-6">
                    {formattedAmount && (
                        <p className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">{t("momoAmountLabel")}</span>
                            <span className="text-gray-900 font-semibold">{formattedAmount}</span>
                        </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        {t("momoAmountNote")}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={handleGoToAppointments}
                        className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
                    >
                        {t("momoViewAppointments")}
                    </button>
                    <button
                        onClick={handleGoHome}
                        className="flex-1 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                        {t("momoGoHome")}
                    </button>
                </div>
            </div>
        </div>
    );
}
