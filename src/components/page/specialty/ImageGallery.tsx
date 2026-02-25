"use client";

import { useRef, useCallback } from "react";

interface GalleryItem {
    small: string;
    medium?: string;
    alt?: string;
    aspectRatio?: string;
    imgAspectRatio?: string;
    href?: string;
    title?: string;
}

interface ImageGalleryProps {
    images: GalleryItem[];
    title?: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const slide = useCallback((direction: number) => {
        if (wrapperRef.current) {
            wrapperRef.current.scrollBy({ left: direction * 320, behavior: "smooth" });
        }
    }, []);

    if (images.length === 0) return null;

    return (
        <div className="relative my-8 py-4">
            {title && (
                <h2 className="text-lg font-semibold text-[#0076c0] mb-4">{title}</h2>
            )}
            <div className="relative">
                <div
                    className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
                    ref={wrapperRef}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className="shrink-0 w-70 md:w-87.5 overflow-hidden"
                        >
                            <a href={img.href || "#"} className="block">
                                <div 
                                    className="w-full overflow-hidden rounded-lg"
                                    style={img.aspectRatio ? { aspectRatio: img.aspectRatio } : { aspectRatio: '16/10' }}
                                >
                                    <picture>
                                        <source media="(max-width: 576px)" srcSet={img.small} />
                                        <source media="(max-width: 768px)" srcSet={img.small} />
                                        <source media="(min-width: 769px)" srcSet={img.medium || img.small} />
                                        <img
                                            loading="lazy"
                                            src={img.small}
                                            alt={img.alt || "Gallery item"}
                                            className="w-full h-full object-cover block"
                                        />
                                    </picture>
                                </div>
                            </a>
                            {img.title && (
                                <p className="mt-2 text-[14px] text-[#4d4c4c] line-clamp-2">{img.title}</p>
                            )}
                        </div>
                    ))}
                </div>
                {/* Navigation arrows */}
                <button
                    className="absolute top-1/2 -translate-y-1/2 -left-4 w-9 h-9 bg-white border border-gray-300 rounded-full flex items-center justify-center cursor-pointer shadow-md text-lg z-10 select-none transition-all hover:bg-[#0076c0] hover:text-white hover:border-[#0076c0]"
                    onClick={() => slide(-1)}
                    aria-label="Previous"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    className="absolute top-1/2 -translate-y-1/2 -right-4 w-9 h-9 bg-white border border-gray-300 rounded-full flex items-center justify-center cursor-pointer shadow-md text-lg z-10 select-none transition-all hover:bg-[#0076c0] hover:text-white hover:border-[#0076c0]"
                    onClick={() => slide(1)}
                    aria-label="Next"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
