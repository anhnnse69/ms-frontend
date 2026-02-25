"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useEffect, useTransition, type ReactElement } from "react";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

/* ── Flag SVGs ── */
function FlagVI() {
  return (
    <svg viewBox="0 0 30 20" className="w-5 h-auto rounded-sm border border-gray-200 shrink-0">
      <rect width="30" height="20" fill="#DA251D" />
      <polygon
        points="15,4 16.8,9.5 22.5,9.5 17.9,12.8 19.7,18.3 15,15 10.3,18.3 12.1,12.8 7.5,9.5 13.2,9.5"
        fill="#FFFF00"
      />
    </svg>
  );
}

function FlagEN() {
  return (
    <svg viewBox="0 0 60 40" className="w-5 h-auto rounded-sm border border-gray-200 shrink-0">
      <rect width="60" height="40" fill="#012169" />
      <line x1="0" y1="0" x2="60" y2="40" stroke="white" strokeWidth="8" />
      <line x1="60" y1="0" x2="0" y2="40" stroke="white" strokeWidth="8" />
      <line x1="0" y1="0" x2="60" y2="40" stroke="#C8102E" strokeWidth="4.5" />
      <line x1="60" y1="0" x2="0" y2="40" stroke="#C8102E" strokeWidth="4.5" />
      <rect x="24" y="0" width="12" height="40" fill="white" />
      <rect x="0" y="14" width="60" height="12" fill="white" />
      <rect x="26" y="0" width="8" height="40" fill="#C8102E" />
      <rect x="0" y="16" width="60" height="8" fill="#C8102E" />
    </svg>
  );
}

const LOCALES: Record<string, { label: string; Flag: () => ReactElement }> = {
  vi: { label: "VI", Flag: FlagVI },
  en: { label: "EN", Flag: FlagEN },
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname(); // locale-stripped path from next-intl
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  /* Close when clicking outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLocale = (newLocale: string) => {
    setOpen(false);
    startTransition(() => {
      // next-intl's router.push accepts { locale } — no manual path splitting needed
      router.push(pathname, { locale: newLocale });
    });
  };

  const current = LOCALES[locale] ?? LOCALES["vi"];
  const CurrentFlag = current.Flag;

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        disabled={isPending}
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors cursor-pointer
          ${isPending ? "opacity-60 cursor-wait" : "hover:bg-[#f3f7fb]"}`}
      >
        <CurrentFlag />
        <span className="text-xs font-semibold text-[#333]">{current.label}</span>
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-1 w-28 bg-white rounded-xl shadow-xl border border-[#e0e8ef] py-1 z-50">
          {routing.locales.map((loc) => {
            const item = LOCALES[loc];
            if (!item) return null;
            const Flag = item.Flag;
            const isActive = loc === locale;
            return (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#e8f4fb] text-[#0076c0] font-semibold"
                    : "text-[#333] hover:bg-[#f3f7fb] hover:text-[#0076c0]"
                }`}
              >
                <Flag />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <svg className="w-3.5 h-3.5 ml-auto text-[#0076c0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
