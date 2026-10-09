import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@repo/design-system/ui/navigation-menu"
import StrapiLink from "@repo/sections/utilities/StrapiLink"
import type { Data } from "@repo/strapi-types"

import { cn } from "@/lib/styles"

interface DesktopNavigationProps {
  siteNavigationItems?: Data.Component<"site.navigation-item">[]
}

export function DesktopNavigation({
  siteNavigationItems,
}: DesktopNavigationProps) {
  if (!siteNavigationItems?.length) return null

  return (
    <NavigationMenu viewport={false} className="hidden lg:flex">
      <NavigationMenuList className="flex items-center gap-2">
        {siteNavigationItems?.map((item) => (
          <NavigationMenuItem key={item.id} className="relative">
            <StrapiLink
              component={item}
              className={cn(navigationMenuTriggerStyle())}
            />
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
