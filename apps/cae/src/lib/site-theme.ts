import type { Data } from "@repo/strapi-types"
import type { CSSProperties } from "react"

type SitePalette = Data.Component<"site.palette"> | null | undefined

export type SiteThemeStyle = CSSProperties & Record<`--${string}`, string>

const COLOR_TOKEN_NAMES = {
  primary: "primary",
  secondary: "secondary",
  accent: "accent",
  background: "background",
  foreground: "foreground",
  muted: "muted",
  border: "border",
  destructive: "destructive",
} as const

const HEX_COLOR = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i
const NAMED_COLOR = /^[a-z]{3,24}$/i
const FUNCTION_COLOR = /^([a-z]+)\(([\da-z.%\s,+\-/]+)\)$/i
const CSS_COLOR_FUNCTIONS = new Set([
  "rgb",
  "rgba",
  "hsl",
  "hsla",
  "hwb",
  "lab",
  "lch",
  "oklab",
  "oklch",
  "color",
])

function safeColor(value: string | null | undefined) {
  const normalized = value?.trim()
  if (!normalized) return

  const functionName = normalized.match(FUNCTION_COLOR)?.[1]?.toLowerCase()
  const isValid =
    HEX_COLOR.test(normalized) ||
    NAMED_COLOR.test(normalized) ||
    (functionName != null && CSS_COLOR_FUNCTIONS.has(functionName))

  return isValid ? normalized : undefined
}

function parseRgb(value: string): [number, number, number] | undefined {
  const hex = value.match(/^#([\da-f]{3,8})$/i)?.[1]
  if (hex) {
    if (hex.length === 3 || hex.length === 4) {
      return hex
        .slice(0, 3)
        .split("")
        .map((channel) => Number.parseInt(channel + channel, 16)) as [
        number,
        number,
        number,
      ]
    }
    if (hex.length === 6 || hex.length === 8) {
      return [0, 2, 4].map((offset) =>
        Number.parseInt(hex.slice(offset, offset + 2), 16)
      ) as [number, number, number]
    }
  }

  if (value.toLowerCase() === "black") return [0, 0, 0]
  if (value.toLowerCase() === "white") return [255, 255, 255]

  const rgb = value.match(/^rgba?\(([^)]+)\)$/i)?.[1]
  if (!rgb) return undefined

  const channels = (rgb.includes("/") ? rgb.slice(0, rgb.indexOf("/")) : rgb)
    .trim()
    .split(/[ ,]+/)
    .slice(0, 3)
    .map((channel) => {
      const isPercentage = channel.endsWith("%")
      const number = Number(isPercentage ? channel.slice(0, -1) : channel)

      return isPercentage ? (number / 100) * 255 : number
    })

  return channels.length === 3 && channels.every(Number.isFinite)
    ? (channels as [number, number, number])
    : undefined
}

function relativeLuminance(color: string) {
  const rgb = parseRgb(color)
  if (!rgb) return

  const linearize = (channel: number) => {
    const normalized = channel / 255

    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  }

  const red = linearize(rgb[0])
  const green = linearize(rgb[1])
  const blue = linearize(rgb[2])

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function readableForeground(background: string) {
  const luminance = relativeLuminance(background)
  if (luminance === undefined) return "#ffffff"

  const contrastWithWhite = 1.05 / (luminance + 0.05)
  const contrastWithBlack = (luminance + 0.05) / 0.05

  return contrastWithWhite >= contrastWithBlack ? "#ffffff" : "#111827"
}

const radiusBySize = {
  none: 0,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
} as const

export function createSiteThemeStyle(palette: SitePalette): SiteThemeStyle {
  const style: Record<`--${string}`, string> = {}

  for (const [field, token] of Object.entries(COLOR_TOKEN_NAMES)) {
    const color = safeColor(palette?.[field as keyof typeof COLOR_TOKEN_NAMES])
    if (color) style[`--color-${token}`] = color
  }

  const primary = style["--color-primary"]
  const secondary = style["--color-secondary"]
  const accent = style["--color-accent"]
  const background = style["--color-background"]
  const foreground = style["--color-foreground"]
  const muted = style["--color-muted"] ?? background
  const destructive = style["--color-destructive"] ?? "#b91c1c"

  if (primary) style["--color-primary-foreground"] = readableForeground(primary)
  if (secondary)
    style["--color-secondary-foreground"] = readableForeground(secondary)
  if (accent) style["--color-accent-foreground"] = readableForeground(accent)
  if (muted) style["--color-muted-foreground"] = readableForeground(muted)
  style["--color-destructive"] = destructive
  style["--color-destructive-foreground"] = readableForeground(destructive)

  if (background && foreground) {
    style["--color-card"] = background
    style["--color-card-foreground"] = foreground
    style["--color-popover"] = background
    style["--color-popover-foreground"] = foreground
  }

  const border = style["--color-border"] ?? style["--color-muted"]
  if (border) style["--color-input"] = border
  if (primary) style["--color-ring"] = primary

  const radius = radiusBySize[palette?.radius ?? "md"]
  style["--radius"] = `${radius / 16}rem`
  style["--radius-xs"] = `${(radius * 0.25) / 16}rem`
  style["--radius-sm"] = `${(radius * 0.5) / 16}rem`
  style["--radius-md"] = `${(radius * 0.75) / 16}rem`
  style["--radius-lg"] = `${radius / 16}rem`
  style["--radius-xl"] = `${(radius * 1.5) / 16}rem`
  style["--radius-2xl"] = `${(radius * 2) / 16}rem`
  style["--radius-3xl"] = `${(radius * 3) / 16}rem`
  style["--radius-4xl"] = `${(radius * 4) / 16}rem`

  const fontBody = palette?.fontBody?.trim()
  const fontHeading = palette?.fontHeading?.trim()
  if (fontBody && /^[\w\s,'"-]+$/.test(fontBody)) {
    style["--site-font-body"] = fontBody
    style["--font-sans"] = fontBody
  }
  if (fontHeading && /^[\w\s,'"-]+$/.test(fontHeading)) {
    style["--site-font-heading"] = fontHeading
  }

  return style as SiteThemeStyle
}
