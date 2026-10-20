"use client";

import { useRef } from "react";
import { LazyMotion, m, domAnimation, useInView } from "framer-motion";
import {
  Store,
  Globe,
  Rocket,
  Megaphone,
  BarChart2,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import type { NexonGrowthStoriesContent } from "./types";

const iconMap: Record<string, LucideIcon> = {
  Store,
  Globe,
  Rocket,
  Megaphone,
  BarChart2,
  Handshake,
};

/* ── Module-scope static data ─────────────────────────────────────────── */

const EXPANSION_BARS = [30, 48, 42, 65, 82, 100];

const MARKET_DOTS = [
  1, 0, 1, 1, 0, 1, 0, 1, 1,
  0, 1, 0, 1, 1, 0, 1, 0, 1,
  1, 1, 0, 0, 1, 1, 0, 1, 0,
  0, 0, 1, 1, 0, 0, 1, 1, 1,
  1, 0, 1, 0, 1, 0, 1, 0, 1,
  0, 1, 1, 0, 1, 1, 0, 0, 1,
  1, 0, 0, 1, 0, 1, 1, 0, 0,
];

const MARKETING_LAYERS = [
  { d: "M15,10 L145,10 L115,44 L45,44 Z", fill: "rgba(19,62,216,0.55)",  lx: 64, ly: 8 },
  { d: "M45,50 L115,50 L98,84 L62,84 Z",  fill: "rgba(19,62,216,0.45)",  lx: 67, ly: 70 },
  { d: "M62,90 L98,90 L88,122 L72,122 Z", fill: "#50CEFF",               lx: 68, ly: 114 },
];

const INTELLIGENCE_BARS = [0.3, 0.55, 0.75, 0.9, 0.65, 1.0, 0.82];

const ALLIANCE_NODES = [
  { x: 80, y: 65, main: true },
  { x: 28, y: 22 },
  { x: 132, y: 22 },
  { x: 18, y: 85 },
  { x: 142, y: 85 },
  { x: 50, y: 120 },
  { x: 112, y: 120 },
];

/* ── Helpers ─────────────────────────────────────────────────────────── */

function useAnimRef() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });
  return { ref, inView };
}

/* ── 1. Expansión Comercial — bar chart grows up ─────────────────────── */

function VisualExpansion() {
  const { ref, inView } = useAnimRef();
  return (
    <svg ref={ref} viewBox="0 0 160 130" fill="none" className="w-full h-full">
      {EXPANSION_BARS.map((h, i) => (
        <m.rect
          key={h}
          x={8 + i * 24}
          width={17}
          rx={3}
          fill={i === 5 ? "#50CEFF" : `rgba(19,62,216,${0.35 + i * 0.1})`}
          initial={{ height: 0, y: 130 }}
          animate={inView ? { height: h, y: 130 - h } : { height: 0, y: 130 }}
          transition={{ duration: 0.55, delay: i * 0.07, ease: "easeOut", repeat: Infinity, repeatDelay: 1.8 }}
        />
      ))}
      <m.text
        x="108" y="17" fill="#50CEFF" fontSize="10" fontWeight="700"
        initial={{ opacity: 0, y: 4 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.3, repeat: Infinity, repeatDelay: 1.8 }}
      >
        +147%
      </m.text>
    </svg>
  );
}

/* ── 2. Nuevos Mercados — dots pop in ────────────────────────────────── */

function VisualMarkets() {
  const { ref, inView } = useAnimRef();
  return (
    <svg ref={ref} viewBox="0 0 160 130" fill="none" className="w-full h-full">
      {MARKET_DOTS.map((active, i) => {
        const col = i % 9;
        const row = Math.floor(i / 9);
        return (
          <m.circle
            key={`dot-${row}-${col}`}
            cx={10 + col * 15}
            cy={12 + row * 17}
            r={3}
            fill={
              active
                ? i % 4 === 0
                  ? "#50CEFF"
                  : "rgba(19,62,216,0.8)"
                : "rgba(255,255,255,0.07)"
            }
            initial={{ scale: 0.95, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.25, delay: i * 0.012, ease: "backOut", repeat: Infinity, repeatDelay: 2 }}
          />
        );
      })}
    </svg>
  );
}

/* ── 3. Startup — line draws itself ──────────────────────────────────── */

