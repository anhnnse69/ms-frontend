import AchievementCard from "./AchievementCard";

interface YearBlockProps {
    year: number;
    items: { image: string; text: string }[];
    isLast?: boolean;
}

export default function YearBlock({ year, items }: YearBlockProps) {
    return (
        <div className="mb-12 flex flex-col md:flex-row md:items-start relative">
            <div className="absolute -left-8 top-2 flex flex-col items-center">
                <span className="bg-[#0076c0] text-white font-bold rounded-full w-14 h-14 flex items-center justify-center text-xl shadow-lg border-4 border-white">
                    {year}
                </span>
            </div>

            <div className="ml-16 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item, i) => (
                    <AchievementCard key={i} image={item.image} text={item.text} />
                ))}
            </div>
        </div>
    );
}
