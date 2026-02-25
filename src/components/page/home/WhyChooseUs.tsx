import { useTranslations } from "next-intl";

const ICON_SRCS = [
  "https://www.vinmec.com/static/uploads/whyus_01_403f42a936.svg",
  "https://www.vinmec.com/static/uploads/whyus_02_2a57cb372f.svg",
  "https://www.vinmec.com/static/uploads/whyus_03_2f1c276a39.svg",
  "https://www.vinmec.com/static/uploads/whyus_01_403f42a936.svg",
];

export function WhyChooseUs() {
  const t = useTranslations("whyChoose");

  const cards = [0, 1, 2, 3].map((i) => ({
    title: t(`cards.${i}.title`),
    description: t(`cards.${i}.description`),
    iconSrc: ICON_SRCS[i],
  }));

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section header */}
        <div className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1a2b4a] relative inline-block pb-3
            after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-1 after:bg-[#51be9d] after:rounded-full">
            {t("title")}
          </h2>
        </div>

        {/* Two-column row */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left col (~42%) — thumbnail image */}
          <div className="w-full lg:w-[42%] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              src="https://www.vinmec.com/static/uploads/wepik_export_20230610051550k_Azj_1_1_de0e3052ea.png"
              alt="Why choose Vinmec"
              className="w-full rounded-xl object-cover"
            />
          </div>

          {/* Right col (~58%) — 2×2 items grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {cards.map((card, i) => (
              <div key={i} className="flex flex-col gap-3">
                {/* Icon */}
                <div className="w-14 h-14 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    loading="lazy"
                    src={card.iconSrc}
                    alt={card.title}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h3 className="font-bold text-[#1a2b4a] text-base">{card.title}</h3>
                <p className="text-sm text-[#555] leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
