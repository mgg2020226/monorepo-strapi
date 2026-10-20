import StrapiMissionVision from "@repo/sections/sections/StrapiMissionVision"
import type { Data } from "@repo/strapi-types"

const data = {
  id: 1,
  __component: "sections.mission-vision",
  heading: "Lo que nos guía",
  missionTitle: "Misión",
  missionDescription: "Acompañar proyectos con rigor técnico y compromiso.",
  missionImage: null,
  visionTitle: "Visión",
  visionDescription: "Construir un futuro más eficiente y sostenible.",
  visionImage: null,
  valuesTitle: "Valores",
  values: [
    { id: 1, text: "Integridad" },
    { id: 2, text: "Innovación" },
    { id: 3, text: "Calidad" },
  ],
} as unknown as Data.Component<"sections.mission-vision">

export default function MockedStrapiMissionVision() {
  return <StrapiMissionVision component={data} />
}
