import type { Core } from "@strapi/strapi"

type FormField = {
  name: string
  label: string
  type: string
  required?: boolean
  maxLength?: number
  visible?: boolean
}

const MAX_FIELDS = 30

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async submit(ctx: any) {
    const { siteSlug, formSlug } = ctx.params as {
      siteSlug?: string
      formSlug?: string
    }
    const body = (ctx.request.body ?? {}) as Record<string, unknown>

    if (!siteSlug || !formSlug || typeof body !== "object") {
      return ctx.badRequest("Invalid form request")
    }

    const form = (await strapi
      .documents("api::form-definition.form-definition")
      .findFirst({
        filters: { slug: formSlug, site: { slug: siteSlug } },
        populate: { fields: { populate: { options: true } } },
      })) as null | {
      fields?: FormField[]
      recipientEmail?: string
      active?: boolean
      honeypotEnabled?: boolean
      rateLimitPerMinute?: number
    }

    if (!form || form.active === false) {
      return ctx.notFound("Form not found")
    }

    const fields = (form.fields ?? []).slice(0, MAX_FIELDS)
    const honeypot = body._gotcha
    if (
      form.honeypotEnabled !== false &&
      typeof honeypot === "string" &&
      honeypot.trim()
    ) {
      return ctx.send({ ok: true })
    }

    const errors: Record<string, string> = {}
    const payload: Record<string, string> = {}

    for (const field of fields) {
      if (field.visible === false) continue
      const value = body[field.name]
      const stringValue = Array.isArray(value)
        ? value.join(", ")
        : String(value ?? "").trim()

      if (field.required && !stringValue) {
        errors[field.name] = `${field.label} is required`
        continue
      }
      if (field.maxLength && stringValue.length > field.maxLength) {
        errors[field.name] = `${field.label} is too long`
        continue
      }
      payload[field.name] = stringValue
    }

    if (Object.keys(errors).length > 0) {
      return ctx.badRequest("Invalid form fields", { errors })
    }

    const emailService = strapi.plugin("email")?.service("email")
    if (!emailService || !form.recipientEmail) {
      strapi.log.error(
        "Form submission rejected because email is not configured"
      )

      return ctx.internalServerError("Email delivery is not configured")
    }

    const text = Object.entries(payload)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n")

    await emailService.send({
      to: form.recipientEmail,
      subject: `New form submission: ${formSlug}`,
      text,
    })

    return ctx.send({ ok: true })
  },
})
