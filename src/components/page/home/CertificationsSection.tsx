"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const CERTS = [
  {
    src: "https://www.vinmec.com/static/uploads/HMA_85ca6faa4a.png",
    alt: "HMA - Hospital Management Asia",
  },
  {
    src: "https://www.vinmec.com/static/uploads/CAP_702e1fee75.jpg",
    alt: "CAP - College of American Pathologists",
  },
  {
    src: "https://www.vinmec.com/static/uploads/ACC_23c8e44638.jpg",
    alt: "ACC - American College of Cardiology",
  },
  {
    src: "https://www.vinmec.com/static/uploads/asian_fc80a62791.jpg",
    alt: "Deloitte - Best Managed Companies",
  },
  {
    src: "https://www.vinmec.com/static/uploads/AABB_489c63440a.jpg",
    alt: "AABB - Association for the Advancement of Blood & Biotherapies",
  },
  {
    src: "https://www.vinmec.com/static/uploads/Rtac_201e6adae4.jpg",
    alt: "RTAC - Reproductive Technology Accreditation Committee",
  },
  {
    src: "https://www.vinmec.com/static/uploads/jci_a2b22cbbfe.png",
    alt: "JCI - Joint Commission International",
  },
];

// ─── Carousel constants (mirrors Glide config) ────────────────────────────────
const ITEM_W = 120;  // px  — matches width: 120px in HTML
const GAP    = 60;   // px  — gap: 60 in Glide config
const STRIDE = ITEM_W + GAP; // 180px per step
const N      = CERTS.length; // 7

// Triple copy: [prev | main | next] for seamless infinite loop
// Start at index N so we can scroll backwards too
const ITEMS = [...CERTS, ...CERTS, ...CERTS];

export function CertificationsSection() {
  const t = useTranslations("certifications");
  const { locale } = useParams<{ locale: string }>();
  const base = `/${locale}`;

  // idx = index of the "focused/center" item inside ITEMS
  const [idx, setIdx] = useState(N);
  // instant = true → disable CSS transition for the silent reset jump
  const [instant, setInstant] = useState(false);

  // Advance by 1 item
  const next = useCallback(() => {
    setInstant(false);
    setIdx((i) => i + 1);
  }, []);

  // Autoplay every 2 s
  useEffect(() => {
    const id = setInterval(next, 2000);
    return () => clearInterval(id);
  }, [next]);

  // When idx reaches the third copy (N*2), silently jump back to same
  // visual position in the second copy — user sees no jump
  useEffect(() => {
    if (idx >= N * 2) {
      const id = setTimeout(() => {
        setInstant(true);   // disable transition
        setIdx((i) => i - N); // same visual, different array position
      }, 420); // wait for CSS transition (400ms) to finish
      return () => clearTimeout(id);
    }
  }, [idx]);

  // Re-enable transition one frame after the instant reset
  useEffect(() => {
    if (instant) {
      const id = setTimeout(() => setInstant(false), 50);
      return () => clearTimeout(id);
    }
  }, [instant]);

  // For focusAt:'center' with perView 3:
  //   visible items are [idx-1, idx, idx+1]
  //   → shift track so that (idx-1)'th item starts at x = 0
  const translateX = -(idx - 1) * STRIDE;

  // Visible window: 3 items + 2 gaps = 480px
  const viewportW = ITEM_W * 3 + GAP * 2; // 480px

  return (
    <section
      className="py-16 overflow-hidden bg-[#0076c0]"
      style={{
        backgroundImage: "url('https://www.vinmec.com/assets/images/bg_blue_home.jpg')",
        backgroundSize: "auto 100%",
        backgroundPosition: "right center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-10 items-center">

          {/* ── Left col: title + desc + viewmore ── */}
          <div className="w-full lg:w-1/2 shrink-0">
            <div className="mb-6">
              <h2
                className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight
                  relative inline-block pb-3
                  after:content-[''] after:absolute after:left-0 after:bottom-0
                  after:w-12 after:h-1 after:bg-white after:rounded-full"
              >
                {t("title")}
              </h2>
              <p className="text-white/75 text-sm leading-relaxed mt-4">
                {t("sectionDesc")}
              </p>
            </div>
            <Link
              href={`${base}/achievements`}
              className="inline-flex items-center gap-2 text-white font-semibold text-sm
                hover:text-white/80 transition-colors"
            >
              {t("viewMore")} →
            </Link>
          </div>

          {/* ── Right col: 3-per-view Glide-style carousel ── */}
          <div className="w-full lg:w-1/2 flex justify-center">
            {/* Clipping viewport — exactly 3 items wide */}
            <div
              className="overflow-hidden"
              style={{ width: `${viewportW}px`, maxWidth: "100%" }}
            >
              <div
                className="flex"
                style={{
                  gap: `${GAP}px`,
                  transform: `translate3d(${translateX}px, 0, 0)`,
                  transition: instant
                    ? "none"
                    : "transform 400ms cubic-bezier(0.165, 0.84, 0.44, 1)",
                }}
              >
                {ITEMS.map((cert, i) => {
                  const isActive = i === idx;
                  return (
                    <figure
                      key={i}
                      className={`shrink-0 bg-white rounded-lg flex items-center justify-center p-3
                        shadow-md transition-all duration-300
                        ${isActive ? "opacity-100 scale-105" : "opacity-60"}`}
                      style={{ width: `${ITEM_W}px`, height: `${ITEM_W}px` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        loading="lazy"
                        src={cert.src}
                        alt={cert.alt}
                        className="max-w-full max-h-full object-contain"
                      />
                    </figure>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
