import { SustainabilityBanner } from "@/components/page/sustainability/SustainabilityBanner";
import { SustainabilityIntro } from "@/components/page/sustainability/SustainabilityIntro";
import { FeaturedNumbers } from "@/components/page/sustainability/FeaturedNumbers";
import { KeyTopics } from "@/components/page/sustainability/KeyTopics";

export default function SustainabilityPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <SustainabilityBanner />
            <SustainabilityIntro />
            <FeaturedNumbers />
            <KeyTopics />
        </div>
    );
}
