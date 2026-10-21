import localFont from "next/font/local"

export const fontRoboto = localFont({
  src: "../fonts/roboto-latin.woff2",
  display: "swap",
  style: "normal",
  variable: "--font-roboto",
  weight: "100 900",
})
