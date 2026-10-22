interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface Image {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    [key: string]: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface FileAsset {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface HeroSlide {
  id: number;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  background_image?: Image;
  buttons?: Array<Button>;
}

export interface HeroSection {
  __component: "layout.hero-section";
  id: number;
  slides: HeroSlide[];
}

export interface NormaBannerSlide {
  id: number;
  title: string;
  description?: string;
  button?: Button;
}

export interface NormaBannerSection {
  __component: "layout.norma-banner";
  id: number;
  slides: NormaBannerSlide[];
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  is_active: boolean;
}
export interface ActionCardsSection {
  __component: "layout.action-cards";
  id: number;
  title?: string;
  description?: string;
  view_all_button?: Button;
  cards: ActionCard[];
}

export interface LinksSection {
  __component: "layout.link-section";
  id: number;
  title?: string;
  description?: string;
  view_all_button?: Button;
  links?: LinkCollection[];
}

export interface FAQSection {
  __component: "layout.faq-section";
  id: number;
  title?: string;
  description?: string;
  faqs?: FAQ[];
}

interface ServiciosSectionItem {
  id: number;
  title: string;
  description?: string;
  icon_name?: string;
  href: string;
  isExternal?: boolean;
}

export interface ServiciosSection {
  __component: "layout.servicios-section";
  id: number;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttons?: Button[];
  items?: ServiciosSectionItem[];
}

type HomepageComponent =
  | HeroSection
  | NormaBannerSection
  | ActionCardsSection
  | LinksSection
  | AboutSection
  | FAQSection
  | ImageCarouselSection
  | ServiciosSection;

interface ImageCarouselSection {
  __component: "layout.image-carousel";
  id: number;
  slides: CarouselSlide[];
}

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  image: Image;
  buttons: Button[];
}

export interface HomepageData {
  data: {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    homepage: HomepageComponent[];
  };
}

export type ContactChannelIcon = "phone" | "mail" | "map-pin";
export type ContactChannelType = "phone" | "email" | "address";

export interface ContactChannel {
  id: number;
  icon: ContactChannelIcon;
  label: string;
  type: ContactChannelType;
  value: string;
}

export interface ContactPageData {
  id: number;
  documentId: string;
  hero_eyebrow?: string;
  hero_title?: string;
  hero_description?: string;
  channels: ContactChannel[];
  map_address?: string;
  map_city?: string;
  map_url?: string;
}

export type ServicioType = "producto" | "tramite";
type BadgeColor = "green" | "blue" | "orange" | "gray";
type DeliverableAccent = "green" | "blue" | "orange" | "gray";

interface RequirementItem {
  id: number;
  text: string;
}

interface DeliverableItem {
  id: number;
  title: string;
  description?: string;
  accent: DeliverableAccent;
}

export interface ServicioItem {
  id: number;
  documentId?: string;
  title: string;
  short_description: string;
  full_description: string;
  icon_name?: string;
  category?: string;
  type: ServicioType;
  badge_label?: string;
  badge_color?: BadgeColor;
  estimated_days?: number;
  estimated_note?: string;
  action_label?: string;
  action_url?: string;
  map_address?: string;
  map_city?: string;
  map_url?: string;
  requirements?: RequirementItem[];
  deliverables?: DeliverableItem[];
  sort_order?: number;
}

export interface Button {
  id?: number;
  href: string;
  isExternal: boolean;
  label: string;
}

export interface ActionCard {
  id: number | string;
  title: string;
  description: string;
  featured?: boolean;
  accent?: boolean;
  button?: Button | null;
}

interface NavItemChild {
  isExternal: boolean;
  href: string;
  label: string;
  description?: string;
  icon_name?: string;
  featured?: boolean;
}

export interface NavItem {
  isExternal: boolean;
  href?: string;
  label: string;
  dropdown?: NavItemChild[];
}

export interface FooterLink {
  isExternal: boolean;
  href: string;
  label: string;
  type: string;
}

interface LinkCollection {
  id?: number;
  isExternal: boolean;
  href: string;
  label: string;
  description?: string;
  icon_name?: string;
}

interface AboutSection {
  __component: "layout.about-section";
  id: number;
  abouts: About[];
}

interface About {
  title: string;
  description: string;
  image: Image;
  button_url?: {
    href: string;
    label?: string;
    isExternal?: boolean;
    icon?: Image;
  }[];
}

export interface ThemeSettings {
  id: number;
  documentId: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  card: string;
  cardForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  warning: string;
  info: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
