"use client"

import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@repo/design-system/ui/button"

import type { NexonNavLink } from "./types"

function WhatsAppIcon({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 48 48"
      className={className}
    >
      <path
        fill="#fff"
        d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6	C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"
      />
      <path
        fill="#fff"
        d="M4.9,43.8c-0.1,0-0.3-0.1-0.4-0.1c-0.1-0.1-0.2-0.3-0.1-0.5L7,33.5c-1.6-2.9-2.5-6.2-2.5-9.6	C4.5,13.2,13.3,4.5,24,4.5c5.2,0,10.1,2,13.8,5.7c3.7,3.7,5.7,8.6,5.7,13.8c0,10.7-8.7,19.5-19.5,19.5c-3.2,0-6.3-0.8-9.1-2.3	L5,43.8C5,43.8,4.9,43.8,4.9,43.8z"
      />
      <path
        fill="#cfd8dc"
        d="M24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3	L4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5 M24,43L24,43L24,43 M24,43L24,43L24,43 M24,4L24,4C13,4,4,13,4,24	c0,3.4,0.8,6.7,2.5,9.6L3.9,43c-0.1,0.3,0,0.7,0.3,1c0.2,0.2,0.4,0.3,0.7,0.3c0.1,0,0.2,0,0.3,0l9.7-2.5c2.8,1.5,6,2.2,9.2,2.2	c11,0,20-9,20-20c0-5.3-2.1-10.4-5.8-14.1C34.4,6.1,29.4,4,24,4L24,4z"
      />
      <path
        fill="#40c351"
        d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8	l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"
      />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0	s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3	c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9	c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8	c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z"
        clipRule="evenodd"
      />
    </svg>
  )
}

interface HeroNavProps {
  links: NexonNavLink[]
  cta: string
  href: string
  logoLightUrl?: string
  logoDarkUrl?: string
  logoAlt?: string
}

function useScroll(threshold: number) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold)
    update()
    window.addEventListener("scroll", update, { passive: true })

    return () => window.removeEventListener("scroll", update)
  }, [threshold])

  return scrolled
}

export function NexonHeader({
  links,
  cta,
  href,
  logoLightUrl,
  logoDarkUrl,
  logoAlt = "Nexon Group",
}: HeroNavProps) {
  const [open, setOpen] = useState(false)
  const scrolled = useScroll(200)

  return (
    <nav
      className={`fixed inset-x-0 top-4 z-50 mx-auto w-full transition-all duration-300 lg:max-w-[calc(100%-4rem)] ${
        scrolled
          ? "rounded-lg border-b border-gray-200 bg-white/80 shadow-lg backdrop-blur-lg"
          : ""
      }`}
    >
      <div className="mx-auto px-6 lg:px-8">
        {/* Main bar */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a
            href="#inicio"
            className="flex-shrink-0 transition-opacity hover:opacity-80"
          >
            <img
              src={
                logoDarkUrl ??
                logoLightUrl ??
                (scrolled
                  ? "/nexon/logotipo_black.svg"
                  : "/nexon/logotipo_white.svg")
              }
              alt={logoAlt}
              width={120}
              height={40}
              className={`h-10 w-auto rounded-lg object-contain transition-opacity duration-300 ${
                scrolled ? "" : "brightness-0 invert"
              }`}
            />
          </a>

          {/* Desktop nav — centered absolutely */}
          <ul className="m-0 hidden list-none items-center gap-1 p-0 md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
            {links.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`block cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5 ${
                    scrolled
                      ? "hover:bg-blue/5 block text-gray-700 hover:bg-gray-100"
                      : ""
                  }`}
                  style={{
                    color: scrolled ? undefined : "rgba(252, 253, 253, 0.75)",
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden flex-shrink-0 md:flex"
          >
            <Button
              className="h-9 gap-2 rounded-lg border-0 px-4 text-sm font-semibold"
              style={{
                background: "linear-gradient(135deg, #133ED8 0%, #50CEFF 100%)",
                color: "#ffffff",
                boxShadow: "0 4px 20px rgba(80,206,255,0.30)",
              }}
            >
              <WhatsAppIcon className="h-8 w-8" />
              {cta}
            </Button>
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            className={`rounded-md p-2 transition-colors md:hidden ${
              scrolled ? "text-gray-700 hover:bg-gray-100" : "hover:bg-white/5"
            }`}
            style={{
              color: scrolled ? undefined : "rgba(253, 253, 253, 0.75)",
            }}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`overflow-hidden rounded-xl transition-all duration-300 ease-in-out md:hidden ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{
            background: "rgba(17,17,17,0.97)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="flex flex-col gap-1 px-4 py-4">
            {links.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-2.5 text-sm font-medium last:border-0"
                style={{ color: "rgba(255, 255, 255, 0.75)" }}
              >
                {item.label}
              </a>
            ))}
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-3 w-fit"
            >
              <Button
                className="h-9 w-fit gap-2 rounded-lg border-0 px-4 text-sm font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, #133ED8 0%, #50CEFF 100%)",
                  color: "#ffffff",
                }}
              >
                <WhatsAppIcon className="h-4 w-4" />
                {cta}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