function VisualStartup() {
  const { ref, inView } = useAnimRef();
  return (
    <svg ref={ref} viewBox="0 0 160 130" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="vs-line" x1="10" y1="0" x2="152" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#133ED8" />
          <stop offset="100%" stopColor="#50CEFF" />
        </linearGradient>
      </defs>
      <m.path
        d="M10,118 C40,108 70,88 100,58 C120,38 140,18 152,8 L152,125 L10,125 Z"
        fill="rgba(19,62,216,0.12)"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
      />
      <m.path
        d="M10,118 C40,108 70,88 100,58 C120,38 140,18 152,8"
        stroke="url(#vs-line)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
      />
      <m.circle
        cx="152" cy="8" r="5" fill="#50CEFF"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 1.0, type: "spring", stiffness: 350, damping: 12, repeat: Infinity, repeatDelay: 2 }}
      />
      <m.circle
        cx="152" cy="8" r="5" fill="none" stroke="#50CEFF" strokeWidth="1.5"
        initial={{ scale: 1, opacity: 0.6 }}
        animate={inView ? { scale: 3, opacity: 0 } : {}}
        transition={{ delay: 1.1, duration: 0.8, ease: "easeOut", repeat: Infinity, repeatDelay: 2 }}
      />
      <m.text
        x="96" y="46" fill="#50CEFF" fontSize="9" fontWeight="700"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.9, duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
      >
        8x ARR
      </m.text>
    </svg>
  );
}

/* ── 4. Growth Marketing — funnel drops in layer by layer ────────────── */

function VisualMarketing() {
  const { ref, inView } = useAnimRef();
  return (
    <svg ref={ref} viewBox="0 0 160 130" fill="none" className="w-full h-full">
      {MARKETING_LAYERS.map((l, i) => (
        <m.path
          key={l.d}
          d={l.d}
          fill={l.fill}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={inView ? { opacity: 1, scaleY: 1 } : {}}
          transition={{ delay: i * 0.18, duration: 0.4, ease: "easeOut", repeat: Infinity, repeatDelay: 2.5 }}
          style={{ transformOrigin: `80px ${i === 0 ? "10px" : i === 1 ? "50px" : "90px"}` }}
        />
      ))}
      <m.text
        x="112" y="108" fill="#50CEFF" fontSize="13" fontWeight="700"
        initial={{ opacity: 0, x: 6 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.7, duration: 0.35 }}
      >
        ×2
      </m.text>
      <text x="104" y="120" fill="rgba(255,255,255,0.35)" fontSize="7">conversiones</text>
    </svg>
  );
}

/* ── 5. Inteligencia de Negocios — KPI cards slide in, bars grow ─────── */

function VisualIntelligence() {
  const { ref, inView } = useAnimRef();
  return (
    <svg ref={ref} viewBox="0 0 160 130" fill="none" className="w-full h-full">
      <m.rect
        x="6" y="6" width="68" height="46" rx="5"
        fill="rgba(19,62,216,0.25)" stroke="rgba(80,206,255,0.25)" strokeWidth="1"
        initial={{ opacity: 0, x: -12 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.45, repeat: Infinity, repeatDelay: 2 }}
      />
      <m.text x="16" y="27" fill="#50CEFF" fontSize="15" fontWeight="800"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3, repeat: Infinity, repeatDelay: 2 }}
      >3.2x</m.text>
      <m.text x="12" y="43" fill="rgba(255,255,255,0.4)" fontSize="7"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.35, repeat: Infinity, repeatDelay: 2 }}
      >ROI Promedio</m.text>

      <m.rect
        x="82" y="6" width="72" height="46" rx="5"
        fill="rgba(19,62,216,0.25)" stroke="rgba(80,206,255,0.25)" strokeWidth="1"
        initial={{ opacity: 0, x: 12 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.45, delay: 0.1, repeat: Infinity, repeatDelay: 2 }}
      />
      <m.text x="94" y="27" fill="#50CEFF" fontSize="15" fontWeight="800"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.35, repeat: Infinity, repeatDelay: 2 }}
      >+68%</m.text>
      <m.text x="88" y="43" fill="rgba(255,255,255,0.4)" fontSize="7"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4, repeat: Infinity, repeatDelay: 2 }}
      >Eficiencia op.</m.text>

      <rect x="6" y="62" width="148" height="60" rx="5"
        fill="rgba(19,62,216,0.12)" stroke="rgba(80,206,255,0.15)" strokeWidth="1"
      />
      {INTELLIGENCE_BARS.map((v, i) => (
        <m.rect
          key={v}
          x={14 + i * 19}
          width={13}
          rx={2}
          fill={i === 5 ? "#50CEFF" : "rgba(19,62,216,0.65)"}
          initial={{ height: 0, y: 122 }}
          animate={inView ? { height: v * 48, y: 62 + 60 - v * 48 } : {}}
          transition={{ duration: 0.5, delay: 0.4 + i * 0.07, ease: "easeOut", repeat: Infinity, repeatDelay: 2 }}
        />
      ))}
    </svg>
  );
}

