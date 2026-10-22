import { MessageCircle } from "lucide-react"

type Props = {
  enabled?: boolean | null
  phone?: string | null
  message?: string | null
  label?: string | null
}

export function CaeWhatsAppButton({ enabled, phone, message, label }: Props) {
  const normalizedPhone = phone?.replaceAll(/\D/g, "")

  if (enabled !== true || !normalizedPhone) return null

  const text =
    message?.trim() ||
    "Hola, quisiera conocer más sobre los servicios de CAE GROUP."
  const href = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(text)}`

  return (
    <a
      className="cae-whatsapp-float"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label || "Escríbanos por WhatsApp"}
    >
      <MessageCircle aria-hidden="true" />
      <span>{label || "WhatsApp"}</span>
    </a>
  )
}
