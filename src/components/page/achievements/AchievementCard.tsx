import Image from "next/image";
import { useState } from "react";

const VINMEC_BASE_URL = "https://www.vinmec.com";
const PLACEHOLDER_IMG = `${VINMEC_BASE_URL}/static/uploads/news/placeholder.jpg`;

interface AchievementCardProps {
    image: string;
    text: string;
}

export default function AchievementCard({ image, text }: AchievementCardProps) {
    // Always use VINMEC_BASE_URL for all images
    const initialSrc = image.startsWith("http") ? image : `${VINMEC_BASE_URL}/static/uploads/news/${image.replace(/^.*\/(.*)$/, "$1")}`;
    const [imgSrc, setImgSrc] = useState(initialSrc);
    return (
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-4 items-center border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="shrink-0">
                <Image
                    src={imgSrc}
                    alt={text}
                    width={140}
                    height={100}
                    className="rounded-md object-cover border border-gray-200"
                    onError={() => setImgSrc(PLACEHOLDER_IMG)}
                />
            </div>
            <div className="text-gray-700 text-base font-medium text-center md:text-left">{text}</div>
        </div>
    );
}
