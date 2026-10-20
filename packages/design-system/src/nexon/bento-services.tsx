"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import {
  TrendingUp,
  Target,
  Handshake,
  Zap,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import type { NexonServicesContent } from "./types";

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Target,
  Handshake,
  Zap,
  Megaphone,
};

const spans = [
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
];

const glows = [
  "radial-gradient(ellipse 80% 60% at 20% 0%, rgba(19,62,216,0.35) 0%, transparent 70%)",
  "radial-gradient(ellipse 80% 60% at 80% 0%,  rgba(80,206,255,0.18) 0%, transparent 70%)",
  "radial-gradient(ellipse 80% 60% at 20% 0%, rgba(19,62,216,0.25) 0%, transparent 70%)",
  "radial-gradient(ellipse 80% 60% at 80% 0%,  rgba(80,206,255,0.15) 0%, transparent 70%)",
  "radial-gradient(ellipse 80% 60% at 20% 0%, rgba(19,62,216,0.28) 0%, transparent 70%)",
];

export function NexonBentoServices({ data }: { data: NexonServicesContent }) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="servicios" ref={ref} className="w-full py-24" style={{ background: "#111111" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <span
              className="text-xs font-semibold tracking-[0.3em] uppercase"
              style={{ color: "#50CEFF" }}
            >
              {data.label}
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              {data.heading}{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #133ED8 0%, #50CEFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {data.headingAccent}
              </span>
            </h2>
          </div>
          <p
            className="max-w-sm text-base leading-relaxed md:text-right"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {data.description}
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:auto-rows-[minmax(220px,auto)]">
          {data.services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? TrendingUp;
            const isLarge = i === 0;

            return (
              <article
                key={service.title}
                className={[
                  "group relative flex flex-col overflow-hidden rounded-2xl",
                  "transition-all duration-300 hover:-translate-y-1",
                  spans[i],
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
                ].join(" ")}
                style={{
                  background: "#0d0f1a",
                  border: "1px solid rgba(19,62,216,0.22)",
                  boxShadow: "0 4px 32px rgba(2,3,103,0.25)",
                  transitionDelay: `${i * 80}ms`,
                  transitionProperty: "opacity, transform, box-shadow",
                }}
              >
                {/* Glow */}
                <div
                  className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: glows[i] }}
                />
                {/* Border highlight on hover */}
                <div
                  className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(80,206,255,0.25)" }}
                />

                {/* ── Text section ── */}
                {isLarge ? (
                  /* Large card: icon stacked above title */
                  <div className="relative z-20 flex flex-col gap-3 p-6">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, #133ED8 0%, #50CEFF 100%)",
                        boxShadow: "0 4px 16px rgba(80,206,255,0.3)",
                      }}
                    >
                      <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-bold text-white">{service.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {service.description}
                    </p>
                  </div>
                ) : (
                  /* Small cards: icon inline with title */
                  <div className="relative z-20 flex flex-col gap-2 p-5">
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          background: "linear-gradient(135deg, #133ED8 0%, #50CEFF 100%)",
                          boxShadow: "0 4px 16px rgba(80,206,255,0.3)",
                        }}
                      >
                        <Icon className="h-4 w-4 text-white" strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold leading-snug text-white">{service.title}</h3>
                        <p className="mt-1 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Image section ── */}
                <div className={[
                  "relative w-full flex-1 overflow-hidden",
                  isLarge ? "min-h-[220px]" : "min-h-[140px]",
                ].join(" ")}>
                  {/* Top fade: image blends into card bg */}
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10"
                    style={{ background: "linear-gradient(to bottom, #0d0f1a, transparent)" }}
                  />
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : null}
                </div>

              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
