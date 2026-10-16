"use client"

import type { Data } from "@repo/strapi-types"
import { useState } from "react"

import { StrapiBasicImage } from "@repo/sections/utilities/StrapiBasicImage"

export default function BeforeAfterSliderControl({
  component,
}: {
  component: Data.Component<"sections.before-after-slider">
}) {
  const [position, setPosition] = useState(50)

  return (
    <div className="bg-muted relative isolate aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
      <StrapiBasicImage
        component={component.afterImage}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 z-10 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <StrapiBasicImage
          component={component.beforeImage}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {component.beforeLabel && (
        <span className="bg-foreground/80 text-background absolute top-4 left-4 z-20 rounded-full px-3 py-1 text-xs font-semibold">
          {component.beforeLabel}
        </span>
      )}
      {component.afterLabel && (
        <span className="bg-foreground/80 text-background absolute top-4 right-4 z-20 rounded-full px-3 py-1 text-xs font-semibold">
          {component.afterLabel}
        </span>
      )}
      <div
        aria-hidden="true"
        className="bg-background pointer-events-none absolute inset-y-0 z-20 w-0.5 shadow"
        style={{ left: `${position}%` }}
      >
        <span className="bg-background text-foreground absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-lg">
          <span className="text-lg leading-none" aria-hidden="true">
            ↔
          </span>
        </span>
      </div>
      <input
        aria-label={component.sliderLabel ?? undefined}
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="absolute inset-0 z-30 h-full w-full cursor-col-resize opacity-0"
      />
    </div>
  )
}
