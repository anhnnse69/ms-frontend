"use client";

import { useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Tabs } from "@/components/common/Tabs";
import { DoctorCard, DoctorInfo } from "@/components/common/DoctorCard";
import { SpecialtyTitle } from "./SpecialtyTitle";
import { ContentSection } from "./ContentSection";
import { ImageGallery } from "./ImageGallery";

const VINMEC_BASE_URL = "https://www.vinmec.com";

// Default gallery images
const defaultGalleryImages = [
    {
        small: `${VINMEC_BASE_URL}/static/uploads/small_DSC_7871_copy_9fa5fe511c.jpg`,
        medium: `${VINMEC_BASE_URL}/static/uploads/medium_DSC_7871_copy_9fa5fe511c.jpg`,
        aspectRatio: "8256/5504",
        imgAspectRatio: "234/156",
    },
    {
        small: `${VINMEC_BASE_URL}/static/uploads/small_cap_cu_dich_vu_001_f2ce791b6b.JPG`,
        medium: `${VINMEC_BASE_URL}/static/uploads/medium_cap_cu_dich_vu_001_f2ce791b6b.JPG`,
        aspectRatio: "6000/4000",
        imgAspectRatio: "234/156",
    },
    {
        small: `${VINMEC_BASE_URL}/static/uploads/small_cap_cuu_dich_vu_002_047475358c.jpg`,
        aspectRatio: "612/408",
        imgAspectRatio: "234/156",
    },
];

// Default content images
const defaultImages = {
    overview1: {
        small: `${VINMEC_BASE_URL}/static/uploads/small_cap_cu_dich_vu_001_a4320f30f2.JPG`,
        medium: `${VINMEC_BASE_URL}/static/uploads/medium_cap_cu_dich_vu_001_a4320f30f2.JPG`,
        aspectRatio: "6000/4000",
        imgAspectRatio: "234/156",
    },
    overview2: {
        small: `${VINMEC_BASE_URL}/static/uploads/small_cap_cuu_dich_vu_002_047475358c.jpg`,
        aspectRatio: "612/408",
        imgAspectRatio: "234/156",
    },
    overview3: {
        small: `${VINMEC_BASE_URL}/static/uploads/small_DSC_7871_copy_9fa5fe511c.jpg`,
        medium: `${VINMEC_BASE_URL}/static/uploads/medium_DSC_7871_copy_9fa5fe511c.jpg`,
        aspectRatio: "8256/5504",
        imgAspectRatio: "234/156",
    },
    overview4: {
        small: `${VINMEC_BASE_URL}/static/uploads/small_mo_hinh_cap_cuu_002_a74f776a5e.png`,
        medium: `${VINMEC_BASE_URL}/static/uploads/medium_mo_hinh_cap_cuu_002_a74f776a5e.png`,
        aspectRatio: "1000/563",
        imgAspectRatio: "245/138",
    },
    services1: {
        small: `${VINMEC_BASE_URL}/static/uploads/small_mo_hinh_cap_cuu_004_807d4aeebe.png`,
        medium: `${VINMEC_BASE_URL}/static/uploads/medium_mo_hinh_cap_cuu_004_807d4aeebe.png`,
        aspectRatio: "795/652",
        imgAspectRatio: "190/156",
    },
    services2: {
        small: `${VINMEC_BASE_URL}/static/uploads/small_mo_hinh_cap_cuu_002_a74f776a5e.png`,
        medium: `${VINMEC_BASE_URL}/static/uploads/medium_mo_hinh_cap_cuu_002_a74f776a5e.png`,
        aspectRatio: "1000/563",
        imgAspectRatio: "245/138",
    },
    technology1: {
        small: `${VINMEC_BASE_URL}/static/uploads/small_istockphoto_1335922711_612x612_3b7ca24fbb.jpg`,
        aspectRatio: "612/408",
        imgAspectRatio: "234/156",
    },
    technology2: {
        small: `${VINMEC_BASE_URL}/static/uploads/small_DSC_7877_copy_39365723d8.jpg`,
        medium: `${VINMEC_BASE_URL}/static/uploads/medium_DSC_7877_copy_39365723d8.jpg`,
        aspectRatio: "5504/8256",
        imgAspectRatio: "104/156",
    },
};

