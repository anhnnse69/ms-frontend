"use client";

import { usePathname } from "next/navigation";
import React from "react";

interface PageContainerProps {
    children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
    const pathname = usePathname();

    const isDashboardRoute = pathname?.includes("/admin") || pathname?.includes("/manager") || pathname?.includes("/doctor");

    return (
        <main className={isDashboardRoute ? "min-h-screen" : "pt-40 min-h-screen"}>
            {children}
        </main>
    );
}
