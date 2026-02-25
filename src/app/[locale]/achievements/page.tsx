

"use client";

import { PageBanner } from "@/components/common/PageBanner";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import AchievementsHeader from "@/components/page/achievements/AchievementsHeader";
import AchievementsTimeline from "@/components/page/achievements/AchievementsTimeline";
import ContentInsurance from "@/components/page/achievements/ContentInsurance";
import { useTranslations } from "next-intl";
import { useState } from "react";

const VINMEC_BASE_URL = "https://www.vinmec.com";

export default function AchievementsPage() {
    const t = useTranslations("achievements");
    const [activeTab, setActiveTab] = useState<"timeline" | "awards">("timeline");

    return (
        <div className="bg-[#f5f7fa] min-h-screen">
            <PageBanner
                title={t("title")}
                imageUrl={`${VINMEC_BASE_URL}/static/uploads/cover_list_doctor_f60bffe168.jpg`}
                hideActionBar={false}
                activeButton={undefined}
            />
            <div className="max-w-5xl mx-auto px-4">
                {/* legacy container to match index.html structure */}
                <div className="container_body margin-auto">
                    <Breadcrumb
                        items={[
                            { label: t("breadcrumb.home"), href: "/" },
                            { label: t("breadcrumb.achievements") },
                        ]}
                    />

                    <div className="my-8">
                        <div className="tab-1" style={{ margin: 20 }}>
                            <div className="relative flex flex-col items-center w-full">
                                <AchievementsHeader
                                    activeTab={activeTab}
                                    onTabChange={setActiveTab}
                                    overlay
                                />
                                <ContentInsurance activeTab={activeTab}>
                                    {activeTab === "timeline" && <AchievementsTimeline />}
                                </ContentInsurance>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
