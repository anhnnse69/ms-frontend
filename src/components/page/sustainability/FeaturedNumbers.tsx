"use client";

import { useTranslations } from "next-intl";

interface NumberItem {
    number: string;
    text: string;
}

interface NumberGroup {
    category: string;
    categoryKey: "environment" | "social" | "governance";
    color: string;
    items: NumberItem[];
}

export function FeaturedNumbers() {
    const t = useTranslations("sustainability");

    const numberGroups: NumberGroup[] = [
        {
            category: t("numbers.environment.title"),
            categoryKey: "environment",
            color: "#51be9d",
            items: [
                {
                    number: t("numbers.environment.items.0.number"),
                    text: t("numbers.environment.items.0.text"),
                },
                {
                    number: t("numbers.environment.items.1.number"),
                    text: t("numbers.environment.items.1.text"),
                },
                {
                    number: t("numbers.environment.items.2.number"),
                    text: t("numbers.environment.items.2.text"),
                },
            ],
        },
        {
            category: t("numbers.social.title"),
            categoryKey: "social",
            color: "#0076c0",
            items: [
                {
                    number: t("numbers.social.items.0.number"),
                    text: t("numbers.social.items.0.text"),
                },
                {
                    number: t("numbers.social.items.1.number"),
                    text: t("numbers.social.items.1.text"),
                },
                {
                    number: t("numbers.social.items.2.number"),
                    text: t("numbers.social.items.2.text"),
                },
            ],
        },
        {
            category: t("numbers.governance.title"),
            categoryKey: "governance",
            color: "#f5c55b",
            items: [
                {
                    number: t("numbers.governance.items.0.number"),
                    text: t("numbers.governance.items.0.text"),
                },
                {
                    number: t("numbers.governance.items.1.number"),
                    text: t("numbers.governance.items.1.text"),
                },
                {
                    number: t("numbers.governance.items.2.number"),
                    text: t("numbers.governance.items.2.text"),
                },
            ],
        },
    ];

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-300 mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#0076c0] mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-[#0076c0]">
                    {t("featuredNumbers")}
                </h2>

                <div className="space-y-6">
                    {numberGroups.map((group) => (
                        <div
                            key={group.categoryKey}
                            className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm overflow-hidden"
                        >
                            {/* Category Label */}
                            <div
                                className="md:w-1/4 p-6 flex items-center justify-center text-white font-bold text-lg"
                                style={{ backgroundColor: group.color }}
                            >
                                {group.category}
                            </div>

                            {/* Number Items */}
                            <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                                {group.items.map((item, index) => (
                                    <div key={index} className="p-6 text-center">
                                        <div
                                            className="text-2xl md:text-3xl font-bold mb-2"
                                            style={{ color: group.color }}
                                        >
                                            {item.number}
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {item.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
