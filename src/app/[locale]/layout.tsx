import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileHUD } from "@/components/layout/MobileHUD";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Vinmec International Hospital",
    template: "%s | Vinmec",
  },
  description:
    "Hệ thống bệnh viện Vinmec – chăm sóc sức khỏe đẳng cấp quốc tế với đội ngũ chuyên gia hàng đầu và trang thiết bị hiện đại nhất.",
  icons: {
    icon: "/vinmec-logo.png",
    shortcut: "https://www.vinmec.com/static/uploads/Logo_Vinmec_System_c725c14ffd.png",
    apple: "https://www.vinmec.com/static/uploads/Logo_Vinmec_System_c725c14ffd.png",
  },
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "vi" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="pt-40">{children}</main>
          <Footer />
          <MobileHUD />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
