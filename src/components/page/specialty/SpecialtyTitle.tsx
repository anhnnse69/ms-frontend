"use client";

interface SpecialtyTitleProps {
    children: React.ReactNode;
}

export function SpecialtyTitle({ children }: SpecialtyTitleProps) {
    return (
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-[#0076c0] text-center py-4 uppercase tracking-wide">
            {children}
        </h1>
    );
}
