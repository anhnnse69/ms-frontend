"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useDoctorDetail } from "@/hooks/useDoctorDetail";

interface DoctorInfoSidebarProps {
    doctorId: string;
    locale: string;
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
    return (
        <svg
            className={`w-5 h-5 text-white transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );
}

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
}

function CollapsibleSection({ title, children, defaultExpanded = true }: CollapsibleSectionProps) {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-3 bg-[#0076c0] text-white text-left"
            >
                <h3 className="font-semibold text-sm">{title}</h3>
                <ChevronIcon expanded={expanded} />
            </button>
            {expanded && (
                <div className="p-4 bg-white">
                    {children}
                </div>
            )}
        </div>
    );
}

export function DoctorInfoSidebar({ doctorId, locale }: DoctorInfoSidebarProps) {
    const t = useTranslations("doctorProfile");
    const { doctor, isLoading, error } = useDoctorDetail(doctorId);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg h-40 bg-gray-50 animate-pulse" />
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <p className="text-sm text-red-500">
                        {error || t("errors.doctorNotFound", { defaultValue: "Doctor information not available." })}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Specialty */}
            <CollapsibleSection title={t("sidebar.specialty")}>
                <p className="text-sm text-gray-700">{doctor.specialty}</p>
            </CollapsibleSection>

            {/* Workplace / Facility */}
            <CollapsibleSection title={t("sidebar.workplace")}>
                <p className="text-sm text-gray-700">{doctor.facility}</p>
            </CollapsibleSection>

            {/* Experience */}
            <CollapsibleSection title={t("sidebar.experience")}>
                <p className="text-sm text-gray-700">
                    {doctor.experience ? `${doctor.experience} ${locale === "vi" ? "năm kinh nghiệm" : "years of experience"}` :
                        t("sidebar.experienceEmpty", { defaultValue: "Information is being updated." })}
                </p>
            </CollapsibleSection>

            {/* License */}
            {doctor.license && (
                <CollapsibleSection title={t("sidebar.position")}>
                    <p className="text-sm text-gray-700">{doctor.license}</p>
                </CollapsibleSection>
            )}
        </div>
    );
}
