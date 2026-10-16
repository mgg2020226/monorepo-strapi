import StrapiServicesHub from "@repo/sections/sections/StrapiServicesHub"
import type { Data } from "@repo/strapi-types"

import { mockImage } from "@/app/[locale]/dev/showcase/components/StrapiMedia"

const data = {
  id: 1,
  __component: "sections.services-hub",
  heading: "Nuestros servicios",
  description: "Soluciones integrales para cada proyecto.",
  specialtiesTitle: "Especialidades",
  benefitsTitle: "Beneficios",
  relatedProjectLabel: "Proyecto relacionado",
  cards: [
    {
      id: 1,
      title: "Interventoría",
      whatWeDo: "Control técnico y seguimiento integral de obra.",
      image: mockImage,
      specialties: [
        { id: 1, label: "Control de obra" },
        { id: 2, label: "Presupuesto" },
      ],
      benefits: [{ id: 3, label: "Trazabilidad" }],
      action: null,
      relatedProject: null,
      relatedProjectLabel: null,
    },
  ],
} as unknown as Data.Component<"sections.services-hub">

export default function MockedStrapiServicesHub() {
  return <StrapiServicesHub component={data} />
}
