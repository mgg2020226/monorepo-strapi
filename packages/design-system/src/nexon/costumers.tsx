import { cn } from "@repo/design-system/utils"

import type { NexonCustomerLogosContent } from "./types"

export type Logo = {
  src: string
  alt: string
  width?: number
  height?: number
}

export function NexonCustomerLogos({
  data,
  className,
}: {
  data: NexonCustomerLogosContent
  className?: string
}) {
  const logos = data.logos.map((logo) => ({
    src: logo.imageUrl ?? "",
    alt: logo.name,
    height: 28,
  }))

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <h2 className="text-muted-foreground mb-10 text-center text-sm leading-tight font-medium uppercase md:mb-14 md:text-2xl">
        {data.title}
      </h2>
      <div
        className={cn("overflow-hidden rounded-2xl", className)}
        style={{
          background: "#0d0f1a",
          border: "1px solid rgba(19,62,216,0.25)",
        }}
      >
        <div className="flex flex-wrap justify-center">
          {logos
            .filter((logo) => logo.src)
            .map((logo, index) => (
              <LogoCard
                key={logo.alt}
                logo={logo}
                index={index}
                total={logos.length}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

type LogoCardProps = {
  logo: Logo
  index: number
  total: number
}

function LogoCard({ logo }: LogoCardProps) {
  return (
    <div
      className="relative flex w-1/2 items-center justify-center px-10 py-10 sm:w-1/3 md:w-1/4 md:px-16 md:py-12 lg:w-1/5"
      style={{
        borderRight: "1px solid rgba(19,62,216,0.15)",
        borderBottom: "1px solid rgba(19,62,216,0.15)",
      }}
    >
      <img
        alt={logo.alt}
        src={logo.src}
        className="pointer-events-none absolute inset-0 h-full w-full scale-75 object-contain opacity-70 brightness-0 invert transition-opacity duration-300 select-none hover:opacity-100"
      />
    </div>
  )
}
