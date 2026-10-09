export type DynamicFormFieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "date"
  | "time"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "file"

export type DynamicFormOption = {
  label: string
  value: string
  order?: number
}

export type DynamicFormField = {
  name: string
  label: string
  type: DynamicFormFieldType
  placeholder?: string | null
  helpText?: string | null
  required?: boolean | null
  order?: number | null
  options?: DynamicFormOption[] | null
  minLength?: number | null
  maxLength?: number | null
  minValue?: number | null
  maxValue?: number | null
  accept?: string | null
  visible?: boolean | null
}

export type DynamicFormDefinition = {
  title: string
  description?: string | null
  submitLabel: string
  successMessage: string
  errorMessage: string
  honeypotEnabled?: boolean | null
  fields: DynamicFormField[]
}

export type DynamicFormValues = Record<string, string | boolean>
