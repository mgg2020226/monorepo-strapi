import {
  NexonAbout,
  NexonBentoServices,
  NexonContact,
  NexonCustomerLogos,
  NexonGrowthStories,
  NexonHero,
  NexonMethodology,
  type NexonAboutContent,
  type NexonContactContent,
  type NexonCustomerLogosContent,
  type NexonGrowthStoriesContent,
  type NexonHeroContent,
  type NexonMethodologyContent,
  type NexonServicesContent,
} from "@repo/design-system/nexon"

import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"

export interface NexonStrapiComponent {
  id?: number
  __component?: string
  [key: string]: unknown
}

type RendererProps = { component: NexonStrapiComponent }

type StrapiMediaField =
  | string
  | null
  | undefined
  | {
      url?: string | null
      data?: null | {
        url?: string | null
        attributes?: { url?: string | null }
      }
    }

function mediaUrl(media: StrapiMediaField): string | undefined {
  const url =
    typeof media === "string"
      ? media
      : (media?.url ?? media?.data?.url ?? media?.data?.attributes?.url)

  return formatStrapiMediaUrl(url)
}

export function NexonHeroRenderer({ component }: RendererProps) {
  return <NexonHero data={component as unknown as NexonHeroContent} />
}

export function NexonCustomerLogosRenderer({ component }: RendererProps) {
  const data = component as unknown as NexonCustomerLogosContent & {
    logos?: { image?: StrapiMediaField; assetKey?: string }[]
  }

  return (
    <NexonCustomerLogos
      data={{
        ...data,
        logos: (data.logos ?? []).map((logo) => ({
          ...logo,
          imageUrl: mediaUrl(logo.image),
        })),
      }}
    />
  )
}

const serviceImages: Record<string, string> = {
  Estrategia: "/nexon/services/estrategia.png",
  Análisis: "/nexon/services/analisis.png",
  Negocios: "/nexon/services/negocios.png",
  Ventas: "/nexon/services/ventas.png",
  Marketing: "/nexon/services/marketing.png",
}

export function NexonBentoServicesRenderer({ component }: RendererProps) {
  const data = component as unknown as NexonServicesContent

  return (
    <NexonBentoServices
      data={{
        ...data,
        services:
          data.services?.map((service) => ({
            ...service,
            image:
              mediaUrl(
                (service as typeof service & { image?: StrapiMediaField }).image
              ) ??
              serviceImages[service.tag] ??
              undefined,
          })) ?? [],
      }}
    />
  )
}

const methodologyImages: Record<string, string> = {
  "01": "/nexon/methodology/entender.png",
  "02": "/nexon/methodology/identificar.png",
  "03": "/nexon/methodology/diseñar.png",
  "04": "/nexon/methodology/ejecuta.png",
  "05": "/nexon/methodology/resultados.png",
}

export function NexonMethodologyRenderer({ component }: RendererProps) {
  const data = component as unknown as NexonMethodologyContent

  return (
    <NexonMethodology
      data={{
        ...data,
        steps:
          data.steps?.map((step) => ({
            ...step,
            image:
              mediaUrl(
                (step as typeof step & { image?: StrapiMediaField }).image
              ) ??
              methodologyImages[step.number] ??
              undefined,
          })) ?? [],
      }}
    />
  )
}

export function NexonAboutRenderer({ component }: RendererProps) {
  const data = component as unknown as NexonAboutContent & {
    backgroundImage?: StrapiMediaField
  }

  return (
    <NexonAbout
      data={{ ...data, backgroundImage: mediaUrl(data.backgroundImage) }}
    />
  )
}

export function NexonGrowthStoriesRenderer({ component }: RendererProps) {
  const data = component as unknown as NexonGrowthStoriesContent & {
    stories?: { image?: StrapiMediaField }[]
  }

  return (
    <NexonGrowthStories
      data={{
        ...data,
        stories: (data.stories ?? []).map((story) => ({
          ...story,
          image: mediaUrl(story.image),
        })),
      }}
    />
  )
}

export function NexonContactRenderer({ component }: RendererProps) {
  return <NexonContact data={component as unknown as NexonContactContent} />
}
