"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

interface BreadcrumbProps {
    items: { label: string; href?: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    const { locale } = useParams<{ locale: string }>();

    return (
        <nav className="flex items-center flex-wrap gap-1 text-sm text-gray-600 py-3">
            {items.map((item, index) => (
                <span key={index} className="flex items-center">
                    {item.href ? (
                        <Link
                            href={item.href.startsWith("/") ? `/${locale}${item.href}` : item.href}
                            className="text-[#0076c0] hover:underline transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-700">{item.label}</span>
                    )}
                    {index < items.length - 1 && (
                        <span className="mx-2 text-gray-400">&gt;</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
