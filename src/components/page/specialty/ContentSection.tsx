"use client";

import { ReactNode } from "react";

interface ContentSectionImage {
    small: string;
    medium?: string;
    alt?: string;
    aspectRatio?: string;
    imgAspectRatio?: string;
}

interface ContentSectionProps {
    image: ContentSectionImage;
    reverse?: boolean;
    children: ReactNode;
}

export function ContentSection({ image, reverse = false, children }: ContentSectionProps) {
    return (
        <div
            className={`flex gap-6 mb-8 flex-col md:flex-row items-start ${reverse ? "md:flex-row-reverse" : ""}`}
        >
            <div
                className="w-full md:w-[45%] min-w-0 overflow-hidden rounded-lg shrink-0"
                style={image.aspectRatio ? { aspectRatio: image.aspectRatio } : undefined}
            >
                <picture>
                    <source media="(max-width: 576px)" srcSet={image.small} />
                    <source media="(max-width: 768px)" srcSet={image.small} />
                    <source media="(min-width: 769px)" srcSet={image.medium || image.small} />
                    <img
                        loading="lazy"
                        src={image.small}
                        alt={image.alt || ""}
                        className="w-full h-auto object-cover block rounded-lg"
                        style={image.imgAspectRatio ? { aspectRatio: image.imgAspectRatio } : undefined}
                    />
                </picture>
            </div>
            <div className="w-full md:w-[55%] min-w-0 [&_h2]:text-[#0076c0] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-0 [&_h3]:text-[#0076c0] [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_ul]:pl-5 [&_ul]:m-0 [&_ul]:list-disc [&_ul]:marker:text-[#0076c0] [&_li]:mb-1.5 [&_li]:leading-[1.7] [&_li]:text-[14px] [&_li]:text-[#4d4c4c] [&_p]:mb-3 [&_p]:leading-[1.7] [&_p]:text-[14px] [&_p]:text-[#4d4c4c] [&_strong]:text-[#0076c0] [&_strong]:font-semibold">
                {children}
            </div>
        </div>
    );
}
