"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useDoctorDetail } from "@/hooks/useDoctorDetail";

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

export function DoctorIntroSection({ doctorId, locale }: DoctorIntroSectionProps) {
    const t = useTranslations("doctorProfile");
    const { doctor, isLoading, error } = useDoctorDetail(doctorId);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        intro: true,
        services: true,
    });

    const toggleSection = (section: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-40 animate-pulse" />
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <p className="text-sm text-red-500">
                        {error || t("errors.doctorNotFound", { defaultValue: "Doctor information not available." })}
                    </p>
                </div>
            </div>
        );
    }

    const introduction = doctor.about || doctor.bio || "";
    const services = doctor.qualifications || [];

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
                            {introduction || t("sections.introductionEmpty", { defaultValue: "Information is being updated." })}
                        </div>
                    </div>
                )}
            </div>

            {/* Services Section */}
            {services.length > 0 && (
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
                                {services.map((service, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-[#0076c0] mt-1">•</span>
                                        <span>{service}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
