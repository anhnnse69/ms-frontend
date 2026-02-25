"use client";

import { useTranslations } from "next-intl";

const BASE = "https://www.vinmec.com/static/uploads/";

const PARTNERS = [
  { src: BASE + "thumbnail_astrazeneca_d3e3b4a691.webp", alt: "AstraZeneca" },
  { src: BASE + "thumbnail_ge_2aa8d688b3.webp",          alt: "GE Healthcare" },
  { src: BASE + "thumbnail_cleveland_be5a66bd7f.webp",   alt: "Cleveland Clinic" },
  { src: BASE + "thumbnail_roche_5cfeae900e.webp",       alt: "Roche" },
  { src: BASE + "thumbnail_metropolian_f201093066.webp", alt: "Osaka Metropolitan University" },
  { src: BASE + "thumbnail_SYDNEY_b7a1caf16e.webp",      alt: "University of Sydney" },
  { src: BASE + "thumbnail_macquarie_b78149953a.webp",   alt: "MacQuarie University" },
];

// Double the array so the CSS marquee loop is seamless
const TRACK = [...PARTNERS, ...PARTNERS];

export function PartnersSection() {
  const t = useTranslations("partners");

  return (
    <section className="py-14 bg-white border-t border-[#e8eef4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <h2
          className="text-2xl lg:text-3xl font-bold text-[#1a2b4a]
            relative inline-block pb-3
            after:content-[''] after:absolute after:left-0 after:bottom-0
            after:w-12 after:h-1 after:bg-[#51be9d] after:rounded-full"
        >
          {t("sectionTitle")}
        </h2>
      </div>

      {/* Full-width marquee track — marginRight on each item (not gap) so translateX(-50%) is exact */}
      <div className="marquee-track flex items-center">
        {TRACK.map((p, i) => (
          <figure
            key={i}
            className="shrink-0 bg-white rounded-xl border border-[#e8eef4] shadow-sm
              flex items-center justify-center p-4 hover:shadow-md hover:border-[#0076c0]
              transition-all duration-200"
            style={{ width: "200px", height: "120px", marginRight: "30px" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              src={p.src}
              alt={p.alt}
              className="max-w-full max-h-full object-contain"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