// Generic doctor data generator - bookingUrl and profileUrl are handled by DoctorCard with local routes
const getDoctors = (specialty: string): DoctorInfo[] => [
    {
        id: "51531",
        name: "Vũ Đức Định",
        imageUrl: `${VINMEC_BASE_URL}/static/uploads/small_bac_si_vu_duc_dinh_vinmec_phu_quoc_eec6b9122b.jpg`,
        degree: "Phó giáo sư, Tiến sĩ, Bác sĩ",
        specialty,
        hospital: "Bệnh viện Đa khoa Vinmec Phú Quốc",
        rating: 4.7,
    },
    {
        id: "51111",
        name: "Nguyễn Đăng Tuân",
        imageUrl: `${VINMEC_BASE_URL}/static/uploads/small_20_06_2023_05_34_56_493406_jpeg_9d1a129cf2.jpg`,
        degree: "Tiến sĩ, Bác sĩ",
        specialty,
        hospital: "Bệnh viện Đa khoa Vinmec Smart City",
    },
    {
        id: "50786",
        name: "Phùng Nam Lâm",
        imageUrl: `${VINMEC_BASE_URL}/static/uploads/small_bac_si_phung_nam_lam_vinmec_3e348d4a7d.jpg`,
        degree: "Tiến sĩ, Bác sĩ",
        specialty,
        hospital: "Hệ thống Y tế Vinmec",
        rating: 4.9,
    },
    {
        id: "3335",
        name: "Nguyễn Ngọc Tuyền",
        imageUrl: `${VINMEC_BASE_URL}/static/uploads/small_bac_si_nguyen_ngoc_tuyen_0238674901.jpg`,
        degree: "Bác sĩ chuyên khoa I",
        specialty,
        hospital: "Bệnh viện Đa khoa Vinmec Hạ Long",
    },
    {
        id: "51284",
        name: "Lê Thị Minh Hương",
        imageUrl: `${VINMEC_BASE_URL}/static/uploads/small_bac_si_le_thi_minh_huong_089e4c5942.jpg`,
        degree: "Thạc sĩ, Bác sĩ",
        specialty,
        hospital: "Bệnh viện Đa khoa Vinmec Nha Trang",
        rating: 4.8,
    },
    {
        id: "2375",
        name: "Trịnh Ngọc Duy",
        imageUrl: `${VINMEC_BASE_URL}/static/uploads/small_Trinh_Ngoc_Duy_eb2ef06beb.jpg`,
        degree: "Bác sĩ chuyên khoa II, Bác sĩ",
        specialty,
        hospital: "Bệnh viện Đa khoa Vinmec Smart City",
    },
];

interface SpecialtyDetailSectionProps {
    slug: string;
}

