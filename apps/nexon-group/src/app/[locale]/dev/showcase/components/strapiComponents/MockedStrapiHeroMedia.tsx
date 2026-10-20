import StrapiHeroMedia from "@repo/sections/sections/StrapiHeroMedia"
import type { Data } from "@repo/strapi-types"

const data = {
  id: 1,
  __component: "sections.hero-media",
  eyebrow: "Diseño y construcción",
  title: "Espacios construidos para durar",
  description: "Ingeniería, tecnología y acompañamiento en cada etapa.",
  video: null,
  videoUrl: null,
  poster: null,
  image: null,
  alignment: "left",
  actions: [],
  perks: [
    {
      id: 1,
      title: "Experiencia técnica",
      description: "Equipo especializado",
      icon: "shield-check",
    },
  ],
} as unknown as Data.Component<"sections.hero-media">

export default function MockedStrapiHeroMedia() {
  return <StrapiHeroMedia component={data} />
}
