"use client";

import {
  Briefcase,
  CreditCard,
  FileText,
  Home,
  Info,
  Layout,
  Link2,
  Loader2,
  Newspaper,
  ScrollText,
  Search,
  Tag,
  UserCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMeiliSearch } from "@/hooks/use-meili-search";
import { useManager } from "@/lib/context/manager-context";
import type { SearchHit } from "@/lib/meilisearch";
import { cn } from "@/lib/utils";

interface GlobalSearchProps {
  className?: string;
  onClose?: () => void;
}

const INDEX_META = {
  article: { label: "Artículo", Icon: Newspaper, color: "text-blue-500" },
  resolution: {
    label: "Resolución",
    Icon: FileText,
    color: "text-brand-success-600",
  },
  edicto: { label: "Edicto", Icon: FileText, color: "text-purple-600" },
  "about-page": { label: "Quiénes somos", Icon: Info, color: "text-cyan-600" },
  card: { label: "Servicio", Icon: CreditCard, color: "text-orange-500" },
  "footer-layout": {
    label: "Pie de página",
    Icon: Layout,
    color: "text-gray-500",
  },
  "home-page": { label: "Inicio", Icon: Home, color: "text-yellow-600" },
  link: { label: "Enlace", Icon: Link2, color: "text-sky-500" },
  "team-member": { label: "Miembro", Icon: UserCircle, color: "text-pink-500" },
  "terms-of-use-page": {
    label: "Términos de uso",
    Icon: ScrollText,
    color: "text-red-500",
  },
  "servicio-item": {
    label: "Servicio",
    Icon: Briefcase,
    color: "text-indigo-500",
  },
} as const;

function getHref(
  hit: SearchHit,
  managerSlug: string,
): { href: string; external: boolean } {
  switch (hit._index) {
    case "article":
      return { href: `/${managerSlug}/articulos/${hit.slug}`, external: false };
    case "resolution":
      return {
        href: `/${managerSlug}/resoluciones#${hit.id}`,
        external: false,
      };
    case "about-page":
    case "team-member":
      return { href: `/${managerSlug}/quienes-somos`, external: false };
    case "card":
      return { href: `/${managerSlug}/home-page`, external: false };
    case "link": {
      const url = hit.url ?? "#";
      const external = url.startsWith("http");
      return { href: external ? url : `/${managerSlug}/${url}`, external };
    }
    case "terms-of-use-page":
      return { href: `/${managerSlug}/condiciones-uso`, external: false };
    case "edicto":
      return { href: `/${managerSlug}/edictos#${hit.id}`, external: false };
    case "servicio-item":
      return {
        href: `/${managerSlug}/${hit.type === "tramite" ? "tramites" : "productos"}#${hit.id}`,
        external: false,
      };
    default:
      return { href: `/${managerSlug}/home-page`, external: false };
  }
}

function getPrimaryText(hit: SearchHit) {
  switch (hit._index) {
    case "article":
      return hit._formatted?.title ?? hit.title;
    case "resolution":
      return hit._formatted?.title ?? hit.title;
    case "about-page":
      return hit._formatted?.title ?? hit.title;
    case "card":
      return hit._formatted?.title ?? hit.title;
    case "footer-layout":
      return hit._formatted?.description ?? hit.description ?? "";
    case "home-page":
      return "Página de inicio";
    case "link":
      return hit._formatted?.label ?? hit.label;
    case "team-member":
      return hit._formatted?.name ?? hit.name;
    case "terms-of-use-page":
      return hit._formatted?.title ?? hit.title;
    case "edicto":
      return hit._formatted?.title ?? hit.title;
    case "servicio-item":
      return hit._formatted?.title ?? hit.title;
  }
}

function getSecondaryText(hit: SearchHit) {
  switch (hit._index) {
    case "article":
      return hit._formatted?.extract ?? hit.extract;
    case "resolution":
      return hit._formatted?.description ?? hit.description;
    case "about-page":
      return hit._formatted?.description ?? hit.description;
    case "card":
      return hit._formatted?.description ?? hit.description ?? "";
    case "footer-layout":
      return hit._formatted?.address ?? hit.address ?? "";
    case "home-page":
      return "";
    case "link":
      return hit._formatted?.url ?? hit.url;
    case "team-member":
      return `${hit._formatted?.position ?? hit.position}${hit.department ? ` · ${hit.department}` : ""}`;
    case "terms-of-use-page":
      return "";
    case "edicto":
      return hit._formatted?.description ?? hit.description ?? "";
    case "servicio-item":
      return hit._formatted?.short_description ?? hit.short_description;
  }
}

