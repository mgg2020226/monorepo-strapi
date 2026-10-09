import { StrapiStatistics } from "@repo/sections/sections/StrapiFigures"
import type { Data } from "@repo/strapi-types"

const data = {
  id: 1,
  __component: "sections.statistics",
  figures: [
    {
      id: 1,
      number: 1000,
      prefix: "",
      suffix: "",
      description: "<p>Users</p>",
    },
    {
      id: 2,
      number: 99,
      prefix: "",
      suffix: "%",
      description: "<p>Uptime</p>",
    },
  ],
} as unknown as Data.Component<"sections.statistics">

export default function MockedStrapiFigures() {
  return <StrapiStatistics component={data} />
}
