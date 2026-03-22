"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Navigation } from "./Navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

function SearchIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
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

function UserIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function VinmecLogo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="https://www.vinmec.com/static/uploads/Logo_Vinmec_System_c725c14ffd.png"
      alt="Vinmec International Hospital System"
      className="h-14 w-auto"
    />
  );
}

export function Header() {
  const t = useTranslations("common");
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const { user, isLoading, isAdmin, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDashboardRoute = pathname?.includes("/admin") || pathname?.includes("/manager") || pathname?.includes("/doctor");

  if (isDashboardRoute) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-30 transition-shadow duration-300",
        scrolled ? "shadow-lg" : ""
      )}
    >
      {/* Row 1: Top action bar — blue gradient matching HTML blue-gradient class */}
      <div style={{ background: "linear-gradient(to bottom, #008ca8 0%, #0068ab 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-end h-9 gap-1 text-xs">
          <Link
            href={`/${locale}/specialty/cardiology`}
            className="text-white/90 hover:text-white px-3 py-1 rounded transition-colors"
          >
            {t("findDoctor")}
          </Link>
          <span className="text-white/30">|</span>
          <a
            href="https://www.vinmec.com/vie/lien-he-voi-chung-toi/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#009ec0] hover:bg-[#007da0] text-white px-3 py-1 rounded transition-colors border border-white/20"
          >
            {t("customerCare")}
          </a>
        </div>
      </div>

      {/* Row 2: Logo + Search + Actions (white) */}
      <div className="bg-white border-b border-[#e8eef4]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 h-18">
            <Link href={`/${locale}`} className="shrink-0">
              <VinmecLogo />
            </Link>

            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="w-full border border-[#dde4ec] rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#0076c0] focus:ring-1 focus:ring-[#0076c0] bg-[#f8fafc] text-[#333]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto shrink-0">
              <Link
                href={`/${locale}/booking`}
                className="text-[#0076c0] hover:text-[#005a91] transition-colors hidden md:block"
                title={t("bookAppointment")}
              >
                <CalendarIcon />
              </Link>

              <span className="hidden md:block h-5 w-px bg-[#dde4ec]" />

              {!isLoading && user && (
                <>
                  <div className="hidden md:flex items-center gap-2 text-sm text-[#0076c0]">
                    <UserIcon />
                    <span
                      className="font-medium truncate max-w-35"
                      title={user.displayName || user.username || user.email}
                    >
                      {user.displayName || user.username || user.email}
                    </span>
                  </div>

                  {isAdmin && (
                    <Link
                      href={`/${locale}/admin`}
                      className="hidden md:block text-xs font-medium text-[#0076c0] hover:text-[#005a91] border border-[#0076c0]/40 rounded px-3 py-1 transition-colors"
                    >
                      {t("adminDashboard")}
                    </Link>
                  )}

                  {!isAdmin && user.role === "Manager" && (
                    <Link
                      href={`/${locale}/manager`}
                      className="hidden md:block text-xs font-medium text-[#0076c0] hover:text-[#005a91] border border-[#0076c0]/40 rounded px-3 py-1 transition-colors"
                    >
                      {t("managerDashboard")}
                    </Link>
                  )}

                  {!isAdmin && user.role === "Doctor" && (
                    <Link
                      href={`/${locale}/doctor`}
                      className="hidden md:block text-xs font-medium text-[#0076c0] hover:text-[#005a91] border border-[#0076c0]/40 rounded px-3 py-1 transition-colors"
                    >
                      {t("doctorDashboard")}
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      router.push(`/${locale}`);
                    }}
                    className="hidden md:block bg-transparent border border-[#dde4ec] text-[#444] hover:bg-[#f3f6fa] px-3 py-1.5 rounded text-sm font-medium transition-colors"
                  >
                    {t("logout")}
                  </button>
                </>
              )}

              {!isLoading && !user && (
                <>
                  <Link
                    href={`/${locale}/login`}
                    className="hidden md:flex items-center gap-1.5 text-[#0076c0] hover:text-[#005a91] transition-colors text-sm font-medium"
                  >
                    <UserIcon />
                    {t("login")}
                  </Link>

                  <Link
                    href={`/${locale}/register`}
                    className="bg-[#0076c0] hover:bg-[#005a91] text-white px-3 py-1.5 rounded text-sm font-medium transition-colors hidden md:block"
                  >
                    {t("register")}
                  </Link>
                </>
              )}

              <span className="hidden md:block h-5 w-px bg-[#dde4ec]" />

              <LanguageSwitcher />

              <button className="md:hidden text-[#0076c0] p-1">
                <SearchIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Navigation bar (white) */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <Navigation />
        </div>
      </div>
    </header>
  );
}
