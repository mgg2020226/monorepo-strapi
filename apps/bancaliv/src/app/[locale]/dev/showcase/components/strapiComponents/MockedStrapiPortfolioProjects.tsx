import StrapiPortfolioProjects from "@repo/sections/sections/StrapiPortfolioProjects"
import type { Data } from "@repo/strapi-types"

import { mockImage } from "@/app/[locale]/dev/showcase/components/StrapiMedia"

const data = {
  id: 1,
  __component: "sections.portfolio-projects",
  title: "Proyectos destacados",
  description: "Una selección de proyectos recientes.",
  variant: "featured-plus-grid",
  projects: [
    {
      id: 1,
      documentId: "project-one",
      title: "Residencia Premium BIM",
      slug: "residencia-premium-bim",
      summary: "Diseño y coordinación integral del proyecto.",
      category: "Ingeniería",
      tag: "BIM",
      location: "Barranquilla, Colombia",
      services: "Diseño BIM e interventoría",
      coverImage: mockImage.media,
    },
    {
      id: 2,
      documentId: "project-two",
      title: "Corredor vial",
      slug: "corredor-vial-interventoria",
      summary: "Seguimiento y control de ejecución.",
      category: "Interventoría",
      tag: "Infraestructura",
      location: "Colombia",
      services: "Interventoría técnica",
      coverImage: mockImage.media,
    },
  ],
  viewAllAction: null,
} as unknown as Data.Component<"sections.portfolio-projects">

export default function MockedStrapiPortfolioProjects() {
  return <StrapiPortfolioProjects component={data} />
}
