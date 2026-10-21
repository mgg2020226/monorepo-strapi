import Typography from "@repo/design-system/typography"
import { Input } from "@repo/design-system/ui/input"

export default function InputSection() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <Typography>Default</Typography>
        <Input placeholder="Type here" />
      </div>
    </div>
  )
}
