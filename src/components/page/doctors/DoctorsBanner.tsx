"use client";

import { useTranslations } from "next-intl";
import { PageBanner } from "@/components/common/PageBanner";

const VINMEC_BASE_URL = "https://www.vinmec.com";

export function DoctorsBanner() {
    const t = useTranslations("doctors");

    return (
        <PageBanner
            title={t("title")}
            imageUrl={`${VINMEC_BASE_URL}/static/uploads/cover_list_doctor_f60bffe168.jpg`}
            activeButton="doctor"
        />
    );
}
