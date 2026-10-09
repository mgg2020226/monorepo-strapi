"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@repo/design-system/ui/button"
import { Input } from "@repo/design-system/ui/input"
import { Label } from "@repo/design-system/ui/label"
import { Textarea } from "@repo/design-system/ui/textarea"
import { cn } from "@repo/design-system/utils"
import { useState } from "react"
import {
  Controller,
  FormProvider,
  type Resolver,
  useForm,
  useFormContext,
} from "react-hook-form"
import * as z from "zod"

import type {
  DynamicFormDefinition,
  DynamicFormField,
  DynamicFormValues,
} from "./types"

type DynamicFormProps = {
  form: DynamicFormDefinition
  onSubmit: (values: DynamicFormValues) => Promise<unknown>
}

export function DynamicForm({ form, onSubmit }: DynamicFormProps) {
  const formSchema = createDynamicFormSchema(form.fields)
  const formMethods = useForm<DynamicFormValues>({
    resolver: zodResolver(formSchema) as Resolver<DynamicFormValues>,
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: createDefaultValues(form.fields),
  })
  const [isPending, setIsPending] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (values: DynamicFormValues) => {
    setIsPending(true)
    setSubmitError(null)
    setIsSuccess(false)

    try {
      await onSubmit(values)
      formMethods.reset(createDefaultValues(form.fields))
      setIsSuccess(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : form.errorMessage)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(handleSubmit)}
          className="w-full space-y-4"
          noValidate
        >
          <fieldset
            disabled={isPending}
            className="space-y-4 disabled:opacity-70"
          >
            {form.fields
              .filter((field) => field.visible !== false)
              .sort(compareFieldOrder)
              .map((field) => (
                <DynamicFormFieldRenderer field={field} key={field.name} />
              ))}

            {form.honeypotEnabled !== false && (
              <div
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
              >
                <label htmlFor="dynamic-form-gotcha">
                  Leave this field empty
                </label>
                <input
                  id="dynamic-form-gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  {...formMethods.register("_gotcha")}
                />
              </div>
            )}

            <Button type="submit" size="lg" className="w-full md:w-fit">
              {isPending ? "…" : form.submitLabel}
            </Button>
          </fieldset>
        </form>
      </FormProvider>

      {submitError && (
        <p role="alert" className="text-center text-red-500">
          {submitError || form.errorMessage}
        </p>
      )}
      {isSuccess && (
        <p role="status" className="text-center">
          {form.successMessage}
        </p>
      )}
    </div>
  )
}

function DynamicFormFieldRenderer({ field }: { field: DynamicFormField }) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<DynamicFormValues>()
  const error = errors[field.name]?.message
  const fieldId = `dynamic-form-${field.name}`
  const options = [...(field.options ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  )
  const description = field.helpText ? (
    <p className="text-muted-foreground text-[0.8rem]">{field.helpText}</p>
  ) : null

  if (field.type === "radio") {
    return (
      <div className="space-y-2">
        <Label>
          {field.label}
          {field.required && <span aria-hidden="true"> *</span>}
        </Label>
        <Controller
          control={control}
          name={field.name}
          render={({ field: controllerField }) => (
            <div className="space-y-2">
              {options.map((option) => (
                <label className="flex items-center gap-2" key={option.value}>
                  <input
                    type="radio"
                    name={controllerField.name}
                    value={option.value}
                    checked={controllerField.value === option.value}
                    onChange={() => controllerField.onChange(option.value)}
                    onBlur={controllerField.onBlur} // eslint-disable-line react/jsx-handler-names -- react-hook-form API
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          )}
        />
        {description}
        <FieldError message={error} />
      </div>
    )
  }

  if (field.type === "checkbox") {
    return (
      <div className="space-y-2">
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" {...register(field.name)} />
          <span>
            {field.label}
            {field.required && <span aria-hidden="true"> *</span>}
          </span>
        </label>
        {description}
        <FieldError message={error} />
      </div>
    )
  }

  if (field.type === "select") {
    return (
      <div className="space-y-2">
        <Label htmlFor={fieldId}>
          {field.label}
          {field.required && <span aria-hidden="true"> *</span>}
        </Label>
        <select
          id={fieldId}
          className={cn(
            "border-input bg-background h-9 w-full rounded-md border px-3 text-sm",
            error && "border-destructive"
          )}
          defaultValue=""
          {...register(field.name)}
        >
          <option value="">{field.placeholder ?? "Select an option"}</option>
          {options.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {description}
        <FieldError message={error} />
      </div>
    )
  }

  if (field.type === "textarea") {
    return (
      <div className="space-y-2">
        <Label htmlFor={fieldId}>
          {field.label}
          {field.required && <span aria-hidden="true"> *</span>}
        </Label>
        <Textarea
          id={fieldId}
          placeholder={field.placeholder ?? undefined}
          aria-invalid={!!error}
          {...register(field.name)}
        />
        {description}
        <FieldError message={error} />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>
        {field.label}
        {field.required && <span aria-hidden="true"> *</span>}
      </Label>
      <Input
        id={fieldId}
        type={field.type === "file" ? "file" : field.type}
        placeholder={field.placeholder ?? undefined}
        accept={field.accept ?? undefined}
        aria-invalid={!!error}
        {...register(field.name)}
      />
      {description}
      <FieldError message={error} />
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null

  return (
    <p role="alert" className="text-destructive text-[0.8rem] font-medium">
      {message}
    </p>
  )
}

function createDefaultValues(fields: DynamicFormField[]): DynamicFormValues {
  return Object.fromEntries(
    fields.map((field) => [field.name, field.type === "checkbox" ? false : ""])
  )
}

function createDynamicFormSchema(fields: DynamicFormField[]) {
  const visibleFields = fields.filter((field) => field.visible !== false)
  const shape = Object.fromEntries(
    visibleFields.map((field) => [field.name, createDynamicFieldSchema(field)])
  ) as Record<string, z.ZodTypeAny>

  return z.object(shape)
}

function createDynamicFieldSchema(field: DynamicFormField) {
  if (field.type === "checkbox") {
    const checkboxSchema = z.boolean()

    return field.required
      ? checkboxSchema.refine(Boolean, {
          message: `${field.label} is required`,
        })
      : checkboxSchema
  }

  let stringSchema = z.string()
  if (field.required) {
    stringSchema = stringSchema.min(1, `${field.label} is required`)
  }

  if (field.type === "email") {
    stringSchema = stringSchema.refine(
      (value) => !value || z.email().safeParse(value).success,
      `${field.label} must be a valid email`
    )
  }
  if (field.type === "number") {
    stringSchema = stringSchema.refine(
      (value) => !value || Number.isFinite(Number(value)),
      `${field.label} must be a number`
    )
  }
  if (field.minLength != null) {
    stringSchema = stringSchema.refine(
      (value) => !value || value.length >= field.minLength!,
      `${field.label} is too short`
    )
  }
  if (field.maxLength != null) {
    stringSchema = stringSchema.max(
      field.maxLength,
      `${field.label} is too long`
    )
  }
  if (field.minValue != null) {
    stringSchema = stringSchema.refine(
      (value) => !value || Number(value) >= field.minValue!,
      `${field.label} is below the minimum`
    )
  }
  if (field.maxValue != null) {
    stringSchema = stringSchema.refine(
      (value) => !value || Number(value) <= field.maxValue!,
      `${field.label} is above the maximum`
    )
  }

  return stringSchema
}

function compareFieldOrder(a: DynamicFormField, b: DynamicFormField) {
  return (a.order ?? 0) - (b.order ?? 0)
}