function HighlightText({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const parsedSegments = html
    .split(/(<mark>[\s\S]*?<\/mark>)/g)
    .map((segment, index) => ({
      id: `segment-${index}`,
      segment,
    }));
  return (
    <span className={className}>
      {parsedSegments.map(({ segment, id }) => {
        const match = segment.match(/^<mark>([\s\S]*?)<\/mark>$/);
        return match ? (
          <mark key={id}>{match[1]}</mark>
        ) : (
          <span key={id}>{segment}</span>
        );
      })}
    </span>
  );
}

export function GlobalSearch({ className, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { managerSlug } = useManager();
  const { results, loading, error } = useMeiliSearch(query);

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setQuery("");
        onClose?.();
        inputRef.current?.blur();
      }
    }

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [onClose]);

  function updateSearchQuery(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  function clearSearch() {
    setQuery("");
    inputRef.current?.focus();
  }

  function handleSelect() {
    setQuery("");
    onClose?.();
  }

  const showDropdown = query.trim().length > 0;

  return (
    <div className={cn("relative", className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          ref={inputRef}
          type="search"
          placeholder="Buscar artículos, resoluciones..."
          value={query}
          onChange={updateSearchQuery}
          className="h-9 w-full rounded-full !border-white/30 !bg-white/50 !shadow-none pl-10 pr-8 text-sm text-foreground placeholder:text-muted-foreground backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-brand-primary/30"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {loading && (
            <Loader2 className="size-4 animate-spin text-brand-muted-foreground" />
          )}
          {!loading && query && (
            <Button
              type="button"
              onClick={clearSearch}
              aria-label="Limpiar búsqueda"
            >
              <X className="size-4 text-brand-muted-foreground transition-colors hover:text-brand-foreground" />
            </Button>
          )}
        </div>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 w-full min-w-[320px] overflow-hidden rounded-lg border border-brand-border bg-brand-card shadow-lg">
          {!loading && results.length === 0 && !error && (
            <p className="px-4 py-6 text-center text-sm text-brand-muted-foreground">
              Sin resultados para <strong>&quot;{query}&quot;</strong>
            </p>
          )}

          {error && (
            <p className="p-4 text-center text-sm text-red-500">{error}</p>
          )}

          {results.length > 0 && (
            <ul className="max-h-[440px] divide-y divide-brand-border overflow-y-auto">
              {results.map((hit) => {
                const meta = INDEX_META[hit._index];
                const primary = getPrimaryText(hit);
                const secondary = getSecondaryText(hit);
                const { href, external } = getHref(hit, managerSlug);
                const itemClass =
                  "group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-brand-accent";

                const content = (
                  <>
                    <meta.Icon
                      className={cn("mt-0.5 size-4 shrink-0", meta.color)}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-brand-foreground transition-colors group-hover:text-brand-primary [&_mark]:rounded-sm [&_mark]:bg-yellow-200 [&_mark]:text-black">
                        <HighlightText html={primary} />
                      </p>
                      {secondary && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-brand-muted-foreground [&_mark]:rounded-sm [&_mark]:bg-yellow-100 [&_mark]:text-black">
                          <HighlightText html={secondary} />
                        </p>
                      )}
                    </div>
                    <Badge className="mt-0.5 shrink-0 text-[10px] font-semibold uppercase tracking-wide">
                      {meta.label}
                    </Badge>
                  </>
                );

                return (
                  <li key={`${hit._index}-${hit.id}`}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleSelect}
                        className={itemClass}
                      >
                        {content}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        onClick={handleSelect}
                        className={itemClass}
                      >
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {results.length > 0 && (
            <div className="border-t border-brand-border bg-brand-muted/40 px-4 py-2">
              <p className="text-[11px] text-brand-muted-foreground">
                {results.length} resultado{results.length !== 1 ? "s" : ""} ·
                powered by Meilisearch
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
