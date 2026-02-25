"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
    id: string;
    label: string;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
    children?: (activeTab: string) => React.ReactNode;
    variant?: "underline" | "button";
}

export function Tabs({ tabs, defaultTab, children, variant = "button" }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");

    if (variant === "underline") {
        return (
            <div>
                <div className="flex flex-wrap justify-between border-b border-gray-200 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "px-4 py-3 text-sm md:text-base font-medium whitespace-nowrap transition-colors cursor-pointer",
                                activeTab === tab.id
                                    ? "text-[#0076c0] border-b-2 border-[#0076c0] -mb-px"
                                    : "text-gray-500 hover:text-[#0076c0]"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                {children && children(activeTab)}
            </div>
        );
    }

    // Button variant (Vinmec style)
    return (
        <div>
            <div className="flex flex-wrap gap-0 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "px-5 py-3 text-sm md:text-base font-medium whitespace-nowrap transition-colors cursor-pointer border-none",
                            activeTab === tab.id
                                ? "bg-[#0076c0] text-white"
                                : "bg-[#e8e8e8] text-gray-700 hover:bg-gray-300"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            {children && children(activeTab)}
        </div>
    );
}
