import StrapiBeforeAfterSlider from "@repo/sections/sections/StrapiBeforeAfterSlider"
import type { Data } from "@repo/strapi-types"

import { mockImage } from "@/app/[locale]/dev/showcase/components/StrapiMedia"

const data = {
  id: 1,
  __component: "sections.before-after-slider",
  title: "Render frente a resultado",
  description: "Desliza para comparar las dos imágenes.",
  beforeImage: mockImage,
  afterImage: mockImage,
  beforeLabel: "Render",
  afterLabel: "Obra",
  hint: "Arrastra el control para comparar",
  sliderLabel: "Comparar render y obra",
} as unknown as Data.Component<"sections.before-after-slider">

export default function MockedStrapiBeforeAfterSlider() {
  return <StrapiBeforeAfterSlider component={data} />
}
