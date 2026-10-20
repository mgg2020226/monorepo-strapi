"use client"

import { useInView } from "framer-motion"
import {
  Building2,
  BarChart3,
  Target,
  Globe2,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

import type { NexonAboutContent } from "./types"

const iconMap: Record<string, LucideIcon> = {
  Building2,
  BarChart3,
  Target,
  Globe2,
  TrendingUp,
}

function parseValue(raw: string): {
  prefix: string
  number: number
  suffix: string
} {
  const match = raw.match(/^([+-]?)(\d+)(%?)$/)
  if (!match) return { prefix: "", number: 0, suffix: raw }

  return {
    prefix: match[1] ?? "",
    number: Number(match[2] ?? "0"),
    suffix: match[3] ?? "",
  }
}

function StatCounter({ raw, visible }: { raw: string; visible: boolean }) {
  const { prefix, number, suffix } = parseValue(raw)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!visible || number === 0) return
    const duration = 1200
    const startTime = Date.now()
    let animationId: number

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const current = Math.round(number * progress)
      setCount(current)

      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [visible, number])

  if (number === 0) return <span>{raw}</span>

  return (
    <span>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}

export function NexonAbout({ data }: { data: NexonAboutContent }) {
  const ref = useRef<HTMLElement>(null)
  const visible = useInView(ref, { once: true, amount: 0.1 })
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!visible) return
    const left = leftRef.current
    const right = rightRef.current
    if (left) left.style.willChange = "opacity, transform"
    if (right) right.style.willChange = "opacity, transform"
    const clear = (el: HTMLElement) => (e: TransitionEvent) => {
      if (e.propertyName === "opacity") el.style.willChange = "auto"
    }
    const clearLeft = clear(left!)
    const clearRight = clear(right!)
    left?.addEventListener("transitionend", clearLeft)
    right?.addEventListener("transitionend", clearRight)

    return () => {
      left?.removeEventListener("transitionend", clearLeft)
      right?.removeEventListener("transitionend", clearRight)
    }
  }, [visible])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden py-24"
      style={{ contain: "layout style paint" }}
    >
      {/* Background image */}
      <img
        src={data.backgroundImage ?? "/nexon/backgrounds/backgrounds.png"}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(10,13,26,0.82)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* ── Left: text content ───────────────────────────────── */}
          <div
            ref={leftRef}
            className={`flex flex-col gap-8 transition-opacity transition-transform duration-700 ${
              visible ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"
            }`}
          >
            {/* Label */}
            <div className="flex flex-col gap-2">
              <span
                className="text-xs font-semibold tracking-[0.3em] uppercase"
                style={{ color: "#50CEFF" }}
              >
                {data.label}
              </span>
              <div
                className="h-0.5 w-10 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #133ED8, #50CEFF)",
                }}
              />
            </div>

            {/* Headline */}
            <h2 className="text-4xl leading-tight font-black tracking-tight text-white md:text-5xl lg:text-6xl">
              {data.heading.split("\n").map((line, i, arr) => (
                <span key={line}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #133ED8 0%, #50CEFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {data.headingAccent}
              </span>
            </h2>

            {/* Body paragraph */}
            {data.paragraphs.map((item, index) => (
              <p
                key={`${index}-${item.text}`}
                className="text-base leading-relaxed"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {item.text}

                {item.highlight && (
                  <span className="font-semibold" style={{ color: "#50CEFF" }}>
                    {item.highlight}
                  </span>
                )}

                {item.rest}
              </p>
            ))}
          </div>

          {/* ── Right: stats grid ────────────────────────────────── */}
          <div
            ref={rightRef}
            className={`grid grid-cols-2 gap-3 transition-opacity transition-transform delay-150 duration-700 ${
              visible ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
            }`}
          >
            {data.stats.map((stat) => {
              const Icon = iconMap[stat.icon] ?? Building2

              return (
                <div
                  key={stat.label}
                  className="flex flex-col gap-3 rounded-xl p-4 transition-transform duration-300 hover:-translate-y-0.5 active:scale-95 md:active:scale-100"
                  style={{
                    background: "rgba(19,62,216,0.08)",
                    border: "1px solid rgba(80,206,255,0.12)",
                    contain: "layout style paint",
                  }}
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: "rgba(19,62,216,0.2)" }}
                  >
                    <Icon
                      className="h-4 w-4"
                      style={{ color: "#50CEFF" }}
                      strokeWidth={1.8}
                    />
                  </div>
                  <div>
                    <p
                      className="text-2xl leading-none font-black tabular-nums"
                      style={{ color: "#50CEFF" }}
                    >
                      <StatCounter raw={stat.value} visible={visible} />
                    </p>
                    <p
                      className="mt-1 text-xs leading-snug"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
