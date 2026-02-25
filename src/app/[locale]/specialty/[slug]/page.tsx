"use client";

import { useParams, notFound } from "next/navigation";
import { SpecialtyDetailBanner } from "@/components/page/specialty/SpecialtyDetailBanner";
import { SpecialtyDetailSection } from "@/components/page/specialty/SpecialtyDetailSection";

// Valid specialty slugs
const VALID_SLUGS = [
    "emergency",
    "cardiology",
    "oncology",
    "immunology",
    "gastroenterology",
    "pediatrics",
    "womens-health",
    "general-health",
    "ophthalmology",
    "dental",
    "traditional-medicine",
    "regenerative-medicine",
    "orthopedics",
    "stem-cell",
    "vaccine",
    "breast-center",
    "neurology",
    "mental-health",
    "pharmacy",
];

export default function SpecialtyDetailPage() {
    const { slug } = useParams<{ slug: string }>();

    // Validate slug
    if (!VALID_SLUGS.includes(slug)) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <SpecialtyDetailBanner slug={slug} />
            <SpecialtyDetailSection slug={slug} />
        </div>
    );
}
