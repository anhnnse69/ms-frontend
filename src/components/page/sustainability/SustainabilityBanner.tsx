"use client";

const VINMEC_BASE_URL = "https://www.vinmec.com";

export function SustainabilityBanner() {
    return (
        <div className="w-full">
            <picture>
                <source
                    media="(max-width: 768px)"
                    srcSet={`${VINMEC_BASE_URL}/static/uploads/medium_anh_1_moi_b612967dee.jpg`}
                />
                <source
                    media="(min-width: 769px)"
                    srcSet={`${VINMEC_BASE_URL}/static/uploads/anh_1_moi_b612967dee.jpg`}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`${VINMEC_BASE_URL}/static/uploads/anh_1_moi_b612967dee.jpg`}
                    alt="Vinmec Sustainability"
                    className="w-full h-auto object-cover"
                    style={{ aspectRatio: "3840/1704" }}
                />
            </picture>
        </div>
    );
}
