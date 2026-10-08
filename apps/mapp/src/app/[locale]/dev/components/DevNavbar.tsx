"use client"

import AppLink from "@repo/design-system/elementary/AppLink"
import { Container } from "@repo/design-system/elementary/Container"
import { usePathname } from "@/lib/navigation"

export default function DevNavbar() {
  const pathname = usePathname()
  const links = [
    {
      href: "/dev/pages-overview",
      label: "Pages overview",
    },
    {
      href: "/dev/components-overview",
      label: "Components overview",
    },
    {
      href: "/dev/showcase",
      label: "Showcase",
    },
  ]

  return (
    <div className="bg-gray-300">
      <Container>
        <div className="py-2">
          {links
            .filter((link) => link.href !== pathname)
            .map((link) => (
              <AppLink key={link.href} href={link.href}>
                {link.label}
              </AppLink>
            ))}
        </div>
      </Container>
    </div>
  )
}
