"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

// Icons
function CalendarIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
}

function DegreeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
    );
}

function SpecialtyIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}

function HospitalIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    );
}

export interface DoctorInfo {
    id: string | number;
    name: string;
    imageUrl: string;
    profileUrl?: string;
    bookingUrl?: string;
    degree: string;
    specialty: string;
    hospital: string;
    hospitalUrl?: string;
    rating?: number;
    ratingCount?: number;
}

interface DoctorCardProps {
    doctor: DoctorInfo;
    variant?: "list" | "grid";
    showRating?: boolean;
}

// Star rating component
function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

export function DoctorCard({ doctor, variant = "list", showRating = true }: DoctorCardProps) {
    const { locale } = useParams<{ locale: string }>();
    const t = useTranslations("common");

    const bookingLabel = locale === "vi" ? "Đăng ký khám" : "Book Appointment";
    const profileUrl = doctor.profileUrl || `/${locale}/doctors/${doctor.id}`;
    const bookingUrl = doctor.bookingUrl || `/${locale}/booking?doctor=${doctor.id}`;
    const hospitalUrl = doctor.hospitalUrl || "#";

    // Grid variant (for specialty page doctors tab)
    if (variant === "grid") {
        return (
            <div className="flex p-3 border border-gray-200 rounded-lg bg-white">
                <div className="shrink-0">
                    <Link href={profileUrl} className="block no-underline w-27.5">
                        <div className="min-h-35">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                loading="lazy"
                                className="w-27.5 h-35 object-cover rounded-md"
                                src={doctor.imageUrl}
                                alt={doctor.name}
                            />
                        </div>
                    </Link>
                    <Link
                        href={bookingUrl}
                        className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#0076c0] text-white no-underline rounded text-[12px] mt-2 transition-colors hover:bg-[#005a94] w-27.5"
                    >
                        <CalendarIcon className="w-3 h-3" />
                        <span>{bookingLabel}</span>
                    </Link>
                </div>
                <div className="flex-1 min-w-0 ml-3">
                    <Link
                        href={profileUrl}
                        className="text-base font-semibold text-[#0076c0] no-underline hover:underline block"
                    >
                        {doctor.name}
                    </Link>
                    
                    {/* Rating */}
                    {showRating && doctor.rating && (
                        <div className="flex items-center gap-2 mt-1 mb-1 flex-wrap">
                            <StarRating rating={Math.round(doctor.rating)} />
                            <span className="text-[13px] text-gray-600">
                                <span className="font-bold">{doctor.rating}</span> trên 5
                            </span>
                        </div>
                    )}

                    <div className="flex items-start gap-2 text-[14px] text-[#4d4c4c] mt-1">
                        <DegreeIcon className="w-4 h-4 mt-0.5 shrink-0 text-[#0076c0]" />
                        <span>{doctor.degree}</span>
                    </div>
                    <div className="flex items-start gap-2 text-[14px] text-[#4d4c4c] mt-1">
                        <SpecialtyIcon className="w-4 h-4 mt-0.5 shrink-0 text-[#0076c0]" />
                        <span>{doctor.specialty}</span>
                    </div>
                    <div className="flex items-start gap-2 text-[14px] text-[#4d4c4c] mt-1">
                        <HospitalIcon className="w-4 h-4 mt-0.5 shrink-0 text-[#0076c0]" />
                        <Link href={hospitalUrl} className="text-[#0076c0] no-underline hover:underline">
                            {doctor.hospital}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // List variant (for main doctors page - Vinmec style)
    return (
        <li className="flex p-4 border-b border-gray-200 last:border-b-0">
            <div className="shrink-0">
                <Link href={profileUrl} className="block no-underline">
                    <div className="min-h-35">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            loading="lazy"
                            height={140}
                            className="w-27.5 h-35 object-cover rounded"
                            src={doctor.imageUrl}
                            alt={doctor.name}
                        />
                    </div>
                </Link>
                <div className="mt-2">
                    <Link
                        href={bookingUrl}
                        className="flex items-center justify-center py-2 px-3 bg-[#0076c0] text-white no-underline rounded text-[13px] font-medium transition-colors hover:bg-[#005a94] w-27.5"
                    >
                        {bookingLabel}
                    </Link>
                </div>
            </div>
            <div className="flex-1 min-w-0 ml-4">
                <div className="flex justify-between flex-col">
                    <Link
                        href={profileUrl}
                        className="text-lg font-semibold text-[#0076c0] no-underline hover:underline"
                    >
                        {doctor.name}
                    </Link>
                    
                    {/* Rating */}
                    {showRating && doctor.rating && (
                        <div className="flex items-center gap-2 mt-1 mb-1 flex-wrap">
                            <StarRating rating={Math.round(doctor.rating)} />
                            <span className="text-[13px] text-gray-600">
                                <span className="font-bold">{doctor.rating}</span> trên 5
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-start gap-2 text-[14px] text-[#4d4c4c] mt-2">
                    <DegreeIcon className="w-4 h-4 mt-0.5 shrink-0 text-[#0076c0]" />
                    <span>{doctor.degree}</span>
                </div>
                <div className="flex items-start gap-2 text-[14px] text-[#4d4c4c] mt-1">
                    <SpecialtyIcon className="w-4 h-4 mt-0.5 shrink-0 text-[#0076c0]" />
                    <span>{doctor.specialty}</span>
                </div>
                <div className="flex items-start gap-2 text-[14px] text-[#4d4c4c] mt-1">
                    <HospitalIcon className="w-4 h-4 mt-0.5 shrink-0 text-[#0076c0]" />
                    <Link href={hospitalUrl} className="text-[#0076c0] no-underline hover:underline">
                        {doctor.hospital}
                    </Link>
                </div>
            </div>
        </li>
    );
}
