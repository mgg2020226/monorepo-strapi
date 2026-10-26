import type { ReactNode } from "react"

export type CaeMedia = { url?: string | null; alternativeText?: string | null }

export type CaeHomeData = {
  heroEyebrow?: string | null
  heroTitle?: string | null
  heroAccent?: string | null
  heroDescription?: string | null
  heroImage?: CaeMedia | null
  servicePickerLabel?: string | null
  servicePlaceholder?: string | null
  companySizeLabel?: string | null
  companySizePlaceholder?: string | null
  companySizes?: { id?: number; text?: string | null }[]
  ctaLabel?: string | null
  scrollLabel?: string | null
  advantagesEyebrow?: string | null
  advantagesTitle?: string | null
  advantages?: {
    id?: number
    title?: string | null
    description?: string | null
    icon?: string | null
  }[]
  servicesEyebrow?: string | null
  servicesTitle?: string | null
  servicesDescription?: string | null
  serviceCardLinkLabel?: string | null
  services?: {
    id?: number
    title?: string | null
    slug?: string | null
    category?: string | null
    description?: string | null
    icon?: string | null
    image?: CaeMedia | null
    featured?: boolean | null
  }[]
  processTitle?: string | null
  processEyebrow?: string | null
  processSteps?: {
    id?: number
    number?: string | null
    title?: string | null
  }[]
  aboutEyebrow?: string | null
  aboutTitle?: string | null
  aboutBody?: ReactNode
  valuesTitle?: string | null
  valuesEyebrow?: string | null
  values?: { id?: number; title?: string | null; icon?: string | null }[]
  teamTitle?: string | null
  teamEyebrow?: string | null
  team?: {
    id?: number
    name?: string | null
    position?: string | null
    area?: string | null
    summary?: string | null
    experience?: string | null
    specialties?: { id?: number; text?: string | null }[]
    photo?: CaeMedia | null
  }[]
  alliesTitle?: string | null
  alliesEyebrow?: string | null
  alliesDescription?: string | null
  allies?: {
    id?: number
    name?: string | null
    url?: string | null
    logo?: CaeMedia | null
    darkBackground?: boolean | null
  }[]
  contactTitle?: string | null
  contactEyebrow?: string | null
  contactDescription?: string | null
  contactCtaLabel?: string | null
}

export type CaeServiceData = {
  eyebrow?: string | null
  title?: string | null
  description?: string | null
  image?: CaeMedia | null
  body?: ReactNode
  itemsTitle?: string | null
  items?: { id?: number; text?: string | null }[]
  ctaLabel?: string | null
}

export type CaeContactData = {
  phone?: string | null
  whatsappPhone?: string | null
  whatsappEnabled?: boolean | null
  whatsappMessage?: string | null
  whatsappButtonLabel?: string | null
  email?: string | null
  address?: string | null
  whatsappHref?: string | null
}
