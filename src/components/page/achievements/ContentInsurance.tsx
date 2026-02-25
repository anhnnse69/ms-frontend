"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface Props {
    children?: React.ReactNode;
    activeTab: "timeline" | "awards";
}

export default function ContentInsurance({ children, activeTab }: Props) {
    const t = useTranslations("achievements");
    return (
        <section className="content_insurance mt3 w-full relative">
            {/* Awards & Certifications tab content */}
            {activeTab === "awards" && (
                <div className="text-center mt-8 f16 tab-2">
                    {t("awardsIntro")}
                </div>
            )}
            {/* Timeline tab content */}
            {activeTab === "timeline" && (
                <div>{children}</div>
            )}
        </section>
    );
}