/* ── 6. Alianzas Estratégicas — spokes extend, nodes pop in ──────────── */

function VisualAlliances() {
  const { ref, inView } = useAnimRef();
  return (
    <svg ref={ref} viewBox="0 0 160 140" fill="none" className="w-full h-full">
      {ALLIANCE_NODES.slice(1).map((n, i) => (
        <m.line
          key={`spoke-${n.x}-${n.y}`}
          x1={80} y1={65} x2={n.x} y2={n.y}
          stroke="rgba(80,206,255,0.35)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.45, delay: 0.3 + i * 0.09, repeat: Infinity, repeatDelay: 2 }}
        />
      ))}
      {ALLIANCE_NODES.slice(1).map((n, i) => (
        <m.circle
          key={`node-${n.x}-${n.y}`}
          cx={n.x} cy={n.y} r={7}
          fill="rgba(19,62,216,0.5)"
          stroke="rgba(80,206,255,0.45)"
          strokeWidth="1.5"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: "spring", stiffness: 320, damping: 14, delay: 0.45 + i * 0.09, repeat: Infinity, repeatDelay: 2 }}
        />
      ))}
      <m.circle
        cx={80} cy={65} r={13}
        fill="#133ED8" stroke="#50CEFF" strokeWidth="1.5"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: "spring", stiffness: 280, damping: 12, delay: 0.15, repeat: Infinity, repeatDelay: 2 }}
      />
      <m.circle
        cx={80} cy={65} r={13}
        fill="none" stroke="#50CEFF" strokeWidth="1.5"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={inView ? { scale: 2.2, opacity: 0 } : {}}
        transition={{ delay: 0.8, duration: 0.7, ease: "easeOut", repeat: Infinity, repeatDelay: 2 }}
      />
    </svg>
  );
}

/* ── Visual registry ──────────────────────────────────────────────────── */

const visualMap: Record<string, React.ComponentType> = {
  expansion:    VisualExpansion,
  markets:      VisualMarkets,
  startup:      VisualStartup,
  marketing:    VisualMarketing,
  intelligence: VisualIntelligence,
  alliances:    VisualAlliances,
};

/* ── Main Component ──────────────────────────────────────────────────── */

export function NexonGrowthStories({ data }: { data: NexonGrowthStoriesContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <LazyMotion features={domAnimation}>
      <section ref={sectionRef} className="w-full py-24" style={{ background: "#111111" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <m.div
            className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: "#50CEFF" }}>
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
            <p className="max-w-sm text-base leading-relaxed md:text-right" style={{ color: "rgba(255,255,255,0.55)" }}>
              {data.description}
            </p>
          </m.div>

          {/* 2-column grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.stories.map((story, i) => {
              const Icon = iconMap[story.icon] ?? Store;
              const Visual = visualMap[story.visual];
              return (
                <m.article
                  key={story.title}
                  className="group relative flex overflow-hidden rounded-2xl"
                  style={{
                    background: "#0d0f1a",
                    border: "1px solid rgba(19,62,216,0.22)",
                    boxShadow: "0 4px 32px rgba(2,3,103,0.25)",
                    minHeight: "200px",
                  }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={sectionInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -4, boxShadow: "0 8px 40px rgba(2,3,103,0.4)" }}
                >
                  {/* Hover border glow */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ boxShadow: "inset 0 0 0 1px rgba(80,206,255,0.3)" }}
                  />

                  {/* Left: text content */}
                  <div className="relative z-10 flex flex-1 min-w-0 flex-col justify-between gap-4 p-6">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, #133ED8 0%, #50CEFF 100%)",
                        boxShadow: "0 4px 16px rgba(80,206,255,0.3)",
                      }}
                    >
                      <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                    </div>

                    <div className="flex flex-col gap-2">
                      <span
                        className="inline-flex w-fit items-baseline gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        style={{
                          background: "rgba(19,62,216,0.2)",
                          border: "1px solid rgba(80,206,255,0.2)",
                          color: "rgba(80,206,255,0.9)",
                        }}
                      >
                        <span className="text-sm font-black">{story.metric}</span>
                        <span>{story.metricLabel}</span>
                      </span>
                      <h3 className="text-xl font-bold text-white leading-tight">{story.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {story.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: SVG visualization */}
                  <div className="relative hidden sm:flex w-[42%] shrink-0 items-center justify-center overflow-hidden p-4">
                    <div
                      className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10"
                      style={{ background: "linear-gradient(to right, #0d0f1a, transparent)" }}
                    />
                    {Visual && <Visual />}
                  </div>
                </m.article>
              );
            })}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
