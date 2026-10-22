"use client";

import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { useManager } from "@/lib/context/manager-context";
import { getStrapiImageUrl } from "@/lib/strapi-images";
import type { Navigation } from "@/services/navigation.service";
import { DesktopNav } from "./_components/desktop";
import { GlobalSearch } from "./_components/global-search";
import { MobileMenuPanel } from "./_components/mobile";

const normalize = (url: string) => url.replace(/\/+$/, "").split("?")[0];

function resolveHref(href: string, managerSlug: string): string {
  if (!href) return `/${managerSlug}`;
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href.startsWith(`/${managerSlug}/`) || href === `/${managerSlug}`)
    return href;
  if (href.startsWith("/")) return `/${managerSlug}${href}`;
  return `/${managerSlug}/${href}`;
}

function useIsActive(managerSlug: string) {
  const pathname = usePathname();
  return (href?: string) => {
    if (!href) return false;
    const resolved = normalize(resolveHref(href, managerSlug));
    const current = normalize(pathname);
    return current === resolved || current.startsWith(`${resolved}/`);
  };
}

function NavLogo({ logo, managerSlug }: { logo: string; managerSlug: string }) {
  return (
    <Link
      href={`/${managerSlug}/home-page`}
      className="flex items-center gap-2 min-w-0"
    >
      <Image
        src={logo}
        alt="Logo"
        width={120}
        height={40}
        className="h-8 md:h-10 w-auto flex-shrink-0"
        sizes="(max-width: 768px) 80px, 120px"
        priority
      />
    </Link>
  );
}

export default function Navbar({ data }: { data: Navigation }) {
  const { managerSlug } = useManager();
  const isActive = useIsActive(managerSlug);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = data?.items || [];
  const logo = getStrapiImageUrl(data?.logo, "medium") || "";

  const closeMenu = () => setIsMenuOpen(false);
  const toggleSearch = () => {
    setIsSearchOpen((v) => !v);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-4 z-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-2 px-6 py-3 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between gap-4 justify-between gap-2">
                <NavLogo logo={logo} managerSlug={managerSlug} />
                <DesktopNav
                  navItems={navItems}
                  managerSlug={managerSlug}
                  isActive={isActive}
                />

                <div className="hidden lg:flex items-center flex-shrink-0">
                  <GlobalSearch />
                </div>

                <div className="lg:hidden flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSearch}
                    aria-label="Buscar"
                  >
                    <Search className="size-5 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              {isSearchOpen && (
                <div className="lg:hidden p-4 border-t border-brand-border">
                  <GlobalSearch
                    className="w-full"
                    onClose={() => setIsSearchOpen(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="lg:hidden">
        {isMenuOpen && (
          <MobileMenuPanel
            navItems={navItems}
            managerSlug={managerSlug}
            isActive={isActive}
            onClose={closeMenu}
          />
        )}

        <Button
          type="button"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-brand-primary text-white shadow-lg hover:bg-brand-primary/90 active:scale-95 transition-[background-color,transform]"
        >
          {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          <span className="text-sm font-semibold">
            {isMenuOpen ? "Cerrar" : "Menú"}
          </span>
        </Button>
      </div>
    </>
  );
}
