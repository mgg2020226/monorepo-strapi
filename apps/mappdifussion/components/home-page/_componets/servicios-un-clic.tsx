"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import Link from "next/link";
import { useCallback, useEffect, useReducer, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import type { LinksSection } from "@/types/strapi.types";

type ServiciosUnClicProps = Omit<LinksSection, "__component" | "id">;

function visibleFromWidth(width: number): number {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  return 4;
}

function useVisibleCount() {
  const [visible, dispatch] = useReducer(
    (_: number, width: number) => visibleFromWidth(width),
    4,
  );

  useEffect(() => {
    const update = () => dispatch(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return visible;
}

export function ServiciosUnClic({
  title,
  description,
  view_all_button,
  links,
}: ServiciosUnClicProps) {
  const visibleCount = useVisibleCount();
  const [activeIndex, setActiveIndex] = useState(0);

  const count = links?.length ?? 0;
  const maxIndex = Math.max(0, count - visibleCount);

  const prev = useCallback(
    () => setActiveIndex((i) => Math.max(0, Math.min(i, maxIndex) - 1)),
    [maxIndex],
  );
  const next = useCallback(
    () => setActiveIndex((i) => Math.min(maxIndex, Math.min(i, maxIndex) + 1)),
    [maxIndex],
  );

  if (count === 0) return null;

  const gap = 20;

  return (
    <section className="py-16 bg-brand-accent overflow-hidden mt-5">
      <div className="max-w-7xl mx-auto px-6">
        {title || description || view_all_button ? (
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              {title && (
                <h2 className="text-2xl font-semibold text-brand-primary mb-1">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-foreground text-sm">{description}</p>
              )}
            </div>
            {view_all_button && (
              <Link
                href={view_all_button.href}
                target={view_all_button.isExternal ? "_blank" : undefined}
                rel={
                  view_all_button.isExternal ? "noopener noreferrer" : undefined
                }
                className="inline-flex items-center gap-2 rounded-full border-2 border-brand-primary text-brand-primary px-5 py-2 text-sm font-semibold hover:bg-brand-primary hover:text-white transition-colors shrink-0"
              >
                {view_all_button.label}
              </Link>
            )}
          </div>
        ) : null}

        <div className="relative">
          <div className="overflow-hidden py-3 px-1">
            <div
              className="flex gap-5 transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(calc(-${Math.min(activeIndex, maxIndex)} * (100% / ${visibleCount} + ${gap / visibleCount}px)))`,
              }}
            >
              {links?.map((link) => (
                <Link
                  key={link.id ?? link.href}
                  href={link.href ?? (link as { url?: string }).url ?? "#"}
                  target={link.isExternal ? "_blank" : undefined}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                  className="group shrink-0"
                  style={{
                    width: `calc((100% - ${(visibleCount - 1) * gap}px) / ${visibleCount})`,
                  }}
                >
                  <Card className="glass-card h-full hover:shadow-lg transition-shadow">
                    <CardHeader className="">
                      {link.icon_name && (
                        <DynamicIcon
                          name={link.icon_name}
                          className="size-8 text-brand-primary mb-2 group-hover:scale-110 transition-transform"
                        />
                      )}
                      <h4 className="font-semibold text-brand-primary group-hover:text-brand-primary transition-colors">
                        {link.label}
                      </h4>
                    </CardHeader>
                    <CardContent className="">
                      {link.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                          {link.description}
                        </p>
                      )}
                      <span className="text-xs font-bold text-brand-primary opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-[opacity,transform] duration-200 mt-2 block">
                        Ver más →
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {count > visibleCount && (
            <>
              <Button
                type="button"
                onClick={prev}
                disabled={Math.min(activeIndex, maxIndex) === 0}
                className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow-md p-2 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Anterior"
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                type="button"
                onClick={next}
                disabled={Math.min(activeIndex, maxIndex) === maxIndex}
                className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow-md p-2 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Siguiente"
              >
                <ChevronRight className="size-5" />
              </Button>
            </>
          )}
        </div>

        {count > visibleCount && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <Button
                // biome-ignore lint/suspicious/noArrayIndexKey: dots have no natural id
                key={`dot-${i}`}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  Math.min(activeIndex, maxIndex) === i
                    ? "w-6 bg-brand-primary"
                    : "w-2 bg-brand-primary/30 hover:bg-brand-primary/50"
                }`}
                aria-label={`Ir a posición ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
