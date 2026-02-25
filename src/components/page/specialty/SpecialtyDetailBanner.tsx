"use client";

import { useTranslations } from "next-intl";
import { PageBanner } from "@/components/common/PageBanner";

const VINMEC_BASE_URL = "https://www.vinmec.com";

interface SpecialtyDetailBannerProps {
    slug: string;
}

export function SpecialtyDetailBanner({ slug }: SpecialtyDetailBannerProps) {
    const t = useTranslations("specialty");
    
    // Convert slug to translation key (e.g., "womens-health" -> "womensHealth")
    const translationKey = slug.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

    return (
        <PageBanner
            title={t(`${translationKey}.subtitle`)}
            imageUrl={`${VINMEC_BASE_URL}/static/uploads/cover_list_doctor_f60bffe168.jpg`}
        />
    );
}
