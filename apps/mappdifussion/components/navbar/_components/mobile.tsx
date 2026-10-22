import Link from "next/link";
import { Button } from "@/components/ui/button";
import { activeGlass, cn, resolveHref } from "@/lib/utils";
import type { NavItem } from "@/types/strapi.types";

export function MobileMenuPanel({
  navItems,
  managerSlug,
  isActive,
  onClose,
}: {
  navItems: NavItem[];
  managerSlug: string;
  isActive: (href?: string) => boolean;
  onClose: () => void;
}) {
  return (
    <>
      <Button
        aria-label="Cerrar menú"
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm cursor-default"
        onClick={onClose}
      />
      <div className="fixed bottom-20 left-4 right-4 z-50 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl overflow-hidden">
        <nav className="p-2 max-h-[60vh] overflow-y-auto">
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.href ?? item.label}>
                {item.dropdown && item.dropdown.length > 0 ? (
                  <>
                    <span className="flex items-center py-2 px-4 text-xs font-bold uppercase tracking-wider text-brand-muted-foreground/40">
                      {item.label}
                    </span>
                    <ul className="space-y-0.5">
                      {item.dropdown?.map((child) => (
                        <li key={child.href ?? child.label}>
                          <Link
                            href={resolveHref(child.href ?? "", managerSlug)}
                            {...(child.isExternal
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                            className={cn(
                              "flex items-center gap-3 py-3 px-4 rounded-xl transition-colors",
                              isActive(child.href)
                                ? activeGlass
                                : "text-brand-muted-foreground hover:text-brand-primary hover:bg-brand-primary/10",
                            )}
                            onClick={onClose}
                          >
                            {child.icon_name && (
                              <span
                                className="material-symbols-outlined text-brand-muted-foreground text-xl shrink-0"
                                style={{
                                  fontVariationSettings: "'FILL' 0, 'wght' 300",
                                }}
                              >
                                {child.icon_name}
                              </span>
                            )}
                            <span className="text-sm font-medium">
                              {child.label}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={resolveHref(item.href ?? "", managerSlug)}
                    {...(item.isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={cn(
                      "flex items-center py-3 px-4 rounded-xl transition-colors text-sm font-medium",
                      isActive(item.href)
                        ? activeGlass
                        : "text-brand-muted-foreground hover:text-brand-primary hover:bg-brand-primary/10",
                    )}
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
