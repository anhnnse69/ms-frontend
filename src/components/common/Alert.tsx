"use client";

import { ReactNode } from "react";

export type AlertVariant = "success" | "error" | "info" | "warning";

interface AlertProps {
    variant?: AlertVariant;
    children: ReactNode;
}

export function Alert({ variant = "info", children }: AlertProps) {
    const base =
        "w-full max-w-lg mx-auto px-4 py-3 rounded-md shadow-sm text-sm flex items-start gap-2";

    const styles: Record<AlertVariant, string> = {
        success:
            "bg-green-50 border border-green-200 text-green-800",
        error:
            "bg-red-50 border border-red-200 text-red-800",
        info:
            "bg-blue-50 border border-blue-200 text-blue-800",
        warning:
            "bg-yellow-50 border border-yellow-200 text-yellow-800",
    };

    const iconMap: Record<AlertVariant, string> = {
        success: "✓",
        error: "⚠",
        info: "ℹ",
        warning: "!",
    };

    return (
        <div className={`${base} ${styles[variant]}`}>
            <span className="mt-0.5 text-base select-none">{iconMap[variant]}</span>
            <div>{children}</div>
        </div>
    );
}
