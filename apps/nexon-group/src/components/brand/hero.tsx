import { Card } from "@repo/design-system/ui/card";
import { Button } from "@repo/design-system/ui/button";
import { MessageSquare } from "lucide-react";
import { HeroEffects } from "./hero-effects";
import type { NexonHeroContent } from "./types";

export function NexonHero({ data }: { data: NexonHeroContent }) {

  return (
    <section id="inicio" className="flex w-full overflow-x-hidden flex-col items-center justify-center">
      <div className="w-full p-2 md:h-screen">
        <Card
          data-hero-card
          className="relative w-full min-h-[60vh] md:h-full border-[#133ED8]/30 rounded-[32px] overflow-hidden shadow-2xl p-0 gap-0"
          style={{
            background: "linear-gradient(135deg, #06101f 0%, #080f2a 40%, #0b1540 70%, #0d1a55 100%)",
            "--mouse-x": "50%",
            "--mouse-y": "50%",
            boxShadow: "0 25px 60px rgba(2,3,103,0.5), 0 0 0 1px rgba(19,62,216,0.2)",
          } as React.CSSProperties}
        >
          {/* ── Visual layers ─────────────────────────────────────────── */}

          <div
            aria-hidden
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              backgroundSize: "40px 40px",
              backgroundImage:
                "linear-gradient(to right, rgba(80,206,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(80,206,255,0.04) 1px, transparent 1px)",
              maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            }}
          />

          <div
            aria-hidden
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(2,3,103,0.55) 0%, rgba(19,62,216,0.18) 50%, rgba(80,206,255,0.10) 100%)",
            }}
          />

          <div
            aria-hidden
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 60% at 100% 100%, rgba(80,206,255,0.18) 0%, rgba(19,62,216,0.08) 45%, transparent 70%)",
            }}
          />

          {/* Teal glow bottom-left — matches reference design */}
          <div
            aria-hidden
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 55% 45% at 15% 85%, rgba(19,120,200,0.45) 0%, rgba(10,60,140,0.20) 50%, transparent 75%)",
            }}
          />

          {/* Watermark */}
          <div
            aria-hidden
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none font-black leading-none whitespace-nowrap tracking-widest text-[100px] md:text-[160px] lg:text-[300px]"
            style={{
              color: "transparent",
              WebkitTextStroke: "1px rgba(80,206,255,0.18)",
            }}
          >
            {data.watermark ?? "NEXON"}
          </div>

          <HeroEffects particleCount={data.particleCount ?? 24} />

          {/* ── Clickable image hotspots → #servicios ─────────────── */}
          {[
            { label: "Estrategia",          top: "54%", left: "0%",   w: "14%", h: "12%" },
            { label: "Desarrollo Comercial", top: "68%", left: "22%",  w: "22%", h: "14%" },
            { label: "Crecimiento",          top: "46%", left: "70%",  w: "22%", h: "14%" },
            { label: "Alianza",              top: "62%", left: "88%",  w: "12%", h: "12%" },
          ].map(({ label, top, left, w, h }) => (
            <a
              key={label}
              href="#servicios"
              aria-label={`Ver servicio: ${label}`}
              className="absolute z-20 rounded-xl cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-[#50CEFF]/60 hover:bg-[#50CEFF]/10"
              style={{ top, left, width: w, height: h }}
            />
          ))}

          {/* ── Hero body ─────────────────────────────────────────────── */}
          <div className="relative z-30 flex flex-col h-full pt-20 md:pt-24 lg:pt-0 justify-start lg:justify-center">
            <div className="flex flex-col lg:flex-row lg:items-center px-10 md:px-16 lg:px-20 pb-12 pt-8 gap-8 lg:gap-16">

              {/* Left column — Headline */}
              <div className="flex flex-col gap-6 lg:w-[55%]">

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tight">
                  {data.heading.split("\n").map((line, index) => (
                    <span key={`${index}-${line}`}>
                      {line}
                      <br />
                    </span>
                  ))}
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
                </h1>
              </div>

              {/* Right column — Description + CTA */}
              <div className="flex flex-col gap-6 lg:w-[45%] lg:justify-center">
                <p
                  className="text-base md:text-lg leading-relaxed"
                  style={{ color: "rgba(255, 255, 255, 0.81)" }}
                >
                  {data.description}
                </p>

                <a href={data.ctaHref} rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="font-semibold px-6 h-11 gap-2 rounded-lg border-0 w-fit"
                    style={{
                      background: "linear-gradient(135deg, #020367 0%, #133ED8 55%, #50CEFF 100%)",
                      color: "#ffffff",
                      boxShadow: "0 6px 28px rgba(80,206,255,0.28)",
                    }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    {data.ctaText}
                  </Button>
                </a>
              </div>

            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
