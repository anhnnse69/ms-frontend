import { DoctorsBanner } from "@/components/page/doctors/DoctorsBanner";
import { DoctorListSection } from "@/components/page/doctors/DoctorListSection";

export default function DoctorsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <DoctorsBanner />
            <DoctorListSection />
        </div>
    );
}
