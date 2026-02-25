"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/Breadcrumb";

const specialties = [
    {
        id: "emergency",
        slug: "emergency",
        name: "Cấp cứu",
        nameEn: "Emergency",
    },
    {
        id: "cardiology",
        slug: "cardiology",
        name: "Trung tâm Tim mạch",
        nameEn: "Cardiology Center",
    },
    {
        id: "oncology",
        slug: "oncology",
        name: "Trung tâm Ung bướu",
        nameEn: "Oncology Center",
    },
    {
        id: "immunology",
        slug: "immunology",
        name: "Miễn dịch - Dị ứng - Hen lâm sàng",
        nameEn: "Immunology - Allergy - Clinical Asthma",
    },
    {
        id: "gastroenterology",
        slug: "gastroenterology",
        name: "Tiêu hoá",
        nameEn: "Gastroenterology",
    },
    {
        id: "pediatrics",
        slug: "pediatrics",
        name: "Trung tâm Nhi",
        nameEn: "Pediatrics Center",
    },
    {
        id: "womens-health",
        slug: "womens-health",
        name: "Sức khỏe phụ nữ",
        nameEn: "Women's Health",
    },
    {
        id: "general-health",
        slug: "general-health",
        name: "Sức khỏe tổng quát",
        nameEn: "General Health Checkup",
    },
    {
        id: "ophthalmology",
        slug: "ophthalmology",
        name: "Trung tâm Mắt",
        nameEn: "Eye Center",
    },
    {
        id: "dental",
        slug: "dental",
        name: "Nha khoa",
        nameEn: "Dental Clinic",
    },
    {
        id: "traditional-medicine",
        slug: "traditional-medicine",
        name: "Y học cổ truyền",
        nameEn: "Traditional Medicine",
    },
    {
        id: "regenerative-medicine",
        slug: "regenerative-medicine",
        name: "Y Học Tái Tạo",
        nameEn: "Regenerative Medicine",
    },
    {
        id: "orthopedics",
        slug: "orthopedics",
        name: "Cơ xương khớp",
        nameEn: "Orthopedics",
    },
    {
        id: "stem-cell",
        slug: "stem-cell",
        name: "Viện Tế bào gốc",
        nameEn: "Stem Cell Institute",
    },
    {
        id: "vaccine",
        slug: "vaccine",
        name: "Trung tâm tiêm chủng",
        nameEn: "Vaccine Center",
    },
    {
        id: "breast-center",
        slug: "breast-center",
        name: "Trung tâm Vú",
        nameEn: "Breast Center",
    },
    {
        id: "neurology",
        slug: "neurology",
        name: "Thần kinh",
        nameEn: "Neurology",
    },
    {
        id: "mental-health",
        slug: "mental-health",
        name: "Sức khỏe tâm thần",
        nameEn: "Mental Health",
    },
    {
        id: "pharmacy",
        slug: "pharmacy",
        name: "Dược",
        nameEn: "Pharmacy",
    },
];

export function SpecialtyListSection() {
    const t = useTranslations("specialty");
    const { locale } = useParams<{ locale: string }>();

    const breadcrumbItems = [
        { label: t("breadcrumbHome"), href: "/" },
        { label: t("breadcrumbSpecialty") },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4">
            <Breadcrumb items={breadcrumbItems} />

            <h1 className="text-2xl md:text-3xl font-bold text-[#0076c0] mb-8 uppercase tracking-wide text-center py-4">
                {t("pageTitle")}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
                {specialties.map((specialty) => (
                    <Link
                        key={specialty.id}
                        href={`/${locale}/specialty/${specialty.slug}`}
                        className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-gray-200 hover:border-[#0076c0] hover:shadow-md transition-all group no-underline"
                    >
                        <div className="w-2 h-2 rounded-full bg-[#0076c0] shrink-0" />
                        <span className="text-[15px] font-medium text-gray-800 group-hover:text-[#0076c0] transition-colors">
                            {locale === "vi" ? specialty.name : specialty.nameEn}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
