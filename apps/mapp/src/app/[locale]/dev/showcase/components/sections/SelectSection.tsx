import Typography from "@repo/design-system/typography"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/ui/select"

export default function SelectSection() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <Typography>Default</Typography>
        <Select defaultValue="one">
          <SelectTrigger>
            <SelectValue placeholder="Choose..." />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="one">One</SelectItem>
            <SelectItem value="two">Two</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
