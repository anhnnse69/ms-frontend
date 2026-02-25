"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const BASE = "https://www.vinmec.com/static/uploads/";

const HOSPITALS = [
  {
    name: "Bệnh viện Đa khoa Vinmec Hạ Long",
    largeSrc: BASE + "small_6_VMHL_1_9552951ee3.jpg",
    thumbSrc: BASE + "thumbnail_6_VMHL_1_9552951ee3.jpg",
  },
  {
    name: "Bệnh viện Đa khoa Quốc tế Vinmec Central Park",
    largeSrc: BASE + "small_2_VMCP_5543aa8f2d.jpg",
    thumbSrc: BASE + "thumbnail_2_VMCP_5543aa8f2d.jpg",
  },
  {
    name: "Bệnh viện Đa khoa Quốc tế Vinmec Times City",
    largeSrc: BASE + "small_1_VMTC_b8013944f8.jpg",
    thumbSrc: BASE + "thumbnail_1_VMTC_b8013944f8.jpg",
  },
  {
    name: "Bệnh viện Đa khoa Vinmec Hải Phòng",
    largeSrc: BASE + "small_VMHP_9c29ddb6d1.jpg",
    thumbSrc: BASE + "thumbnail_VMHP_9c29ddb6d1.jpg",
  },
  {
    name: "Bệnh viện Đa khoa Vinmec Đà Nẵng",
    largeSrc: BASE + "small_5_VMDN_21c250c4c8.jpg",
    thumbSrc: BASE + "thumbnail_5_VMDN_21c250c4c8.jpg",
  },
  {
    name: "Bệnh viện Đa khoa Vinmec Nha Trang",
    largeSrc: BASE + "small_7_VMNT_eae2af37ce.jpg",
    thumbSrc: BASE + "thumbnail_7_VMNT_eae2af37ce.jpg",
  },
  {
    name: "Bệnh viện Đa khoa Vinmec Phú Quốc",
    largeSrc: BASE + "small_8_VMPQ_8b5b0e2313.jpg",
    thumbSrc: BASE + "thumbnail_8_VMPQ_8b5b0e2313.jpg",
  },
];

// ── Thumbnail carousel constants (mirrors Glide: perView 3, gap 32) ──────────
const THUMB_W   = 160;  // px
const THUMB_GAP = 32;   // px
const THUMB_STRIDE = THUMB_W + THUMB_GAP; // 192 px
const N = HOSPITALS.length; // 7

// Triple copy for seamless infinite loop
const ITEMS = [...HOSPITALS, ...HOSPITALS, ...HOSPITALS];

export function ServicesSection() {
  const t = useTranslations("services");
  const { locale } = useParams<{ locale: string }>();
  const base = `/${locale}`;

  // Shared index: drives both large + thumbnail carousels
  const [idx, setIdx] = useState(N); // start at middle copy
  const [instant, setInstant] = useState(false);

  const next = useCallback(() => {
    setInstant(false);
    setIdx((i) => i + 1);
  }, []);

  const prev = useCallback(() => {
    setInstant(false);
    setIdx((i) => i - 1);
  }, []);

  // Autoplay every 2 s
  useEffect(() => {
    const id = setInterval(next, 2000);
    return () => clearInterval(id);
  }, [next]);

  // Right boundary: silently jump back to middle copy
  useEffect(() => {
    if (idx >= N * 2) {
      const id = setTimeout(() => {
        setInstant(true);
        setIdx((i) => i - N);
      }, 420);
      return () => clearTimeout(id);
    }
  }, [idx]);

  // Left boundary: silently jump forward to middle copy
  useEffect(() => {
    if (idx < N) {
      const id = setTimeout(() => {
        setInstant(true);
        setIdx((i) => i + N);
      }, 420);
      return () => clearTimeout(id);
    }
  }, [idx]);

  // Re-enable transition one frame after instant reset
  useEffect(() => {
    if (instant) {
      const id = setTimeout(() => setInstant(false), 50);
      return () => clearTimeout(id);
    }
  }, [instant]);

  const activeHospitalIdx = idx % N;
  const transition = instant
    ? "none"
    : "transform 400ms cubic-bezier(0.165, 0.84, 0.44, 1)";

  // focusAt: center → left neighbor of active starts at x=0
  const thumbTranslateX = -(idx - 1) * THUMB_STRIDE;
  const thumbViewportW  = THUMB_W * 3 + THUMB_GAP * 2; // 544 px

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">

          {/* ── Left col: large image crossfade carousel ── */}
          <div className="w-full lg:w-1/2 shrink-0">
            <div
              className="relative w-full overflow-hidden rounded-xl"
              style={{ aspectRatio: "510 / 340" }}
            >
              {HOSPITALS.map((h, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={h.largeSrc}
                  alt={h.name}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500
                    ${i === activeHospitalIdx ? "opacity-100" : "opacity-0"}`}
                />
              ))}

              {/* Prev / Next arrows */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10
                  bg-white/80 hover:bg-white rounded-full w-9 h-9
                  flex items-center justify-center shadow text-xl font-bold text-[#0076c0]"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10
                  bg-white/80 hover:bg-white rounded-full w-9 h-9
                  flex items-center justify-center shadow text-xl font-bold text-[#0076c0]"
                aria-label="Next"
              >
                ›
              </button>
            </div>
          </div>

          {/* ── Right col: title + desc + thumbnail strip ── */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-6">
              <h2
                className="text-2xl lg:text-3xl font-bold text-[#1a2b4a] leading-tight
                  relative inline-block pb-3
                  after:content-[''] after:absolute after:left-0 after:bottom-0
                  after:w-12 after:h-1 after:bg-[#51be9d] after:rounded-full"
              >
                {t("sectionTitle")}
              </h2>
              <p className="text-[#555] text-sm leading-relaxed mt-4">
                {t("sectionDesc")}
              </p>
            </div>

            {/* Thumbnail strip — 3-per-view synced carousel */}
            <div
              className="overflow-hidden"
              style={{ width: `${thumbViewportW}px`, maxWidth: "100%" }}
            >
              <div
                className="flex"
                style={{
                  gap: `${THUMB_GAP}px`,
                  transform: `translate3d(${thumbTranslateX}px, 0, 0)`,
                  transition,
                }}
              >
                {ITEMS.map((h, i) => {
                  const isActive = i === idx;
                  return (
                    <figure
                      key={i}
                      className={`shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all duration-300
                        ${isActive ? "ring-2 ring-[#0076c0] opacity-100" : "opacity-55"}`}
                      style={{ width: `${THUMB_W}px`, height: `${Math.round(THUMB_W * 0.65)}px` }}
                      onClick={() => {
                        const mainIdx = i % N;
                        setInstant(false);
                        setIdx(N + mainIdx);
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        loading="lazy"
                        src={h.thumbSrc}
                        alt={h.name}
                        className="w-full h-full object-cover"
                      />
                    </figure>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* View more */}
        <div className="mt-8 text-center">
          <Link
            href={`${base}/co-so-y-te/`}
            className="inline-block border border-[#0076c0] text-[#0076c0] text-sm font-medium
              px-10 py-2.5 rounded-full hover:bg-[#0076c0] hover:text-white transition-colors"
          >
            {t("viewMore")}
          </Link>
        </div>
      </div>
    </section>
  );
}
