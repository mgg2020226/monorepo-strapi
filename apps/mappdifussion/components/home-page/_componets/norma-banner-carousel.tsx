"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { NormaBannerSlide } from "@/types/strapi.types";

interface NormaBannerCarouselProps {
  slides: NormaBannerSlide[];
}

export function NormaBannerCarousel({ slides }: NormaBannerCarouselProps) {
  const [current, setCurrent] = useState(0);

  if (!slides || slides.length === 0) return null;

  const slide = slides[current];

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section className="max-w-7xl mx-auto px-6 py-8 group">
      <div
        className="relative glass-card overflow-hidden"
        style={{
          boxShadow:
            "inset 4px 0 0 var(--primary), 0 20px 25px -5px rgb(0 0 0 / 0.1)",
        }}
      >
        <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-10">
          {/* Text */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-brand-primary mb-2 uppercase tracking-tight">
              {slide.title}
            </h2>
            {slide.description && (
              <p className="text-foreground leading-relaxed">
                {slide.description}
              </p>
            )}
          </div>

          {/* CTA */}
          {slide.button && (
            <div className="shrink-0">
              <Link
                href={slide.button.href}
                target={slide.button.isExternal ? "_blank" : undefined}
                rel={
                  slide.button.isExternal ? "noopener noreferrer" : undefined
                }
                className="bg-brand-primary text-white font-bold text-sm py-3 px-6 rounded-md hover:bg-primary transition-colors shadow-lg inline-block"
              >
                {slide.button.label}
              </Link>
            </div>
          )}
        </div>

        {/* Prev / Next arrows — visible on hover */}
        {slides.length > 1 && (
          <>
            <Button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-white/80 flex items-center justify-center text-brand-primary shadow hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Anterior"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-white/80 flex items-center justify-center text-brand-primary shadow hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Siguiente"
            >
              <ChevronRight className="size-4" />
            </Button>
          </>
        )}

        {/* Dot indicators */}
        {slides.length > 1 && (
          <div className="flex justify-center gap-1.5 pb-4">
            {slides.map((slide, i) => (
              <Button
                type="button"
                key={`dot-${slide.id}`}
                onClick={() => setCurrent(i)}
                className={`size-2 rounded-full transition-colors ${
                  i === current ? "bg-brand-primary" : "bg-brand-accent"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
