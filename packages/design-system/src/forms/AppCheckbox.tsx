"use client"

import type React from "react"
import { useFormContext } from "react-hook-form"

import { Checkbox as CheckboxComponent } from "@repo/design-system/ui/checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/design-system/ui/form"
import { cn } from "@repo/design-system/utils"

import { AppFormDescription } from "./AppFormDescription"
import { AppFormLabel } from "./AppFormLabel"

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> & {
  readonly name: string
  readonly label?: React.ReactNode
  readonly containerClassName?: string
  readonly fieldClassName?: string
  readonly description?: React.ReactNode
}

export function AppCheckbox({
  name,
  label,
  containerClassName,
  fieldClassName,
  description,
  ...nativeProps
}: Props) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem
          className={cn(
            containerClassName,
            "flex flex-col justify-center justify-items-center"
          )}
        >
          <div className="flex flex-row items-start space-y-0 space-x-3">
            <FormControl>
              <CheckboxComponent
                {...field}
                {...(nativeProps as Record<string, unknown>)}
                checked={field.value}
                onCheckedChange={field.onChange} // eslint-disable-line react/jsx-handler-names -- react-hook-form API
                className={fieldClassName}
              />
            </FormControl>

            <div className="space-y-1 leading-none">
              <AppFormLabel
                label={label}
                fieldState={fieldState}
                required={nativeProps.required}
              />

              <AppFormDescription description={description} />
            </div>
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
