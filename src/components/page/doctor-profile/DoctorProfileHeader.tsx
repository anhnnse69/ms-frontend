"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/common/Breadcrumb";

const VINMEC_BASE_URL = "https://www.vinmec.com";

// Mock doctor data - will be replaced with API call
const getMockDoctor = (id: string) => ({
    id,
    name: "Hoàng Đăng Mịch",
    degree: "Giáo sư, Tiến sĩ, Bác sĩ",
    imageUrl: `${VINMEC_BASE_URL}/static/uploads/small_bac_si_hoang_dang_mich_vinmec_03f2edc4fd.jpg`,
    rating: 4.8,
    reviewCount: 111,
});

interface DoctorProfileHeaderProps {
    doctorId: string;
    locale: string;
}

function StarIcon({ filled }: { filled: boolean }) {
    return (
        <svg
            className={`w-4 h-4 ${filled ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
        >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
}

export function DoctorProfileHeader({ doctorId, locale }: DoctorProfileHeaderProps) {
    const t = useTranslations("doctorProfile");
    const doctor = getMockDoctor(doctorId);
    const bookingUrl = `/${locale}/booking?doctor=${doctorId}`;

    const breadcrumbItems = [
        { label: t("breadcrumb.home"), href: "/" },
        { label: t("breadcrumb.doctors"), href: "/doctors" },
        { label: `${doctor.degree}, ${doctor.name}` },
    ];

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-277.5 mx-auto px-4">
                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbItems} />

                {/* Doctor Card */}
                <div className="flex flex-col md:flex-row gap-6 py-6">
                    {/* Doctor Image */}
                    <div className="shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={doctor.imageUrl}
                            alt={doctor.name}
                            className="w-40 h-52 md:w-48 md:h-64 object-cover rounded-lg shadow-md"
                        />
                    </div>

                    {/* Doctor Info */}
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">{doctor.degree}</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-[#0076c0] mb-3">
                            {doctor.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon key={star} filled={star <= Math.round(doctor.rating)} />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">
                                <span className="font-semibold">{doctor.rating}</span> {t("rating.outOf5")}
                            </span>
                        </div>

                        <p className="text-sm text-gray-500 mb-4">
                            (+{doctor.reviewCount} {t("rating.reviews")})
                        </p>

                        {/* Booking Button */}
                        <Link
                            href={bookingUrl}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00a651] hover:bg-[#008f46] text-white font-medium rounded-lg transition-colors"
                        >
                            <CalendarIcon />
                            <span>{t("bookAppointment")}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
