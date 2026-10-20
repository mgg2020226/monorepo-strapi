export interface NexonNavLink {
  label: string
  href: string
}

export interface NexonHeroContent {
  heading: string
  headingAccent: string
  description: string
  ctaText: string
  ctaHref: string
  watermark?: string
  particleCount?: number
}

export interface NexonLogo {
  name: string
  assetKey: string
}

export interface NexonCustomerLogosContent {
  title: string
  logos: NexonLogo[]
}

export interface NexonService {
  icon: string
  image?: string
  title: string
  description: string
  tag: string
}

export interface NexonServicesContent {
  label: string
  heading: string
  headingAccent: string
  description: string
  services: NexonService[]
}

export interface NexonMethodStep {
  number: string
  icon: string
  image?: string
  title: string
  description: string
}

export interface NexonPillar {
  icon: string
  text: string
}

export interface NexonMethodologyContent {
  label: string
  heading: string
  headingAccent: string
  description: string
  bannerStatement: string
  bannerAccent: string
  steps: NexonMethodStep[]
  pillars: NexonPillar[]
}

export interface NexonAboutParagraph {
  text: string
  highlight?: string
  rest?: string
}

export interface NexonStat {
  icon: string
  value: string
  label: string
}

export interface NexonAboutContent {
  label: string
  heading: string
  headingAccent: string
  paragraphs: NexonAboutParagraph[]
  stats: NexonStat[]
  cardTitle?: string
  cardDescription?: string
}

export interface NexonGrowthStory {
  icon: string
  visual: string
  title: string
  description: string
  metric: string
  metricLabel: string
  link?: string
}

export interface NexonGrowthStoriesContent {
  label: string
  heading: string
  headingAccent: string
  description: string
  stories: NexonGrowthStory[]
}

export interface NexonContactContent {
  label: string
  heading: string
  description: string
  nameLabel: string
  namePlaceholder: string
  companyLabel: string
  companyPlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
  messageLabel: string
  messagePlaceholder: string
  submitLabel: string
  successMessage: string
  errorMessage?: string
  formActive?: boolean
  siteSlug: string
  formSlug: string
}

export interface NexonSectionProps<T> {
  data: T
}
