import {
  CaeHome,
  CaeServiceDetail,
  type CaeHomeData,
  type CaeServiceData,
} from "@/components/brand"
import CKEditorRenderer from "@repo/design-system/elementary/ck-editor"
import type { Data } from "@repo/strapi-types"

import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"

type MediaDetails = {
  url?: string | null
  alternativeText?: string | null
}

type MediaInput = MediaDetails & {
  data?: null | MediaDetails | { attributes?: MediaDetails | null }
}

type ComponentData = Record<string, unknown> & {
  id?: number
  aboutBody?: string | null
  body?: string | null
  heroImage?: MediaInput
  image?: MediaInput
  team?: (Record<string, unknown> & { photo?: MediaInput })[]
  services?: (Record<string, unknown> & { image?: MediaInput })[]
  allies?: (Record<string, unknown> & { logo?: MediaInput })[]
}

function getMedia(media?: MediaInput) {
  if (!media) return
  const nestedMedia: MediaDetails | null | undefined =
    media.data && "attributes" in media.data
      ? media.data.attributes
      : (media.data as MediaDetails | null | undefined)
  const url = media.url ?? nestedMedia?.url

  return {
    url: formatStrapiMediaUrl(url),
    alternativeText: media.alternativeText ?? nestedMedia?.alternativeText,
  }
}

function getContact(page: Data.ContentType<"api::page.page">) {
  const site = page.site as
    | Data.ContentType<"api::site.site">
    | null
    | undefined
  const whatsappButton = site?.whatsappButton
  const whatsappPhone = whatsappButton?.phone ?? site?.contactPhone

  return {
    phone: site?.contactPhone,
    whatsappPhone,
    whatsappEnabled: whatsappButton?.enabled === true && Boolean(whatsappPhone),
    whatsappMessage: whatsappButton?.message,
    whatsappButtonLabel: whatsappButton?.buttonLabel,
    email: site?.contactEmail,
    address: site?.address,
  }
}

export function CaeHomeRenderer({
  component,
  page,
  pageParams,
}: {
  component: ComponentData
  page: Data.ContentType<"api::page.page">
  pageParams?: { locale?: string }
}) {
  const data = {
    ...component,
    heroImage: getMedia(component.heroImage),
    services: component.services?.map((service) => ({
      ...service,
      image: getMedia(service.image),
    })),
    team: component.team?.map((member) => ({
      ...member,
      photo: getMedia(member.photo),
    })),
    allies: component.allies?.map((ally) => ({
      ...ally,
      logo: getMedia(ally.logo),
    })),
    aboutBody: component.aboutBody ? (
      <CKEditorRenderer htmlContent={component.aboutBody} />
    ) : null,
  } as unknown as CaeHomeData

  return (
    <CaeHome
      data={data}
      contact={getContact(page)}
      locale={pageParams?.locale}
    />
  )
}

export function CaeServiceRenderer({
  component,
  page,
}: {
  component: ComponentData
  page: Data.ContentType<"api::page.page">
}) {
  const data = {
    ...component,
    image: getMedia(component.image),
    body: component.body ? (
      <CKEditorRenderer htmlContent={component.body} />
    ) : null,
  } as unknown as CaeServiceData

  return <CaeServiceDetail data={data} contact={getContact(page)} />
}
