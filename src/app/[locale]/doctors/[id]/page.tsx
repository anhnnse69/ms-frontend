import { DoctorProfileHeader } from "@/components/page/doctor-profile/DoctorProfileHeader";
import { DoctorIntroSection } from "@/components/page/doctor-profile/DoctorIntroSection";
import { DoctorInfoSidebar } from "@/components/page/doctor-profile/DoctorInfoSidebar";
import { DoctorReviews } from "@/components/page/doctor-profile/DoctorReviews";

interface DoctorProfilePageProps {
    params: Promise<{
        id: string;
        locale: string;
    }>;
}

export default async function DoctorProfilePage({ params }: DoctorProfilePageProps) {
    const { id, locale } = await params;
    
    return (
        <div className="min-h-screen bg-gray-50">
            <DoctorProfileHeader doctorId={id} locale={locale} />
            
            <div className="max-w-277.5 mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left column - Introduction & Reviews */}
                    <div className="flex-1 lg:w-7/12">
                        <DoctorIntroSection doctorId={id} locale={locale} />
                        <DoctorReviews doctorId={id} locale={locale} />
                    </div>
                    
                    {/* Right column - Info Sidebar */}
                    <div className="lg:w-5/12">
                        <DoctorInfoSidebar doctorId={id} locale={locale} />
                    </div>
                </div>
            </div>
        </div>
    );
}
