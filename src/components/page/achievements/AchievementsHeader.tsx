import Image from "next/image";
import { useTranslations } from "next-intl";

const VINMEC_BASE_URL = "https://www.vinmec.com";

interface AchievementsHeaderProps {
    activeTab: "timeline" | "awards";
    onTabChange: (tab: "timeline" | "awards") => void;
    overlay?: boolean;
}

export default function AchievementsHeader({ activeTab, onTabChange, overlay = false }: AchievementsHeaderProps) {
    const t = useTranslations("achievements");
    // Overlay: absolute above logo, else static
    const tabContainerClass = `tab_insurance flex justify-center text-center ${overlay ? 'absolute left-1/2 transform -translate-x-1/2 top-0 md:top-10 z-10 w-full' : ''}`;
    return (
        <div className="flex flex-col items-center relative w-full">
            {/* Tab buttons above logo */}
            <div className={tabContainerClass} style={overlay ? { marginTop: '-2.5rem' } : {}}>
                <button
                    type="button"
                    onClick={() => onTabChange("timeline")}
                    className={`item_tab_insurance px-8 py-3 rounded-lg font-semibold border-2 transition-colors duration-200 shadow ${activeTab === "timeline" ? "text-white bg-[#0076c0] border-[#0076c0]" : "text-[#0076c0] bg-white border-[#0076c0] hover:bg-[#0076c0] hover:text-white"}`}
                >
                    {t("tabs.timeline")}
                </button>
                <button
                    type="button"
                    onClick={() => onTabChange("awards")}
                    className={`item_tab_insurance px-8 py-3 rounded-lg font-semibold border-2 transition-colors duration-200 shadow ml-4 ${activeTab === "awards" ? "text-white bg-[#0076c0] border-[#0076c0]" : "text-[#0076c0] bg-white border-[#0076c0] hover:bg-[#0076c0] hover:text-white"}`}
                >
                    {t("tabs.awards")}
                </button>
            </div>
            <div className="text-center logo_history mt-20 mb-8 w-full">
                <div className="logo_history_inner mx-auto">
                    <Image
                        src={`${VINMEC_BASE_URL}/assets/images/logo.svg`}
                        alt="Vinmec logo"
                        width={160}
                        height={80}
                        className="mb-4 mx-auto"
                        priority
                    />
                </div>
                <div className="container_award_header w-full" />
            </div>
        </div>
    );
}
