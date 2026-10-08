"use client"

import type React from "react"
import { useFormContext } from "react-hook-form"

import { AppFormDescription } from "@repo/design-system/forms/AppFormDescription"
import { AppFormLabel } from "@repo/design-system/forms/AppFormLabel"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/design-system/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/design-system/ui/tabs"
import { cn } from "@repo/design-system/utils"

type Props = {
  readonly name: string
  readonly tabsContent: { value: string; content: React.ReactNode }[]
  readonly tabTriggers: {
    value: string
    title: string
    tabIndex?: number
  }[]
  readonly label?: React.ReactNode
  readonly containerClassName?: string
  readonly description?: React.ReactNode
  readonly tabListProps?: React.ComponentProps<typeof TabsList>
  readonly required?: boolean
}

export function AppRadioTabs({
  name,
  tabsContent,
  tabTriggers,
  label,
  containerClassName,
  description,
  tabListProps,
  required,
}: Props) {

  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn(containerClassName)}>
          <FormControl>
            {/* eslint-disable-next-line react/jsx-handler-names -- react-hook-form API */}
            <Tabs onValueChange={field.onChange} value={field.value}>
              <div className="flex w-full items-center justify-between">
                <AppFormLabel
                  label={label}
                  fieldState={fieldState}
                  required={required}
                  className="text-md font-medium"
                />

                <TabsList
                  {...tabListProps}
                  className={cn("bg-primary", tabListProps?.className)}
                >
                  {tabTriggers.map((tabTrigger) => (
                    <TabsTrigger
                      key={tabTrigger.value}
                      value={tabTrigger.value}
                      tabIndex={tabTrigger.tabIndex}
                      className="text-sm text-white/80"
                    >
                      {tabTrigger.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {tabsContent.map((tabContent) => (
                <TabsContent key={tabContent.value} value={tabContent.value}>
                  {tabContent.content}
                </TabsContent>
              ))}
            </Tabs>
          </FormControl>

          <AppFormDescription description={description} />

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
