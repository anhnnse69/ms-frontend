import { BookingBanner } from "@/components/page/booking/BookingBanner";
import { BookingForm } from "@/components/page/booking/BookingForm";

export default function BookingPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <BookingBanner />
            <BookingForm />
        </div>
    );
}
