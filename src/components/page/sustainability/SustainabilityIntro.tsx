"use client";

import { useTranslations } from "next-intl";

const VINMEC_BASE_URL = "https://www.vinmec.com";

export function SustainabilityIntro() {
    const t = useTranslations("sustainability");

    return (
        <section className="py-12 bg-white">
            <div className="max-w-300 mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Text Content */}
                    <div className="lg:w-7/12">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#0076c0] mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-[#0076c0]">
                            {t("title")}
                        </h2>
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                            <p className="text-justify">
                                {t("intro.paragraph1")}
                            </p>
                            <p className="text-justify">
                                {t("intro.paragraph2")}
                            </p>
                            <p className="text-justify">
                                {t("intro.paragraph3")}
                            </p>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="lg:w-5/12">
                        <picture>
                            <source
                                media="(max-width: 768px)"
                                srcSet={`${VINMEC_BASE_URL}/static/uploads/medium_v3_dbf73f5f29.jpg`}
                            />
                            <source
                                media="(min-width: 769px)"
                                srcSet={`${VINMEC_BASE_URL}/static/uploads/large_v3_dbf73f5f29.jpg`}
                            />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`${VINMEC_BASE_URL}/static/uploads/large_v3_dbf73f5f29.jpg`}
                                alt={t("title")}
                                className="w-full h-auto rounded-lg shadow-lg"
                                style={{ aspectRatio: "111/156" }}
                            />
                        </picture>
                    </div>
                </div>
            </div>
        </section>
    );
}
