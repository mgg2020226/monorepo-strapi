import { Plus_Jakarta_Sans, Roboto } from "next/font/google"

export const fontRoboto = Roboto({
  display: "swap",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export const fontJakarta = Plus_Jakarta_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
})
