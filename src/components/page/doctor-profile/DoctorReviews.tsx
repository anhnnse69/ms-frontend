"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// Mock reviews data
const getMockReviews = (doctorId: string) => ({
    doctorId,
    totalReviews: 111,
    reviews: [
        { id: 1, rating: 5, date: "12-11-2025", comment: "" },
        { id: 2, rating: 5, date: "18-10-2025", comment: "" },
        { id: 3, rating: 5, date: "08-10-2025", comment: "" },
        { id: 4, rating: 5, date: "04-10-2025", comment: "" },
        { id: 5, rating: 5, date: "28-09-2025", comment: "" },
    ],
});

interface DoctorReviewsProps {
    doctorId: string;
    locale: string;
}

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

function ChevronIcon({ expanded }: { expanded: boolean }) {
    return (
        <svg
            className={`w-5 h-5 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );
}

function ArrowRightIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
    );
}

export function DoctorReviews({ doctorId, locale }: DoctorReviewsProps) {
    const t = useTranslations("doctorProfile");
    const data = getMockReviews(doctorId);
    const [expanded, setExpanded] = useState(true);
    const [visibleReviews, setVisibleReviews] = useState(5);

    const handleViewMore = () => {
        setVisibleReviews((prev) => prev + 5);
    };

    return (
        <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-100">
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-4 text-left border-b border-gray-100"
            >
                <h2 className="text-lg font-bold text-[#0076c0]">
                    {t("sections.reviews")} ({data.totalReviews})
                </h2>
                <ChevronIcon expanded={expanded} />
            </button>

            {/* Reviews List */}
            {expanded && (
                <div className="divide-y divide-gray-100">
                    {data.reviews.slice(0, visibleReviews).map((review) => (
                        <div key={review.id} className="p-4">
                            <div className="flex items-center justify-between">
                                <StarRating rating={review.rating} />
                                <span className="text-sm text-gray-500">
                                    {t("reviews.date")}: {review.date}
                                </span>
                            </div>
                            {review.comment && (
                                <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
                            )}
                        </div>
                    ))}

                    {/* View More Button */}
                    {visibleReviews < data.totalReviews && (
                        <div className="p-4">
                            <button
                                onClick={handleViewMore}
                                className="flex items-center gap-2 text-[#0076c0] hover:text-[#005a94] font-medium text-sm transition-colors"
                            >
                                <span>{t("reviews.viewMore")}</span>
                                <ArrowRightIcon />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
