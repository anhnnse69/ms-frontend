"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

function YoutubeIcon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="https://www.vinmec.com/static/uploads/Youtube_4bbcb9431f.svg"
      alt="Youtube"
      className="h-8 w-8"
    />
  );
}

function FacebookIcon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="https://www.vinmec.com/static/uploads/Facebook_edefcd7d2d.svg"
      alt="Facebook"
      className="h-8 w-8"
    />
  );
}

// QR code placeholder for MyVinmec app
function QRCode() {
  return (
    <div className="w-31 h-31 bg-white rounded border border-[#e0e8ef] flex items-center justify-center">
      <img src="https://www.vinmec.com/static/uploads/onlink_to_yzzmwy_small_2b59d6bf32.svg" alt="QR_Code" />
    </div>
  );
}

const SYSTEM_HREFS = [
  "/vie/tam-nhin-va-su-menh/",
  "/vie/co-so-y-te/",
  "/vi/doctors",
  "/vie/lam-viec-tai-vinmec/",
];

const SERVICE_HREFS = [
  "/vie/chuyen-khoa/",
  "/vie/dich-vu-y-te/",
  "/vie/bao-hiem/",
  "/vi/booking",
];

export function Footer() {
  const t = useTranslations("footer");
  const pathname = usePathname();

  const isDashboardRoute = pathname?.includes("/admin") || pathname?.includes("/manager") || pathname?.includes("/doctor");
  if (isDashboardRoute) {
    return null;
  }
  const systemLinks = (t.raw("systemLinks") as string[]).map((label, i) => ({
    label,
    href: SYSTEM_HREFS[i] ?? "#",
  }));
  const serviceLinks = (t.raw("serviceLinks") as string[]).map((label, i) => ({
    label,
    href: SERVICE_HREFS[i] ?? "#",
  }));
  return (
    <footer className="bg-white border-t border-[#e8eef4]">
      {/* Main content */}
      <div className="max-w-277.5 mx-auto px-4 py-10">
        <div className="flex flex-wrap gap-6 justify-between">

          {/* Column 1: Hệ thống Vinmec */}
          <div className="min-w-35">
            <h3 className="font-bold text-[#1a2b4a] text-sm mb-3">{t("systemTitle")}</h3>
            <ul className="space-y-2">
              {systemLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-[#555] text-[13px] hover:text-[#0076c0] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Dịch vụ */}
          <div className="min-w-30">
            <h3 className="font-bold text-[#1a2b4a] text-sm mb-3">{t("serviceTitle")}</h3>
            <ul className="space-y-2">
              {serviceLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-[#555] text-[13px] hover:text-[#0076c0] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Tải App MyVinmec */}
          <div className="min-w-32">
            <h3 className="font-bold text-[#1a2b4a] text-sm mb-3">{t("appTitle")}</h3>
            <a href="/link/myvinmec" aria-label={t("appTitle")} target="_blank" rel="noopener noreferrer">
              <QRCode />
            </a>
          </div>

          {/* Column 4: Theo dõi + Đối tác liên kết */}
          <div className="min-w-32">
            <h3 className="font-bold text-[#1a2b4a] text-sm mb-3">{t("followTitle")}</h3>
            <div className="flex gap-2 mb-5">
              <a href="https://www.youtube.com/user/VinmecHospital" rel="nofollow" aria-label="Youtube" target="_blank">
                <YoutubeIcon />
              </a>
              <a href="https://www.facebook.com/Vinmec/" rel="nofollow" aria-label="Facebook" target="_blank">
                <FacebookIcon />
              </a>
            </div>

            <h3 className="font-bold text-[#1a2b4a] text-sm mb-3">{t("partnerTitle")}</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://yhoccongdong.com/" rel="nofollow" aria-label="Y học cộng đồng" target="_blank">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://www.vinmec.com/static/uploads/thumbnail_logoyhoccongdong_95d7749cb5.webp"
                    alt="Y học cộng đồng"
                    className="h-8 w-auto"
                    loading="lazy"
                  />
                </a>
              </li>
              <li>
                <a href="https://buoctiep.vn/" rel="nofollow" aria-label="Bước tiếp" target="_blank">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://www.vinmec.com/static/uploads/thumbnail_logobuoctiep_349cf1df38.webp"
                    alt="Bước tiếp"
                    className="h-8 w-auto"
                    loading="lazy"
                  />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Gov badges */}
          <div className="min-w-30 flex flex-col items-start gap-3">
            <h3 className="font-bold text-[#1a2b4a] text-sm mb-0 invisible">-</h3>
            <a
              href="http://online.gov.vn/Home/WebDetails/9966"
              rel="nofollow"
              aria-label="Đã thông báo bộ công thương"
              target="_blank"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://www.vinmec.com/static/uploads/logosalenoti_d40a0c287e.svg"
                alt="Đã thông báo bộ công thương"
                className="h-12 w-auto"
                loading="lazy"
              />
            </a>
            <a
              href="https://www.dmca.com/Protection/Status.aspx?ID=1a2cf8db-44e0-45a0-a35d-eb63c81dfc1f&refurl=https://www.vinmec.com/vie/"
              rel="nofollow"
              aria-label="DMCA"
              target="_blank"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://www.vinmec.com/static/uploads/dmca_premi_badge_4_fd4745ff55.png"
                alt="DMCA Protected"
                className="h-10 w-auto"
                loading="lazy"
              />
            </a>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#dfdede] bg-[#f3f7fb]">
        <div className="max-w-277.5 mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#828282] flex-wrap">
          <p>{t("copyright")}</p>
          <div className="flex gap-0 flex-wrap justify-center">
            <a
              href="/vie/bai-viet/chinh-sach-bao-ve-du-lieu-ca-nhan-cua-cong-ty-co-phan-benh-vien-da-khoa-quoc-te-vinmec"
              className="px-2.5 py-1 hover:text-[#0076c0] border-l border-[#828282] first:border-l-0 transition-colors"
            >
              {t("privacyPolicy")}
            </a>
            <a
              href="https://www.google.com/intl/en/policies/privacy/"
              rel="nofollow"
              className="px-2.5 py-1 hover:text-[#0076c0] border-l border-[#828282] transition-colors"
            >
              {t("grPrivacy")}
            </a>
            <a href="#" className="px-2.5 py-1 hover:text-[#0076c0] border-l border-[#828282] transition-colors">
              {t("grTerms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
