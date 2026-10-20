"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import {
  Search,
  BarChart2,
  Crosshair,
  Rocket,
  Target,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { NexonMethodologyContent } from "./types";

const iconMap: Record<string, LucideIcon> = {
  Search,
  BarChart2,
  Crosshair,
  Rocket,
  Target,
  TrendingUp,
  Users,
  Zap,
};

export function NexonMethodology({ data }: { data: NexonMethodologyContent }) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="metodologia" ref={ref} className="w-full bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16 text-center">
          <span
            className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "#133ED8" }}
          >
            {data.label}
          </span>
          <h2 className="mb-4 text-xl font-black tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
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
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-500">
            {data.description}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.steps.map((step, i) => {
            const Icon = iconMap[step.icon] ?? Search;
            return (
              <div
                key={step.number}
                className="flex flex-col items-center transition-all duration-500"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                {/* Number circle */}
                <div
                  className="relative z-10 mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white text-sm font-bold"
                  style={{ border: "2px solid #133ED8", color: "#133ED8" }}
                >
                  {step.number}
                </div>

                {/* Card */}
                <div
                  className="group flex w-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    border: "1px solid rgba(19,62,216,0.12)",
                    boxShadow: "0 2px 16px rgba(19,62,216,0.07)",
                  }}
                >
                  {/* Image */}
                  {step.image ? (
                    <div className="relative h-44 w-full overflow-hidden">
                      <img src={step.image} alt={step.title} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-[#F5F8FF] to-[#E8F4FF]">
                      <Icon className="h-16 w-16 text-[#133ED8]" />
                    </div>
                  )}

                  {/* Icon badge */}
                  <div className="flex justify-center" style={{ marginTop: "-20px" }}>
                    <div
                      className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md"
                      style={{ border: "1px solid rgba(19,62,216,0.15)" }}
                    >
                      <Icon className="h-5 w-5" style={{ color: "#133ED8" }} strokeWidth={2} />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="px-4 pb-5 pt-3 text-center">
                    <h3 className="mb-2 text-base font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom banner */}
        <div
          className={[
            "mt-12 flex flex-col items-start gap-6 rounded-2xl px-8 py-6 md:flex-row md:items-center md:justify-between",
            "transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          ].join(" ")}
          style={{
            border: "1px solid rgba(19,62,216,0.1)",
            transitionDelay: "500ms",
          }}
        >
          {/* Statement */}
          <div className="flex items-center gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ background: "linear-gradient(135deg, #133ED8 0%, #50CEFF 100%)" }}
            >
              <TrendingUp className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <p className="text-base font-semibold text-gray-800">
              {data.bannerStatement}
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #133ED8 0%, #50CEFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {data.bannerAccent}
              </span>
            </p>
          </div>

          {/* Divider */}
          <div
            className="hidden h-10 w-px md:block"
            style={{ background: "rgba(19,62,216,0.15)" }}
          />

          {/* Pillars */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            {data.pillars.map(({ icon, text }) => {
              const PillarIcon = iconMap[icon] ?? TrendingUp;
              return (
                <div key={text} className="flex items-center gap-2">
                  <PillarIcon
                    className="h-4 w-4 shrink-0"
                    style={{ color: "#133ED8" }}
                    strokeWidth={2}
                  />
                  <span className="text-sm font-medium text-gray-700">{text}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
