import { Roboto } from "next/font/google"

export const fontRoboto = Roboto({
  display: "swap",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})
