"use client"

import dayjs from "dayjs"
import { Calendar as CalendarIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { Button } from "@repo/design-system/ui/button"
import { Calendar } from "@repo/design-system/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design-system/ui/popover"
import { cn } from "@repo/design-system/utils"

export function DatePicker({
  defaultDate = dayjs(new Date()).subtract(2, "D").toDate(),
}: {
  readonly defaultDate?: Date
}) {
  const [date, setDate] = useState<Date | undefined>(defaultDate)
  const t = useTranslations("comps.datePicker")

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date ? dayjs(date).format("LL") : <span>{t("label")}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} autoFocus />
      </PopoverContent>
    </Popover>
  )
}
