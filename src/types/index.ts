export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface HeroSlide {
  tag: string;
  title: string;
  description: string;
  cta: string;
  image?: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  icon?: string;
}

export interface ServiceItem {
  name: string;
  icon: string;
  href?: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export type Locale = "vi" | "en";
