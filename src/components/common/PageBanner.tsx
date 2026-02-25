"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

// Icons
function PhoneIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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

function DoctorIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );
}

export interface PageBannerProps {
    /** Banner title displayed on the overlay */
    title: string;
    /** Background image URL */
    imageUrl: string;
    /** Phone number for the call hotline button */
    phoneNumber?: string;
    /** Custom URL for booking button (default: /{locale}/booking) */
    bookingUrl?: string;
    /** Custom URL for find doctor button (default: /{locale}/doctors) */
    findDoctorUrl?: string;
    /** Hide the action bar (call, booking, find doctor buttons) */
    hideActionBar?: boolean;
    /** Active button to highlight - useful for current page */
    activeButton?: "call" | "booking" | "doctor";
}

const VINMEC_BASE_URL = "https://www.vinmec.com";
const DEFAULT_BANNER_IMAGE = `${VINMEC_BASE_URL}/static/uploads/cover_list_doctor_f60bffe168.jpg`;
const DEFAULT_PHONE = "1900232389";

export function PageBanner({
    title,
    imageUrl = DEFAULT_BANNER_IMAGE,
    phoneNumber = DEFAULT_PHONE,
    bookingUrl,
    findDoctorUrl,
    hideActionBar = false,
    activeButton,
}: PageBannerProps) {
    const { locale } = useParams<{ locale: string }>();
    const t = useTranslations("common");
    
    const resolvedBookingUrl = bookingUrl || `/${locale}/booking`;
    const resolvedFindDoctorUrl = findDoctorUrl || `/${locale}/doctors`;

    return (
        <div className="relative w-full overflow-hidden">
            {/* Category name overlay */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center py-6 md:py-10 pointer-events-none">
                <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-white uppercase tracking-wider drop-shadow-lg text-center px-4">
                    {title}
                </h1>
            </div>

            {/* Background image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={imageUrl}
                alt={title}
                className="w-full h-50 md:h-70 lg:h-87.5 object-cover"
            />

            {/* Action bar - bar_util (Vinmec style) */}
            {!hideActionBar && (
                <div className="hidden md:flex">
                    <a
                        href={`tel:${phoneNumber}`}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 md:py-4 text-white no-underline transition-colors cursor-pointer ${
                            activeButton === "call"
                                ? "bg-[#005a94]"
                                : "bg-[#0076c0] hover:bg-[#005a94]"
                        }`}
                    >
                        <PhoneIcon />
                        <span className="text-sm md:text-base font-medium">
                            {t("callHotline")}
                        </span>
                    </a>

                    <Link
                        href={resolvedBookingUrl}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 md:py-4 text-white no-underline transition-colors cursor-pointer ${
                            activeButton === "booking"
                                ? "bg-[#e09515]"
                                : "bg-[#f5a623] hover:bg-[#e09515]"
                        }`}
                    >
                        <CalendarIcon />
                        <span className="text-sm md:text-base font-medium">
                            {t("bookAppointment")}
                        </span>
                    </Link>

                    <Link
                        href={resolvedFindDoctorUrl}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 md:py-4 text-white no-underline transition-colors cursor-pointer ${
                            activeButton === "doctor"
                                ? "bg-[#45a88a]"
                                : "bg-[#51be9d] hover:bg-[#45a88a]"
                        }`}
                    >
                        <DoctorIcon />
                        <span className="text-sm md:text-base font-medium">
                            {t("findDoctor")}
                        </span>
                    </Link>
                </div>
            )}
        </div>
    );
}
