"use client";

import { useTranslations } from "next-intl";

export default function DoctorDashboardPage() {
  const t = useTranslations("common");

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {t("doctorDashboard")}
      </h1>
      <p className="text-gray-600">
        {t("doctorDashboardIntro")}
      </p>
    </div>
  );
}
