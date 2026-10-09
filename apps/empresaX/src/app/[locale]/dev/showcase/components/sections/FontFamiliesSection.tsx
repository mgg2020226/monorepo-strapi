import Typography from "@repo/design-system/typography"

import ManualItem from "@/app/[locale]/dev/showcase/components/ManualItem"

function FontFamiliesSection() {
  return (
    <div className="flex flex-col gap-4">
      <Typography tag="h6">Roboto</Typography>
      <ManualItem description='<Typography variant="heading6">Typography showcase example</Typography>'>
        <Typography variant="heading6">Typography showcase example</Typography>
      </ManualItem>
      <Typography variant="small">
        We use font Roboto for both: headings and body text - it is imported
        Google Font
      </Typography>
    </div>
  )
}

export default FontFamiliesSection
