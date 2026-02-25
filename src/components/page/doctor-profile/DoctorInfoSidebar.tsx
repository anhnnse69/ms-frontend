"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// Mock doctor data
const getMockDoctorInfo = (id: string) => ({
    id,
    position: "Bác sĩ Nội Khoa",
    specialty: "Nội tiết",
    workplaces: [
        "Khoa Khám bệnh & Nội khoa, Bệnh viện Đa khoa Vinmec Hải Phòng",
        "Phòng khám Đa khoa Quốc tế Vinmec Royal Island",
        "Bệnh viện Đa khoa Vinmec Hải Phòng",
    ],
    servicesProvided: [
        "Nội tiết - Đái Tháo Đường - Rối loạn chuyển hóa",
        "Hội chứng thận hư, viêm cầu thập cấp và mạn tính, các bệnh thận khác",
        "Bệnh viêm gan virus B và viêm gan virus C, bệnh gan do rượu, bệnh viêm loét da dày tá tràng, bệnh Lupus ban đỏ hệ thống và bệnh tự miễn khác",
    ],
    education: [
        { year: "1977 - 1983", detail: "Bác sĩ đa khoa - Học viện Quân y" },
        { year: "1991 - 1993", detail: "Bác sĩ chuyên khoa I - Trường Đại học Y Hà Nội" },
        { year: "1997 - 2003", detail: "Tiến sĩ Học viện Quân y" },
        { year: "2010", detail: "Học hàm Phó giáo sư" },
    ],
    experience: [
        "Giám đốc - Bệnh viện Việt Tiệp Hải Phòng",
        "Phó giám đốc chuyên môn - Bệnh viện Việt Tiệp - Hải Phòng",
        "Giám đốc Trung tâm Can thiệp tim và mạch máu - Bệnh viện Việt Tiệp - Hải Phòng",
        "Trưởng khoa Quốc tế - Bệnh viện Việt Tiệp - Hải Phòng",
        "Trưởng khoa Thận - Nội tiết - Đái tháo đường - Bệnh viện Việt Tiệp - Hải Phòng",
        "2023-2025: Cố vấn Chuyên môn khối Nội, khoa Khám bệnh & Nội khoa, Bệnh viện Đa khoa Quốc tế Vinmec Hà Long",
        "Hiện nay: Bác sĩ Nội Khoa - Bệnh viện Đa khoa Quốc tế Vinmec Hải Phòng",
    ],
    organizations: [
        "Ủy viên ban chấp hành Hội Nội tiết và Đái tháo đường Việt Nam",
        "Chủ tịch Hội Nội tiết và Đái tháo đường Hải Phòng",
    ],
    research: "Trên 40 công trình nghiên cứu và báo cáo chuyên ngành",
});

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
    const doctor = getMockDoctorInfo(doctorId);

    return (
        <div className="space-y-4">
            {/* Position */}
            <CollapsibleSection title={t("sidebar.position")}>
                <p className="text-sm text-gray-700">{doctor.position}</p>
            </CollapsibleSection>

            {/* Specialty */}
            <CollapsibleSection title={t("sidebar.specialty")}>
                <p className="text-sm text-gray-700">{doctor.specialty}</p>
            </CollapsibleSection>

            {/* Workplace */}
            <CollapsibleSection title={t("sidebar.workplace")}>
                <ul className="space-y-2">
                    {doctor.workplaces.map((workplace, index) => (
                        <li key={index} className="text-sm text-gray-700">
                            {workplace}
                        </li>
                    ))}
                </ul>
            </CollapsibleSection>

            {/* Services */}
            <CollapsibleSection title={t("sidebar.services")}>
                <ul className="space-y-2">
                    {doctor.servicesProvided.map((service, index) => (
                        <li key={index} className="text-sm text-gray-700">
                            {service}
                        </li>
                    ))}
                </ul>
            </CollapsibleSection>

            {/* Education */}
            <CollapsibleSection title={t("sidebar.education")}>
                <ul className="space-y-3">
                    {doctor.education.map((edu, index) => (
                        <li key={index} className="text-sm">
                            <span className="text-[#0076c0] font-medium">{edu.year}:</span>
                            <span className="text-gray-700 ml-1">{edu.detail}</span>
                        </li>
                    ))}
                </ul>
            </CollapsibleSection>

            {/* Work Experience */}
            <CollapsibleSection title={t("sidebar.experience")}>
                <ul className="space-y-2">
                    {doctor.experience.map((exp, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-[#0076c0] mt-1">•</span>
                            <span>{exp}</span>
                        </li>
                    ))}
                </ul>
            </CollapsibleSection>

            {/* Organizations */}
            <CollapsibleSection title={t("sidebar.organizations")}>
                <ul className="space-y-2">
                    {doctor.organizations.map((org, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-[#0076c0] mt-1">•</span>
                            <span>{org}</span>
                        </li>
                    ))}
                </ul>
            </CollapsibleSection>

            {/* Research */}
            <CollapsibleSection title={t("sidebar.research")}>
                <p className="text-sm text-gray-700">{doctor.research}</p>
            </CollapsibleSection>
        </div>
    );
}
