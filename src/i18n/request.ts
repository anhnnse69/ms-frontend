import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const NAMESPACES = [
  "common",
  "nav",
  "hero",
  "whyChoose",
  "services",
  "certifications",
  "partners",
  "hospitals",
  "footer",
  "specialty",
  "booking",
  "doctors",
  "sustainability",
  "doctorProfile",
  "achievements",
  "patient",
] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "vi" | "en")) {
    locale = routing.defaultLocale;
  }

  const entries = await Promise.all(
    NAMESPACES.map(async (ns) => {
      const mod = await import(`./messages/${locale}/${ns}.json`);
      return [ns, mod.default] as const;
    })
  );

  return {
    locale,
    messages: Object.fromEntries(entries),
  };
});
