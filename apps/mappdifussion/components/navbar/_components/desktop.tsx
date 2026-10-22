import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu-styles";
import { activeGlass, cn, resolveHref } from "@/lib/utils";
import type { NavItem } from "@/types/strapi.types";

export function DesktopNav({
  navItems,
  managerSlug,
  isActive,
}: {
  navItems: NavItem[];
  managerSlug: string;
  isActive: (href?: string) => boolean;
}) {
  return (
    <nav className="hidden lg:flex items-center justify-center flex-1 min-w-0">
      <NavigationMenu>
        <NavigationMenuList className="flex-nowrap">
          {navItems.map((item) =>
            item.dropdown && item.dropdown.length > 0 ? (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuTrigger
                  className={cn(
                    "bg-transparent text-sm font-medium text-brand-muted-foreground",
                    item.dropdown?.some((c) => isActive(c.href))
                      ? "bg-white/60 backdrop-blur-md shadow-sm text-brand-primary"
                      : "bg-transparent text-brand-muted-foreground hover:text-brand-primary",
                  )}
                >
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid grid-cols-2 gap-2 p-3 w-[420px]">
                    {item.dropdown?.map((child) => (
                      <li
                        key={child.href ?? child.label}
                        className={child.featured ? "col-span-2" : "col-span-1"}
                      >
                        <NavigationMenuLink
                          render={
                            <Link
                              href={resolveHref(child.href, managerSlug)}
                              {...(child.isExternal
                                ? {
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                  }
                                : {})}
                            />
                          }
                          className={cn(
                            "group flex select-none rounded-lg no-underline outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand-primary",
                            child.featured
                              ? "flex-row items-center gap-4 p-4"
                              : "flex-col gap-1 p-3",
                            isActive(child.href)
                              ? `${activeGlass} backdrop-blur-sm`
                              : child.featured
                                ? "bg-brand-accent/60 hover:bg-brand-primary/10"
                                : "hover:bg-brand-primary/10",
                          )}
                        >
                          {child.icon_name && (
                            <span
                              className={cn(
                                "material-symbols-outlined text-brand-muted-foreground shrink-0",
                                child.featured ? "text-4xl" : "text-2xl",
                              )}
                              style={{
                                fontVariationSettings: "'FILL' 0, 'wght' 300",
                              }}
                            >
                              {child.icon_name}
                            </span>
                          )}
                          <div className="min-w-0">
                            <p
                              className={cn(
                                "font-semibold transition-colors leading-tight",
                                child.featured ? "text-base" : "text-sm",
                                isActive(child.href)
                                  ? "text-brand-primary"
                                  : "text-muted-foreground group-hover:text-brand-primary",
                              )}
                            >
                              {child.label}
                            </p>
                            {child.description && (
                              <p
                                className={cn(
                                  "text-brand-muted-foreground/60 leading-snug mt-0.5",
                                  child.featured ? "text-sm" : "text-xs",
                                )}
                              >
                                {child.description}
                              </p>
                            )}
                          </div>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={item.href ?? item.label}>
                <NavigationMenuLink
                  render={
                    <Link
                      href={resolveHref(item.href ?? "", managerSlug)}
                      {...(item.isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    />
                  }
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "transition-colors text-sm px-2.5 py-1.5",
                    isActive(item.href)
                      ? `${activeGlass} backdrop-blur-sm`
                      : "bg-transparent hover:bg-brand-primary/10 text-muted-foreground hover:text-brand-primary",
                  )}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ),
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
