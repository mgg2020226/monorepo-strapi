import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { use } from "react"

import { ChangePasswordForm } from "./_components/ChangePasswordForm"

export default function ChangePasswordPage({
  params,
}: PageProps<"/[locale]/auth/change-password">) {
  const { locale } = use(params) as { locale: Locale }

  setRequestLocale(locale)

  return <ChangePasswordForm />
}
