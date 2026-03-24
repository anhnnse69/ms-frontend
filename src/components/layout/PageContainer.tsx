"use client";

import { usePathname } from "next/navigation";
import React from "react";

interface PageContainerProps {
    children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
    const pathname = usePathname();

    const segments = pathname?.split("/") ?? [];
    const isDashboardRoute = segments.includes("admin") || segments.includes("manager") || segments.includes("doctor");

    return (
        <main className={isDashboardRoute ? "min-h-screen" : "pt-40 min-h-screen"}>
            {children}
        </main>
    );
}
