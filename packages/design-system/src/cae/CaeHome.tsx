"use client"

import {
  Award,
  ArrowDown,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  Clock3,
  FileOutput,
  FileText,
  HeartHandshake,
  Monitor,
  MessageCircle,
  Network,
  Rocket,
  Scale,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react"
import { useMemo, useState } from "react"

import type { CaeContactData, CaeHomeData, CaeServiceData } from "./types"

function whatsappHref(phone: string | null | undefined, text: string) {
  const normalized = phone?.replaceAll(/\D/g, "")

  return normalized
    ? `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`
    : undefined
}

function getAdvantageIcon(
  icon?: string | null,
  title?: string | null
): LucideIcon {
  const key = `${icon ?? ""} ${title ?? ""}`.toLowerCase()
  if (/personal|atenci|acompa/.test(key)) return HeartHandshake
  if (/multidisciplin|equipo/.test(key)) return UsersRound
  if (/riesgo|control|cumplimiento/.test(key)) return ShieldCheck
  if (/año|experiencia|trayectoria/.test(key)) return Award
  if (/empresa|organiz/.test(key)) return Building2
  if (/gesti|estrateg|resultado/.test(key)) return ChartNoAxesCombined
  if (/asesor|consultor/.test(key)) return BriefcaseBusiness
  if (/tiempo|plazo/.test(key)) return Clock3

  return Check
}

function getServiceIcon(
  icon?: string | null,
  title?: string | null,
  category?: string | null
): LucideIcon {
  const key = `${icon ?? ""} ${title ?? ""} ${category ?? ""}`.toLowerCase()
  if (/ex[oó]gena|informaci[oó]n/.test(key)) return FileOutput
  if (/tribut|impuesto/.test(key)) return FileText
  if (/estrateg|innovaci/.test(key)) return Rocket
  if (/contab|outsourc|red|proces/.test(key)) return Network
  if (/legal|jur[ií]dic/.test(key)) return Scale
  if (/back.?office|administr/.test(key)) return Monitor
  if (/famil|gobierno/.test(key)) return UsersRound
  if (/auditor|revisor/.test(key)) return Search

  return BriefcaseBusiness
}

function getServiceCardVariant(
  item: NonNullable<CaeHomeData["services"]>[number]
) {
  const key =
    `${item.slug ?? ""} ${item.title ?? ""} ${item.category ?? ""}`.toLowerCase()

  return {
    featured: item.featured || /estrategia|innovaci/.test(key),
    wide: /revisoria|auditor[ií]a/.test(key),
    compact: /ex[oó]gena|back.?office|familias|gobierno/.test(key),
  }
}

export function CaeHome({
  data,
  contact,
  locale = "es",
}: {
  data: CaeHomeData
  contact: CaeContactData
  locale?: string
}) {
  const [service, setService] = useState("")
  const [companySize, setCompanySize] = useState("")
  const message = useMemo(() => {
    const selected = [service, companySize].filter(Boolean).join(" · ")

    return selected
      ? `Hola, quisiera solicitar una asesoría con CAE GROUP sobre ${selected}`
      : "Hola, quisiera solicitar una asesoría con CAE GROUP"
  }, [service, companySize])
  const whatsapp = whatsappHref(contact.whatsappPhone ?? contact.phone, message)
  const generalWhatsapp = whatsappHref(
    contact.whatsappPhone ?? contact.phone,
    "Hola, quisiera conocer más sobre los servicios de CAE GROUP."
  )
  const localPrefix = locale === "en" ? "/en" : ""
  const heroStyle = data.heroImage?.url
    ? { backgroundImage: `url("${data.heroImage.url}")` }
    : undefined

  return (
    <main className="cae-page" id="top">
      <div className="cae-shell">
        <section className="cae-hero" style={heroStyle}>
          <div className="cae-hero__veil" />
          <div className="cae-hero__content">
            {data.heroEyebrow && (
              <span className="cae-eyebrow">{data.heroEyebrow}</span>
            )}
            <h1>
              {data.heroTitle}{" "}
              {data.heroAccent && <span>{data.heroAccent}</span>}
            </h1>
            {data.heroDescription && <p>{data.heroDescription}</p>}
          </div>
          <div className="cae-hero__finder">
            <label>
              <span>{data.servicePickerLabel}</span>
              <select
                value={service}
                onChange={(event) => setService(event.target.value)}
              >
                <option value="">{data.servicePlaceholder}</option>
                {(data.services ?? [])
                  .filter((item) => item.title)
                  .map((item, index) => (
                    <option
                      key={`${item.slug}-${index}`}
                      value={item.title ?? ""}
                    >
                      {item.title}
                    </option>
                  ))}
              </select>
              <ChevronDown aria-hidden="true" />
            </label>
            <label>
              <span>{data.companySizeLabel}</span>
              <select
                value={companySize}
                onChange={(event) => setCompanySize(event.target.value)}
              >
                <option value="">{data.companySizePlaceholder}</option>
                {(data.companySizes ?? []).map((item, index) =>
                  item.text ? (
                    <option key={item.id ?? index} value={item.text}>
                      {item.text}
                    </option>
                  ) : null
                )}
              </select>
              <ChevronDown aria-hidden="true" />
            </label>
            {whatsapp ? (
              <a
                className="cae-button cae-hero__action"
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle /> {data.ctaLabel}
              </a>
            ) : (
              <span className="cae-button cae-hero__action cae-button--disabled">
                {data.ctaLabel}
              </span>
            )}
          </div>
          <a
            href="#servicios"
            className="cae-scroll-cue"
            aria-label={data.scrollLabel ?? "Ver servicios"}
          >
            <ArrowDown />
          </a>
        </section>

        {data.advantages?.length ? (
          <section className="cae-section cae-advantages">
            <div className="cae-section-heading">
              <span className="cae-eyebrow">{data.advantagesEyebrow}</span>
              <h2>{data.advantagesTitle}</h2>
            </div>
            <div className="cae-advantage-grid">
              {data.advantages.map((item, index) => {
                const Icon = getAdvantageIcon(item?.icon, item?.title)

                return (
                  <article className="cae-advantage" key={item.id ?? index}>
                    <span className="cae-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        ) : null}

        {data.services?.length ? (
          <section className="cae-section" id="servicios">
            <div className="cae-section-heading cae-section-heading--left">
              <span className="cae-eyebrow">{data.servicesEyebrow}</span>
              <h2>{data.servicesTitle}</h2>
              <p>{data.servicesDescription}</p>
            </div>
            <div className="cae-service-grid">
              {data.services.map((item, index) => {
                const { featured, wide, compact } = getServiceCardVariant(item)
                const Icon = getServiceIcon(
                  item.icon,
                  item.title,
                  item.category
                )
                const classes = [
                  "cae-service-card",
                  featured && "cae-service-card--featured",
                  wide && "cae-service-card--wide",
                  compact && "cae-service-card--compact",
                ]
                  .filter(Boolean)
                  .join(" ")

                return (
                  <a
                    className={classes}
                    key={item.id ?? item.slug ?? index}
                    href={`${localPrefix}/servicios/${item.slug ?? ""}`}
                  >
                    <span className="cae-service-card__icon">
                      <Icon aria-hidden="true" />
                    </span>
                    {wide && (
                      <ShieldCheck
                        className="cae-service-card__art"
                        aria-hidden="true"
                      />
                    )}
                    {!compact && (
                      <span className="cae-service-card__category">
                        {item.category}
                      </span>
                    )}
                    <h3>{item.title}</h3>
                    {!compact && <p>{item.description}</p>}
                    <span className="cae-service-card__link">
                      {compact ? "Ver más" : data.serviceCardLinkLabel}
                      <ArrowRight />
                    </span>
                  </a>
                )
              })}
            </div>
          </section>
        ) : null}

        {data.processSteps?.length ? (
          <section className="cae-section cae-process">
            <div className="cae-section-heading">
              <span className="cae-eyebrow">{data.processEyebrow}</span>
              <h2>{data.processTitle}</h2>
            </div>
            <div className="cae-process-grid">
              {data.processSteps.map((step, index) => (
                <article key={step.id ?? index}>
                  <span>
                    {step.number || String(index + 1).padStart(2, "0")}
                  </span>
                  <p>{step.title}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {data.aboutTitle || data.aboutBody ? (
          <section className="cae-section cae-about" id="nosotros">
            <div className="cae-about__mark">
              <Users />
            </div>
            <div>
              <span className="cae-eyebrow">{data.aboutEyebrow}</span>
              <h2>{data.aboutTitle}</h2>
              <div className="cae-richtext">{data.aboutBody}</div>
            </div>
          </section>
        ) : null}

        {data.values?.length ? (
          <section className="cae-section">
            <div className="cae-section-heading">
              <span className="cae-eyebrow">{data.valuesEyebrow}</span>
              <h2>{data.valuesTitle}</h2>
            </div>
            <div className="cae-value-grid">
              {data.values.map((item, index) => (
                <div key={item.id ?? index}>
                  <Check />
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {data.team?.length ? (
          <section className="cae-section" id="equipo">
            <div className="cae-section-heading">
              <span className="cae-eyebrow">{data.teamEyebrow}</span>
              <h2>{data.teamTitle}</h2>
            </div>
            <div className="cae-team-grid">
              {data.team.map((member, index) => (
                <article className="cae-team-card" key={member.id ?? index}>
                  <div className="cae-team-card__avatar">
                    {member.photo?.url ? (
                      <img
                        src={member.photo.url}
                        alt={member.photo.alternativeText || member.name || ""}
                      />
                    ) : (
                      <UserRound aria-hidden="true" />
                    )}
                  </div>
                  <span className="cae-team-card__area">{member.area}</span>
                  <h3>{member.name}</h3>
                  <p className="cae-team-card__position">{member.position}</p>
                  {member.area && (
                    <p className="cae-team-card__team">
                      <UsersRound aria-hidden="true" />
                      {member.area} y su equipo
                    </p>
                  )}
                  {member.summary && (
                    <p className="cae-team-card__summary">{member.summary}</p>
                  )}
                  {member.experience && <strong>{member.experience}</strong>}
                  {member.specialties?.length ? (
                    <ul>
                      {member.specialties.map((specialty, specialtyIndex) => (
                        <li key={specialty.id ?? specialtyIndex}>
                          {specialty.text}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {data.allies?.length ? (
          <section className="cae-section cae-allies">
            <div className="cae-section-heading">
              <span className="cae-eyebrow">{data.alliesEyebrow}</span>
              <h2>{data.alliesTitle}</h2>
              <p>
                {data.alliesDescription ||
                  "Trabajamos junto a aliados estratégicos que fortalecen nuestra propuesta de valor y amplían las soluciones que ofrecemos a nuestros clientes."}
              </p>
            </div>
            <div className="cae-allies__row">
              {data.allies.map((ally, index) => {
                const logo = (
                  <span
                    className={
                      ally.darkBackground
                        ? "cae-ally-logo cae-ally-logo--dark"
                        : "cae-ally-logo"
                    }
                  >
                    {ally.logo?.url ? (
                      <img
                        src={ally.logo.url}
                        alt={ally.logo.alternativeText || ally.name || ""}
                      />
                    ) : (
                      ally.name
                    )}
                  </span>
                )

                return ally.url ? (
                  <a
                    key={ally.id ?? index}
                    href={ally.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {logo}
                  </a>
                ) : (
                  <div key={ally.id ?? index}>{logo}</div>
                )
              })}
            </div>
          </section>
        ) : null}

        <section className="cae-contact" id="contacto">
          <span className="cae-eyebrow">{data.contactEyebrow}</span>
          <h2>{data.contactTitle}</h2>
          <p>{data.contactDescription}</p>
          {whatsapp && (
            <a
              className="cae-button cae-button--light"
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              {data.contactCtaLabel || "Escríbanos por WhatsApp"}
            </a>
          )}
          <div className="cae-contact__details">
            {contact.email && (
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            )}
            {contact.phone && (
              <a href={`tel:${contact.phone}`}>{contact.phone}</a>
            )}
            {contact.address && <span>{contact.address}</span>}
          </div>
        </section>
        {generalWhatsapp && (
          <a
            className="cae-whatsapp-float"
            href={generalWhatsapp}
            target="_blank"
            rel="noreferrer"
            aria-label="Escríbanos por WhatsApp"
          >
            <MessageCircle aria-hidden="true" />
            <span>WhatsApp</span>
          </a>
        )}
      </div>
    </main>
  )
}

export function CaeServiceDetail({
  data,
  contact,
}: {
  data: CaeServiceData
  contact: CaeContactData
}) {
  const href = whatsappHref(
    contact.whatsappPhone ?? contact.phone,
    `Hola, quisiera solicitar información sobre ${data.title ?? "un servicio"}`
  )

  return (
    <main className="cae-page">
      <div className="cae-shell">
        <section className="cae-service-hero">
          {data.image?.url && (
            <div className="cae-service-hero__image">
              <img
                src={data.image.url}
                alt={data.image.alternativeText || data.title || ""}
              />
            </div>
          )}
          <div>
            <span className="cae-eyebrow">{data.eyebrow}</span>
            <h1>{data.title}</h1>
            <p>{data.description}</p>
          </div>
        </section>
        <section className="cae-service-body">
          {data.body && <div className="cae-richtext">{data.body}</div>}
          {data.items?.length ? (
            <div>
              <h2>{data.itemsTitle}</h2>
              <ul className="cae-service-items">
                {data.items.map((item, index) => (
                  <li key={item.id ?? index}>
                    <Check />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {href && (
            <a
              className="cae-button"
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              {data.ctaLabel} <ArrowRight />
            </a>
          )}
        </section>
      </div>
    </main>
  )
}
