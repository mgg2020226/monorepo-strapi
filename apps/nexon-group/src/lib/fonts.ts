import { Inter, Roboto, Space_Grotesk } from "next/font/google"

export const fontRoboto = Roboto({
  display: "swap",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export const fontInter = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-inter",
})

export const fontSpaceGrotesk = Space_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})
