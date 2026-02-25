import { HeroBanner } from "@/components/page/home/HeroBanner";
import { WhyChooseUs } from "@/components/page/home/WhyChooseUs";
import { ServicesSection } from "@/components/page/home/ServicesSection";
import { CertificationsSection } from "@/components/page/home/CertificationsSection";
import { PartnersSection } from "@/components/page/home/PartnersSection";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <WhyChooseUs />
      <CertificationsSection />
      <ServicesSection />
      <PartnersSection />
    </>
  );
}
