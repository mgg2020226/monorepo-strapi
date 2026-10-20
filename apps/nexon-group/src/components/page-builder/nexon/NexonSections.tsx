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

export interface NexonStrapiComponent {
  id?: number
  __component?: string
  [key: string]: unknown
}

type RendererProps = { component: NexonStrapiComponent }

export function NexonHeroRenderer({ component }: RendererProps) {
  return <NexonHero data={component as unknown as NexonHeroContent} />
}

export function NexonCustomerLogosRenderer({ component }: RendererProps) {
  return (
    <NexonCustomerLogos
      data={component as unknown as NexonCustomerLogosContent}
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
            image: serviceImages[service.tag] ?? undefined,
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
            image: methodologyImages[step.number] ?? undefined,
          })) ?? [],
      }}
    />
  )
}

export function NexonAboutRenderer({ component }: RendererProps) {
  return <NexonAbout data={component as unknown as NexonAboutContent} />
}

export function NexonGrowthStoriesRenderer({ component }: RendererProps) {
  return (
    <NexonGrowthStories
      data={component as unknown as NexonGrowthStoriesContent}
    />
  )
}

export function NexonContactRenderer({ component }: RendererProps) {
  return <NexonContact data={component as unknown as NexonContactContent} />
}
