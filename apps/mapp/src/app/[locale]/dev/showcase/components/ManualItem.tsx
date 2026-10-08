import type { PropsWithChildren } from "react"

import Typography from "@repo/design-system/typography"
import type { TextColor } from "@repo/design-system/typography/config"

interface ManualItemProps {
  label?: string
  description?: string
  textColor?: TextColor
}

function ManualItem({
  children,
  description = "",
  textColor = "black",
}: PropsWithChildren<ManualItemProps>) {
  return (
    <div>
      {children}
      <Typography
        textColor={textColor}
        variant="small"
        className="mt-2 opacity-75"
      >
        {description}
      </Typography>
    </div>
  )
}

export default ManualItem
