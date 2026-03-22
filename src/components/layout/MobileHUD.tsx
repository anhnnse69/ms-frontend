"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

function PhoneIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21L8.4 10.5a11.1 11.1 0 0 0 5.1 5.1l1.113-1.824a1 1 0 0 1 1.21-.502l4.493 1.498A1 1 0 0 1 21 15.72V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
    </svg>
  );
}
function DoctorIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
    </svg>
  );
}

export function MobileHUD() {
  const t = useTranslations("common");
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();

  const isDashboardRoute = pathname?.includes("/admin") || pathname?.includes("/manager") || pathname?.includes("/doctor");
  if (isDashboardRoute) {
    return null;
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-[#e0e8ef] shadow-lg safe-area-pb">
      <div className="grid grid-cols-3 h-16">
        <a
          href="tel:18006858"
          className="flex flex-col items-center justify-center gap-1 text-[#0076c0] hover:bg-[#f3f7fb] transition-colors"
        >
          <PhoneIcon />
          <span className="text-[10px] font-medium">{t("callHotline")}</span>
        </a>
        <Link
          href={`/${locale}/booking`}
          className="flex flex-col items-center justify-center gap-1 bg-[#0076c0] text-white"
        >
          <CalendarIcon />
          <span className="text-[10px] font-medium">{t("bookAppointment")}</span>
        </Link>
        <Link
          href={`/${locale}/doctors`}
          className="flex flex-col items-center justify-center gap-1 text-[#0076c0] hover:bg-[#f3f7fb] transition-colors"
        >
          <DoctorIcon />
          <span className="text-[10px] font-medium">{t("findDoctor")}</span>
        </Link>
      </div>
    </div>
  );
}
