"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

const VINMEC_BASE_URL = "https://www.vinmec.com";

interface Topic {
    id: number;
    titleKey: string;
    icon: string;
    color: string;
    contentKey: string;
}

const TOPICS: Topic[] = [
    {
        id: 1,
        titleKey: "topics.serviceQuality.title",
        icon: `${VINMEC_BASE_URL}/static/uploads/1_new_30ea038ce3.png`,
        color: "#f5c55b",
        contentKey: "topics.serviceQuality.content",
    },
    {
        id: 2,
        titleKey: "topics.socialResponsibility.title",
        icon: `${VINMEC_BASE_URL}/static/uploads/2_new_f0debe4ec6.png`,
        color: "#368825",
        contentKey: "topics.socialResponsibility.content",
    },
    {
        id: 3,
        titleKey: "topics.responsibleBusiness.title",
        icon: `${VINMEC_BASE_URL}/static/uploads/3_new_d91c70dec8.png`,
        color: "#0079a1",
        contentKey: "topics.responsibleBusiness.content",
    },
    {
        id: 4,
        titleKey: "topics.dataSecurity.title",
        icon: `${VINMEC_BASE_URL}/static/uploads/4_new_4c52da0f0e.png`,
        color: "#29a9c7",
        contentKey: "topics.dataSecurity.content",
    },
    {
        id: 5,
        titleKey: "topics.humanResources.title",
        icon: `${VINMEC_BASE_URL}/static/uploads/5_new_a52f2363cc.png`,
        color: "#864996",
        contentKey: "topics.humanResources.content",
    },
    {
        id: 6,
        titleKey: "topics.employeeWelfare.title",
        icon: `${VINMEC_BASE_URL}/static/uploads/6_new_d45d26f263.png`,
        color: "#ca577f",
        contentKey: "topics.employeeWelfare.content",
    },
    {
        id: 7,
        titleKey: "topics.diversity.title",
        icon: `${VINMEC_BASE_URL}/static/uploads/7_new_e2fafafad4.png`,
        color: "#623524",
        contentKey: "topics.diversity.content",
    },
    {
        id: 8,
        titleKey: "topics.supplyChain.title",
        icon: `${VINMEC_BASE_URL}/static/uploads/8_new2_e7ef93116c.png`,
        color: "#674f92",
        contentKey: "topics.supplyChain.content",
    },
    {
        id: 9,
        titleKey: "topics.climateResilience.title",
        icon: `${VINMEC_BASE_URL}/static/uploads/9_new_706059c9f6.png`,
        color: "#0076c0",
        contentKey: "topics.climateResilience.content",
    },
    {
        id: 10,
        titleKey: "topics.waterConservation.title",
        icon: `${VINMEC_BASE_URL}/static/uploads/10_new_935fe27348.png`,
        color: "#51be9d",
        contentKey: "topics.waterConservation.content",
    },
    {
        id: 11,
        titleKey: "topics.wasteManagement.title",
        icon: `${VINMEC_BASE_URL}/static/uploads/11_new_ec616cd3ca.png`,
        color: "#d6982f",
        contentKey: "topics.wasteManagement.content",
    },
    {
        id: 12,
        titleKey: "topics.responsibleInvestment.title",
        icon: `${VINMEC_BASE_URL}/static/uploads/12_new_648a83db9f.png`,
        color: "#cf5640",
        contentKey: "topics.responsibleInvestment.content",
    },
];

export function KeyTopics() {
    const t = useTranslations("sustainability");
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

    const handleTopicClick = (id: number) => {
        setSelectedTopic(selectedTopic === id ? null : id);
    };

    const selectedTopicData = TOPICS.find((topic) => topic.id === selectedTopic);

    return (
        <section className="py-12 bg-white">
            <div className="max-w-300 mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#0076c0] mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-[#0076c0]">
                    {t("keyTopics")}
                </h2>

                {/* Topics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                    {TOPICS.map((topic) => (
                        <button
                            key={topic.id}
                            onClick={() => handleTopicClick(topic.id)}
                            className={`relative p-4 rounded-lg transition-all duration-300 cursor-pointer group ${
                                selectedTopic === topic.id
                                    ? "ring-2 ring-offset-2 shadow-lg scale-105"
                                    : "hover:shadow-md hover:scale-102"
                            }`}
                            style={{
                                backgroundColor: topic.color,
                                ["--tw-ring-color" as string]: topic.color,
                            }}
                        >
                            <div className="flex flex-col items-center text-white">
                                <div className="w-16 h-16 mb-3 flex items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={topic.icon}
                                        alt={t(topic.titleKey)}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <h3 className="text-xs sm:text-sm font-medium text-center leading-tight">
                                    {t(topic.titleKey)}
                                </h3>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Selected Topic Content */}
                {selectedTopicData && (
                    <div
                        className="p-6 rounded-lg text-white animate-fadeIn"
                        style={{ backgroundColor: selectedTopicData.color }}
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={selectedTopicData.icon}
                                    alt={t(selectedTopicData.titleKey)}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-3">
                                    {t(selectedTopicData.titleKey)}
                                </h3>
                                <p className="leading-relaxed text-white/90">
                                    {t(selectedTopicData.contentKey)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {!selectedTopic && (
                    <p className="text-center text-gray-500 italic">
                        {t("selectTopicPrompt")}
                    </p>
                )}
            </div>
        </section>
    );
}
