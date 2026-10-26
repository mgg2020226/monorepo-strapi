"use client"

import { Menu, X } from "lucide-react"
import { useState } from "react"

function getCurrentYear() {
  const now = new Date()

  return now.getFullYear()
}

export type CaeNavLink = { label?: string | null; href?: string | null }

export function CaeHeader({
  logoUrl,
  logoAlt,
  links,
  ctaLabel,
  ctaHref,
}: {
  logoUrl?: string
  logoAlt: string
  links: CaeNavLink[]
  ctaLabel?: string
  ctaHref?: string
}) {
  const [open, setOpen] = useState(false)
  const navLinks = links.filter((item) => item.label && item.href)

  return (
    <header className="cae-header">
      <div className="cae-header__inner">
        <a className="cae-brand" href="/" aria-label={logoAlt}>
          {logoUrl ? (
            <img src={logoUrl} alt={logoAlt} />
          ) : (
            <span>{logoAlt}</span>
          )}
        </a>
        <nav className="cae-nav" aria-label="Navegación principal">
          {navLinks.map((link, index) => (
            <a key={`${link.href}-${index}`} href={link.href ?? "#"}>
              {link.label}
            </a>
          ))}
          {ctaHref && (
            <a className="cae-button cae-button--small" href={ctaHref}>
              {ctaLabel || "Hablemos"}
            </a>
          )}
        </nav>
        <button
          className="cae-menu-button"
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="cae-mobile-nav" aria-label="Navegación móvil">
          {navLinks.map((link, index) => (
            <a
              key={`${link.href}-${index}`}
              href={link.href ?? "#"}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {ctaHref && (
            <a
              className="cae-button"
              href={ctaHref}
              onClick={() => setOpen(false)}
            >
              {ctaLabel || "Hablemos"}
            </a>
          )}
        </nav>
      )}
    </header>
  )
}

export function CaeFooter({
  logoUrl,
  logoAlt,
  description,
  links,
  copyright,
  email,
  phone,
  address,
}: {
  logoUrl?: string
  logoAlt: string
  description?: string | null
  links: CaeNavLink[]
  copyright?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
}) {
  const year = getCurrentYear()

  return (
    <footer className="cae-footer">
      <div className="cae-footer__grid">
        <div>
          <a
            className="cae-brand cae-brand--footer"
            href="/"
            aria-label={logoAlt}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={logoAlt} />
            ) : (
              <span>{logoAlt}</span>
            )}
          </a>
          {description && (
            <p className="cae-footer__description">{description}</p>
          )}
        </div>
        <div>
          <h2>Enlaces</h2>
          <ul>
            {links
              .filter((item) => item.label && item.href)
              .map((item, index) => (
                <li key={`${item.href}-${index}`}>
                  <a href={item.href ?? "#"}>{item.label}</a>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h2>Contacto</h2>
          <ul>
            {email && (
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            )}
            {phone && (
              <li>
                <a href={`tel:${phone}`}>{phone}</a>
              </li>
            )}
            {address && <li>{address}</li>}
          </ul>
        </div>
      </div>
      <div className="cae-footer__bottom">
        {(copyright || "© {YEAR} CAE GROUP").replaceAll("{YEAR}", () =>
          String(year)
        )}
      </div>
    </footer>
  )
}
