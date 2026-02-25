"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

// ─── Slide data ───────────────────────────────────────────────────────────────

const SLIDES = [
  {
    href: "https://www.vinmec.com/vie/bai-viet/the-dac-quyen-suc-khoe-vinmec-giai-phap-cham-soc-suc-khoe-toan-dien-cho-ca-nhan-va-gia-dinh",
    pcSrc: "https://www.vinmec.com/static/uploads/xlarge_banner_the_skdq_vmnt_trang_chu_desktop_b0438019b4.png",
    mbSrc: "https://www.vinmec.com/static/uploads/small_banner_the_skdq_vmnt_trang_chu_mobile_25d7b2a233.png",
  },
  {
    href: "https://www.vinmec.com/vie/bai-viet/lich-nghi-tet-am-lich-2026-cua-vinmec",
    pcSrc: "https://www.vinmec.com/static/uploads/xlarge_lich_hoat_dong_tet_2026_5444de412e.jpg",
    mbSrc: "https://www.vinmec.com/static/uploads/small_lich_nghi_tet_am_lich_2026_mobile_dc9ae7b1e4.png",
  },
  {
    href: "https://www.vinmec.com/vie/bai-viet/vinsmart-future-ra-mat-ky-thuat-phien-ban-trai-nghiem-som-sieu-ung-dung-mot-cham-v-app",
    pcSrc: "https://www.vinmec.com/static/uploads/xlarge_v_app_vingroup_website_811fa416f4.jpg",
    mbSrc: "https://www.vinmec.com/static/uploads/small_ung_dung_v_app_mobile_6f8e20d1f4.jpg",
  },
  {
    href: "https://www.vinmec.com/vie/bai-viet/uu-dai-chuyen-khoa-tieu-hoa-vinmec-chu-dong-tam-soat-an-tam-bao-ve-suc-khoe",
    pcSrc: "https://www.vinmec.com/static/uploads/xlarge_banner_trang_chu_desktop_tieu_hoa_quy_i_2026_923d75a643.jpg",
    mbSrc: "https://www.vinmec.com/static/uploads/small_banner_trang_chu_mobile_tieu_hoa_quy_i_2026_8da1edfcee.jpg",
  },
  {
    href: "https://www.vinmec.com/vie/ivf-vinmec-uom-mam-xanh-cham-lanh-hanh-phuc/",
    pcSrc: "https://www.vinmec.com/static/uploads/xlarge_banner_trang_chu_desktop_ivf_uom_mam_xanh_56b5d60b71.png",
    mbSrc: "https://www.vinmec.com/static/uploads/small_banner_trang_chu_mobile_ivf_uom_mam_xanh_1e6e2f2eb9.png",
  },
  {
    href: "https://www.vinmec.com/vie/bai-viet/vinmec-can-tho-chinh-thuc-ap-dung-kham-chua-benh-bhyt",
    pcSrc: "https://www.vinmec.com/static/uploads/xlarge_vinmec_can_tho_kham_tong_quat_bhyt_fa5b1f183b.jpg",
    mbSrc: "https://www.vinmec.com/static/uploads/small_vinmec_can_tho_bhyt_e506ee41ea.jpg",
  },
  {
    href: "https://www.vinmec.com/vie/san-pham-dich-vu/vinnest-dich-vu-o-cu-toan-dien",
    pcSrc: "https://www.vinmec.com/static/uploads/xlarge_4000x1470_O_cu_4fd209e27d.jpg",
    mbSrc: "https://www.vinmec.com/static/uploads/small_2400x2400_O_cu_9dccea2ddf.jpg",
  },
  {
    href: "https://www.vinmec.com/vie/bai-viet/tam-soat-tim-mach-som-can-thiep-kip-thoi-an-tam-song-khoe-cung-vinmec",
    pcSrc: "https://www.vinmec.com/static/uploads/xlarge_banner_trang_chu_desktop_ct_tim_mach_quy_1_2026_2c73d5139f.png",
    mbSrc: "https://www.vinmec.com/static/uploads/small_banner_trang_chu_mobile_ct_tim_mach_quy_1_2026_7b7fa4c920.png",
  },
  {
    href: "https://www.vinmec.com/vie/bai-viet/vi-sao-can-tiem-vac-xin-cum-dinh-ky-hang-nam-vi",
    pcSrc: "https://www.vinmec.com/static/uploads/xlarge_banner_trang_chu_desktop_vaccine_b6dc7aef91.png",
    mbSrc: "https://www.vinmec.com/static/uploads/small_banner_trang_chu_mobile_vaccine_fb09e4bfd8.png",
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function PhoneIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21L8.4 10.5a11.1 11.1 0 0 0 5.1 5.1l1.113-1.824a1 1 0 0 1 1.21-.502l4.493 1.498A1 1 0 0 1 21 15.72V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
    </svg>
  );
}

function DoctorIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroBanner() {
  const t = useTranslations("hero");
  const tCommon = useTranslations("common");
  const { locale } = useParams<{ locale: string }>();
  const base = `/${locale}`;

  const [current, setCurrent] = useState(0);

  const goNext = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const id = setInterval(goNext, 5000);
    return () => clearInterval(id);
  }, [goNext]);

  const ctaItems = [
    {
      icon: <PhoneIcon />,
      href: "#modal-call",
      title: tCommon("callHotline"),
      desc: t("quickActionCallDesc"),
    },
    {
      icon: <CalendarIcon />,
      href: `${base}/booking`,
      title: tCommon("bookAppointment"),
      desc: t("quickActionBookDesc"),
    },
    {
      icon: <DoctorIcon />,
      href: `${base}/doctors`,
      title: tCommon("findDoctor"),
      desc: t("quickActionDoctorDesc"),
    },
  ];

  return (
    <section>
      {/* ── Image slider ── */}
      <div className="relative overflow-hidden w-full">

        {/* Slide track */}
        <div
          className="flex"
          style={{
            transform: `translate3d(-${current * 100}%, 0, 0)`,
            transition: "transform 400ms cubic-bezier(0.165, 0.84, 0.44, 1)",
          }}
        >
          {SLIDES.map((slide, i) => (
            <a
              key={i}
              href={slide.href}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-full shrink-0 block"
              tabIndex={i === current ? 0 : -1}
            >
              {/*
                Fixed aspect-ratio wrapper: every slide renders at the same
                height. Images fill the box with object-cover so no gaps appear.
                Desktop ~ 4000×1470 ≈ 400/147. Mobile images are near-square.
              */}
              <div className="relative w-full aspect-4/3 md:aspect-400/147">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.pcSrc}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover hidden md:block"
                  loading={i === 0 ? "eager" : "lazy"}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.mbSrc}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover block md:hidden"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            </a>
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/20 to-transparent pointer-events-none" />

        {/* Title + viewmore — positioned above the dots */}
        <div className="absolute inset-0 flex flex-col justify-end pb-12 sm:pb-14 px-6 sm:px-10 pointer-events-none">
          <div className="hidden sm:block">
            <h1 className="text-white font-bold text-2xl lg:text-[2.2rem] max-w-lg leading-snug drop-shadow-lg mb-4">
              {t("slides.0.title")}
            </h1>
            <Link
              href={`${base}/tam-nhin-va-su-menh/`}
              className="pointer-events-auto inline-block border border-white/80 text-white text-sm font-medium
                px-7 py-2.5 rounded-full hover:bg-white hover:text-[#0076c0] transition-colors"
            >
              {t("viewMore")}
            </Link>
          </div>
        </div>

        {/* Bullet dots — at the bottom edge of the image, below the title */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── CTA bar — separate block below the image, never overlaps dots ── */}
      <div className="grid grid-cols-3 divide-x divide-white/20 bg-[#0076c0]">
        {ctaItems.map((item, i) => {
          const className = "flex items-start gap-3 px-4 sm:px-6 py-4 sm:py-5 hover:bg-[#005a91] transition-colors group";
          const content = (
            <>
              <div className="shrink-0 text-white/80 group-hover:text-white transition-colors mt-0.5">
                {item.icon}
              </div>
              <div className="hidden sm:block">
                <div className="text-white font-semibold text-sm leading-tight">
                  {item.title}
                </div>
                <div className="text-white/70 text-xs mt-1 leading-snug">
                  {item.desc}
                </div>
              </div>
              <div className="block sm:hidden">
                <div className="text-white font-semibold text-xs leading-tight">
                  {item.title}
                </div>
              </div>
            </>
          );

          // Use Link for internal routes, anchor for modal/external
          if (item.href.startsWith("#")) {
            return (
              <a key={i} href={item.href} className={className}>
                {content}
              </a>
            );
          }

          return (
            <Link key={i} href={item.href} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
