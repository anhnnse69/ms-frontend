"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

// ─── Hardcoded hrefs (locale-agnostic) ───────────────────────────────────────

const HREFS = {
  specialtiesCol1: [
    "/specialty/emergency",
    "/specialty/cardiology",
    "/specialty/oncology",
    "/specialty/immunology",
    "/specialty/gastroenterology",
    "/specialty/pediatrics",
    "/specialty/womens-health",
    "/specialty/general-health",
    "/specialty/ophthalmology",
    "/specialty/dental",
  ],
  specialtiesCol2: [
    "/specialty/traditional-medicine",
    "/specialty/regenerative-medicine",
    "/specialty/orthopedics",
    "/specialty/stem-cell",
    "/specialty/vaccine",
    "/specialty/breast-center",
    "/specialty/neurology",
    "/specialty/mental-health",
    "/specialty/pharmacy",
  ],
  guidanceCol1: [
    "/doctors",
  ],
};

type HrefsKey = keyof typeof HREFS;

function ChevronDownIcon() {
  return (
    <svg className="w-3 h-3 ml-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export function Navigation() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations("nav");
  const base = `/${locale}`;

  // Merge translated labels with static hrefs
  const buildCol = (key: HrefsKey) => {
    const labels = t.raw(key) as string[];
    return labels.map((label, i) => ({ label, href: HREFS[key][i] ?? "#" }));
  };

  const navItems = [
    {
      label: t("specialties"),
      children: [buildCol("specialtiesCol1"), buildCol("specialtiesCol2")],
    },
    {
      label: t("guidance"),
      children: [buildCol("guidanceCol1")],
    },
    {
      label: t("sustainability"),
      href: "/sustainability",
    },
  ];

  return (
    <nav>
      <ul className="flex items-center">
        {navItems.map((item) => {
          const hasDropdown = !!item.children?.length;
          return (
            <li key={item.label} className="group relative">
              {item.href ? (
                <Link
                  href={`${base}${item.href}`}
                  className="flex items-center gap-0.5 px-4 py-4 text-[13px] font-medium text-[#4d4c4c] hover:text-[#0076c0] whitespace-nowrap transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <button className="flex items-center gap-0.5 px-4 py-4 text-[13px] font-medium text-[#4d4c4c] hover:text-[#0076c0] whitespace-nowrap transition-colors cursor-pointer">
                  {item.label}
                  {hasDropdown && <ChevronDownIcon />}
                </button>
              )}

              {hasDropdown && (
                <div className="absolute left-0 top-full z-50 hidden group-hover:flex bg-white shadow-[0_4px_15px_2px_rgba(0,0,0,0.1)] rounded-sm min-w-50">
                  {item.children!.map((col, ci) => (
                    <ul key={ci} className="px-2.5 py-3.5 min-w-50">
                      {col.map((sub) => (
                        <li key={sub.href} className="border-b border-[#dfdede] last:border-b-0">
                          <Link
                            href={sub.href.startsWith("http") ? sub.href : `${base}${sub.href}`}
                            className="block px-3 py-2 text-[13px] text-[#4d4c4c] hover:bg-[#f2f2f2] whitespace-nowrap leading-relaxed transition-colors"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