export function SpecialtyDetailSection({ slug }: SpecialtyDetailSectionProps) {
    const t = useTranslations("specialty");

    // Convert slug to translation key (e.g., "womens-health" -> "womensHealth")
    const translationKey = slug.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

    const tabs = [
        { id: "tong_quan", label: t(`${translationKey}.tabs.overview`) },
        { id: "dich_vu", label: t(`${translationKey}.tabs.services`) },
        { id: "cong_nghe", label: t(`${translationKey}.tabs.technology`) },
        { id: "bac_si", label: t(`${translationKey}.tabs.doctors`) },
    ];

    const breadcrumbItems = [
        { label: t("breadcrumbHome"), href: "/" },
        { label: t("breadcrumbSpecialty"), href: "/specialty" },
        { label: t(`${translationKey}.title`) },
    ];

    const doctors = getDoctors(t(`${translationKey}.doctors.specialty`));

    return (
        <div className="max-w-300 px-3.75 mx-auto">
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} />

            {/* Title */}
            <SpecialtyTitle>{t(`${translationKey}.subtitle`)}</SpecialtyTitle>

            {/* Description */}
            <p className="text-[14px] text-[#4d4c4c] leading-[1.7] mb-6">
                {t(`${translationKey}.description`)}
            </p>

            {/* Tabs */}
            <Tabs tabs={tabs} defaultTab="tong_quan" variant="underline">
                {(activeTab) => (
                    <>
                        {/* ========== TAB: Tổng quan ========== */}
                        <section
                            className={`mt-3 mb-10 ${activeTab === "tong_quan" ? "block" : "hidden"}`}
                        >
                            <ContentSection image={defaultImages.overview1}>
                                <h2>{t(`${translationKey}.overview.section1.title`)}</h2>
                                <p>{t(`${translationKey}.overview.section1.desc`)}</p>
                                <h2>{t(`${translationKey}.overview.section2.title`)}</h2>
                                <ul>
                                    {(t.raw(`${translationKey}.overview.section2.items`) as string[]).map(
                                        (item, index) => (
                                            <li key={index}>{item}</li>
                                        )
                                    )}
                                </ul>
                            </ContentSection>

                            <ContentSection image={defaultImages.overview2} reverse>
                                <h2>{t(`${translationKey}.overview.section3.title`)}</h2>
                                <ul>
                                    {(t.raw(`${translationKey}.overview.section3.items`) as string[]).map(
                                        (item, index) => (
                                            <li key={index}>{item}</li>
                                        )
                                    )}
                                </ul>
                            </ContentSection>

                            <ContentSection image={defaultImages.overview3}>
                                <h2>{t(`${translationKey}.overview.section4.title`)}</h2>
                                <p>
                                    <strong>{t(`${translationKey}.overview.section4.sub1.title`)}</strong>
                                </p>
                                <p>{t(`${translationKey}.overview.section4.sub1.desc`)}</p>
                                <p>
                                    <strong>{t(`${translationKey}.overview.section4.sub2.title`)}</strong>
                                </p>
                                <p>{t(`${translationKey}.overview.section4.sub2.desc`)}</p>
                            </ContentSection>

                            <ContentSection image={defaultImages.overview4} reverse>
                                <h2>{t(`${translationKey}.overview.section5.title`)}</h2>
                                <p>{t(`${translationKey}.overview.section5.desc`)}</p>
                            </ContentSection>

                            <ImageGallery images={defaultGalleryImages} />
                        </section>

                        {/* ========== TAB: Dịch vụ ========== */}
                        <section
                            className={`mt-3 mb-10 ${activeTab === "dich_vu" ? "block" : "hidden"}`}
                        >
                            <ContentSection image={defaultImages.services1}>
                                <h2>{t(`${translationKey}.services.section1.title`)}</h2>
                                <ul>
                                    {(t.raw(`${translationKey}.services.section1.items`) as string[]).map(
                                        (item, index) => (
                                            <li key={index}>{item}</li>
                                        )
                                    )}
                                </ul>
                            </ContentSection>

                            <ContentSection image={defaultImages.services2} reverse>
                                <h2>{t(`${translationKey}.services.section2.title`)}</h2>
                                <ul>
                                    {(t.raw(`${translationKey}.services.section2.items`) as string[]).map(
                                        (item, index) => (
                                            <li key={index}>{item}</li>
                                        )
                                    )}
                                </ul>
                            </ContentSection>
                        </section>

                        {/* ========== TAB: Công nghệ ========== */}
                        <section
                            className={`mt-3 mb-10 ${activeTab === "cong_nghe" ? "block" : "hidden"}`}
                        >
                            <ContentSection image={defaultImages.technology1} reverse>
                                <h2>{t(`${translationKey}.technology.section1.title`)}</h2>
                                <p>{t(`${translationKey}.technology.section1.desc1`)}</p>
                                <p>{t(`${translationKey}.technology.section1.desc2`)}</p>
                            </ContentSection>

                            <ContentSection image={defaultImages.technology2}>
                                <h2>{t(`${translationKey}.technology.section2.title`)}</h2>
                                <ul>
                                    {(t.raw(`${translationKey}.technology.section2.items`) as string[]).map(
                                        (item, index) => (
                                            <li key={index}>{item}</li>
                                        )
                                    )}
                                </ul>
                            </ContentSection>
                        </section>

                        {/* ========== TAB: Danh sách bác sĩ ========== */}
                        <section
                            className={`mt-3 mb-10 ${activeTab === "bac_si" ? "block" : "hidden"}`}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {doctors.map((doctor) => (
                                    <DoctorCard key={doctor.id} doctor={doctor} variant="grid" showRating={true} />
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </Tabs>
        </div>
    );
}
