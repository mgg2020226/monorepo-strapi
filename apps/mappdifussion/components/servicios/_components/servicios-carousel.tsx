"use client";

import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { ServicioItem } from "@/types/strapi.types";

interface Props {
  filtered: ServicioItem[];
  selectedId: number | null;
  onSelect: (item: ServicioItem) => void;
  categories: string[];
  category: string;
  onCategoryChange: (cat: string) => void;
}

const SPEED = 0.5;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function ServicioCarouselSection({
  filtered,
  selectedId,
  onSelect,
  categories,
  category,
  onCategoryChange,
}: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const directionRef = useRef<1 | -1>(1);
  const isPausedRef = useRef(false);
  const isAnimatingRef = useRef(false);

  const shouldLoop = filtered.length > 3;

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    el.scrollLeft = 0;

    if (!shouldLoop) return;

    const half = () => el.scrollWidth / 2;

    const tick = () => {
      if (el && !isPausedRef.current && !isAnimatingRef.current) {
        el.scrollLeft += SPEED * directionRef.current;

        if (directionRef.current === 1 && el.scrollLeft >= half()) {
          el.scrollLeft -= half();
        } else if (directionRef.current === -1 && el.scrollLeft <= 0) {
          el.scrollLeft += half();
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [shouldLoop]);

  const scroll = (dir: "left" | "right") => {
    const el = carouselRef.current;
    if (!el || isAnimatingRef.current) return;

    const firstCard = el.querySelector("button");
    const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 300;
    const virtualStart = el.scrollLeft;
    const target = virtualStart + (dir === "right" ? cardWidth : -cardWidth);
    const duration = 400;
    const startTime = performance.now();

    isAnimatingRef.current = true;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      const virtualPos = virtualStart + (target - virtualStart) * eased;

      if (shouldLoop) {
        const half = el.scrollWidth / 2;
        el.scrollLeft = ((virtualPos % half) + half) % half;
      } else {
        el.scrollLeft = Math.max(
          0,
          Math.min(el.scrollWidth - el.clientWidth, virtualPos),
        );
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isAnimatingRef.current = false;
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-xs font-semibold text-brand-muted-foreground uppercase tracking-widest">
          Seleccione el trámite específico
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          {categories.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-brand-foreground hidden sm:block">
                Categoría:
              </span>
              <Select
                value={category}
                onValueChange={(value) => onCategoryChange(value ?? "all")}
              >
                <SelectTrigger className="h-7 text-xs w-44">
                  <span
                    className="flex flex-1 text-left text-xs truncate"
                    data-slot="select-value"
                  >
                    {category === "all" ? "Categoría" : category}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex gap-1">
            <Button
              type="button"
              aria-label="Anterior"
              onClick={() => scroll("left")}
              className="size-8 rounded-full border border-brand-border flex items-center justify-center bg-brand-background hover:bg-brand-accent text-brand-muted-foreground hover:text-brand-primary transition-colors"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              aria-label="Siguiente"
              onClick={() => scroll("right")}
              className="size-8 rounded-full border border-brand-border flex items-center justify-center bg-brand-background hover:bg-brand-accent text-brand-muted-foreground hover:text-brand-primary transition-colors"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-16 z-10"
          style={{
            background:
              "linear-gradient(to right, var(--background) 0%, transparent 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-16 z-10"
          style={{
            background:
              "linear-gradient(to left, var(--background) 0%, transparent 100%)",
          }}
        />

        <section
          ref={carouselRef}
          aria-label="Servicios disponibles"
          className="flex overflow-x-scroll gap-4 py-3 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseEnter={() => {
            isPausedRef.current = true;
          }}
          onMouseLeave={() => {
            isPausedRef.current = false;
          }}
        >
          {(shouldLoop ? [...filtered, ...filtered] : filtered).map(
            (item, idx) => {
              const isActive = selectedId === item.id;
              const half = idx >= filtered.length ? "b" : "a";
              return (
                <Card
                  id={`${item.id}`}
                  key={shouldLoop ? `${item.id}-${half}` : `${item.id}`}
                  onClick={() => onSelect(item)}
                  aria-pressed={isActive}
                  className={`shrink-0 w-[80vw] sm:w-[60vw] md:w-[calc(33.333%-11px)] group p-4 glass rounded-xl text-left
                    transition-all duration-200 ease-in-out
                    hover:scale-[1.04] hover:shadow-xl
                    ${
                      isActive
                        ? "border-2 border-brand-primary"
                        : "border border-brand-border hover:border-brand-primary"
                    }`}
                >
                  <div
                    className={`w-10 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-brand-primary text-brand-primary-foreground"
                        : "bg-brand-accent text-brand-accent-foreground group-hover:bg-brand-primary group-hover:text-brand-primary-foreground"
                    }`}
                  >
                    <FileText className="size-5" />
                  </div>
                  <p
                    className={`text-sm font-bold ${isActive ? "text-brand-primary" : "text-brand-foreground group-hover:text-brand-primary"}`}
                  >
                    {item.title}
                  </p>
                  <p className="text-[11px] text-brand-muted-foreground leading-tight">
                    {item.short_description}
                  </p>
                </Card>
              );
            },
          )}
        </section>
      </div>
    </div>
  );
}
