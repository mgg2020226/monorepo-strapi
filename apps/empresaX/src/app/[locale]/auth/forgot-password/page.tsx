import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { use } from "react"

import { ForgotPasswordForm } from "./_components/ForgotPasswordForm"

export default function ForgotPasswordPage({
  params,
}: PageProps<"/[locale]/auth/forgot-password">) {
  const { locale } = use(params) as { locale: Locale }

  setRequestLocale(locale)

  return <ForgotPasswordForm />
}
