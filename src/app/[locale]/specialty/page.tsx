import { SpecialtyListBanner } from "@/components/page/specialty/SpecialtyListBanner";
import { SpecialtyListSection } from "@/components/page/specialty/SpecialtyListSection";

export default function SpecialtyListPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <SpecialtyListBanner />
            <SpecialtyListSection />
        </div>
    );
}
