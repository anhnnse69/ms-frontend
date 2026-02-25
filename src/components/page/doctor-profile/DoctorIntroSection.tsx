"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// Mock doctor data
const getMockDoctorIntro = (id: string) => ({
    id,
    introduction: `PGS.TS. Hoàng Đăng Mịch là chuyên gia Nội tiết với nhiều năm kinh nghiệm. Ông được phong học hàm Phó Giáo sư năm 2010, từng là Ủy viên Ban chấp hành Hội Nội tiết và Đái tháo đường Việt Nam, đồng thời là Chủ tịch Hội Nội tiết - Đái tháo đường Hải Phòng.

Trước khi gia nhập Vinmec, PGS.TS. Hoàng Đăng Mịch từng đảm nhiệm nhiều vị trí quan trọng tại Bệnh viện Việt Tiệp Hải Phòng: Giám đốc Bệnh viện, Phó Giám đốc chuyên môn, Giám đốc Trung tâm Can thiệp tim mạch, Trưởng khoa Quốc tế, Trưởng khoa Thận - Nội tiết - Đái tháo đường. Với hơn 40 công trình nghiên cứu và bảo cáo chuyên ngành được công bố, ông là một trong những chuyên gia hàng đầu trong lĩnh vực Nội khoa.`,
    services: [
        "Khám, tư vấn và điều trị bệnh Nội tiết - Đái tháo đường - Rối loạn chuyển hóa",
        "Điều trị hội chứng thận hư, viêm cầu thận cấp và mạn tính, các bệnh thận khác",
        "Quản lý và điều trị bệnh viêm gan virus B, C, bệnh gan do rượu",
        "Điều trị bệnh viêm loét dạ dày - tá tràng",
        "Chẩn đoán và điều trị lupus ban đỏ hệ thống và các bệnh tự miễn khác",
    ],
    ratings: {
        overall: 4.8,
        appearance: 4.8,
        attitude: 4.9,
        expertise: 4.8,
    },
    reviewStats: {
        5: 91,
        4: 19,
        3: 1,
        2: 0,
        1: 0,
    },
});

interface DoctorIntroSectionProps {
    doctorId: string;
    locale: string;
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

function InfoIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function RatingBar({ value, max = 5 }: { value: number; max?: number }) {
    const percentage = (value / max) * 100;
    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#0076c0] rounded-full"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="text-sm font-semibold text-gray-700 w-8">{value}</span>
        </div>
    );
}

function ReviewStatsBar({ stars, count, maxCount }: { stars: number; count: number; maxCount: number }) {
    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
    return (
        <div className="flex items-center gap-3 text-sm">
            <span className="w-4 text-[#0076c0] font-medium">{stars}★</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#0076c0] rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="text-gray-600 w-24">{count} đánh giá</span>
        </div>
    );
}

export function DoctorIntroSection({ doctorId, locale }: DoctorIntroSectionProps) {
    const t = useTranslations("doctorProfile");
    const doctor = getMockDoctorIntro(doctorId);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        intro: true,
        services: true,
        rating: true,
        stats: true,
    });

    const toggleSection = (section: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const maxReviewCount = Math.max(...Object.values(doctor.reviewStats));

    return (
        <div className="space-y-4">
            {/* Introduction Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <button
                    onClick={() => toggleSection("intro")}
                    className="w-full flex items-center justify-between p-4 text-left"
                >
                    <h2 className="text-lg font-bold text-[#0076c0]">{t("sections.introduction")}</h2>
                    <ChevronIcon expanded={expandedSections.intro} />
                </button>
                {expandedSections.intro && (
                    <div className="px-4 pb-4">
                        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                            {doctor.introduction}
                        </div>
                    </div>
                )}
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <button
                    onClick={() => toggleSection("services")}
                    className="w-full flex items-center justify-between p-4 text-left"
                >
                    <h2 className="text-lg font-bold text-[#0076c0]">{t("sections.services")}</h2>
                    <ChevronIcon expanded={expandedSections.services} />
                </button>
                {expandedSections.services && (
                    <div className="px-4 pb-4">
                        <ul className="space-y-2">
                            {doctor.services.map((service, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                    <span className="text-[#0076c0] mt-1">•</span>
                                    <span>{service}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Overall Rating Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <button
                    onClick={() => toggleSection("rating")}
                    className="w-full flex items-center justify-between p-4 text-left"
                >
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-[#0076c0]">{t("sections.overallRating")}</h2>
                        <InfoIcon />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    className={`w-4 h-4 ${star <= Math.round(doctor.ratings.overall) ? "text-yellow-400" : "text-gray-300"}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="font-semibold">{doctor.ratings.overall} {t("rating.outOf5")}</span>
                        <ChevronIcon expanded={expandedSections.rating} />
                    </div>
                </button>
                {expandedSections.rating && (
                    <div className="px-4 pb-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{t("rating.appearance")}</span>
                            <div className="w-48">
                                <RatingBar value={doctor.ratings.appearance} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{t("rating.attitude")}</span>
                            <div className="w-48">
                                <RatingBar value={doctor.ratings.attitude} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{t("rating.expertise")}</span>
                            <div className="w-48">
                                <RatingBar value={doctor.ratings.expertise} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Review Statistics Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <button
                    onClick={() => toggleSection("stats")}
                    className="w-full flex items-center justify-between p-4 text-left"
                >
                    <h2 className="text-lg font-bold text-[#0076c0]">{t("sections.reviewStats")}</h2>
                    <ChevronIcon expanded={expandedSections.stats} />
                </button>
                {expandedSections.stats && (
                    <div className="px-4 pb-4 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                            <ReviewStatsBar
                                key={stars}
                                stars={stars}
                                count={doctor.reviewStats[stars as keyof typeof doctor.reviewStats]}
                                maxCount={maxReviewCount}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
