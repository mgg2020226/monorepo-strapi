"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getStrapiImageUrl } from "@/lib/strapi-images";
import type { HeroSection } from "@/types/strapi.types";
import { Button } from "../../ui/button";

type HeroCatastralProps = Omit<HeroSection, "__component" | "id">;

export function HeroCatastral({ slides }: HeroCatastralProps) {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);

  const count = slides?.length ?? 0;

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === active) return;
      setAnimating(true);
      setTimeout(() => {
        setActive(index);
        setAnimating(false);
      }, 300);
    },
    [active, animating],
  );

  const prev = useCallback(
    () => goTo((active - 1 + count) % count),
    [active, count, goTo],
  );
  const next = useCallback(
    () => goTo((active + 1) % count),
    [active, count, goTo],
  );

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [count, next]);

  if (count === 0) return null;

  const slide = slides[active];
  const bgUrl = slide.background_image
    ? getStrapiImageUrl(slide.background_image)
    : null;

  return (
    <section className="relative h-[560px] flex items-center overflow-hidden bg-brand-primary m-3 rounded-md">
      {/* Background image — más visible */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${animating ? "opacity-0" : "opacity-100"}`}
      >
        {bgUrl && (
          <Image
            src={bgUrl}
            alt={slide.title}
            fill
            sizes="100vw"
            className="object-cover opacity-75 "
          />
        )}
        {/* Overlay ligero: tinte azul suave + gradiente izquierda solo para legibilidad */}
        <div className="absolute inset-0 bg-brand-primary/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/70 via-brand-primary/20 to-transparent" />
      </div>

      {/* Content con fade — glass card */}
      <div
        className={`relative z-10 max-w-7xl mx-auto px-6 w-full transition-all duration-300 ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
      >
        <div className="max-w-2xl">
          {slide.eyebrow && (
            <span className="inline-block bg-white/15 backdrop-blur-sm text-white text-[11px] font-bold tracking-widest uppercase py-1 px-3 rounded-full mb-5 border border-white/20">
              {slide.eyebrow}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-[1.1] drop-shadow-sm">
            {slide.title}
          </h1>
          {(slide.description || slide.subtitle) && (
            <p className="text-base text-white/85 mb-7 font-light leading-relaxed">
              {slide.description ?? slide.subtitle}
            </p>
          )}
          {slide.buttons && slide.buttons.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {slide.buttons.map((btn, i) =>
                i === 0 ? (
                  <Link
                    key={btn.id ?? btn.href}
                    href={btn.href}
                    target={btn.isExternal ? "_blank" : undefined}
                    rel={btn.isExternal ? "noopener noreferrer" : undefined}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium py-2.5 px-7 rounded-full hover:bg-white hover:text-brand-primary transition-colors flex items-center gap-2 shadow-sm"
                  >
                    {btn.label}
                    <ArrowRight className="size-4" />
                  </Link>
                ) : (
                  <Link
                    key={btn.id ?? btn.href}
                    href={btn.href}
                    target={btn.isExternal ? "_blank" : undefined}
                    rel={btn.isExternal ? "noopener noreferrer" : undefined}
                    className="bg-transparent border border-white/40 text-white font-medium py-2.5 px-7 rounded-full hover:bg-white/10 transition-colors"
                  >
                    {btn.label}
                  </Link>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {/* Arrows — solo si hay más de 1 slide */}
      {count > 1 && (
        <>
          <Button
            type="button"
            onClick={prev}
            className="absolute left-4 bottom-8 z-20 rounded-full bg-white/15 backdrop-blur-sm p-2 text-white hover:bg-white/25 transition-colors"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            type="button"
            onClick={next}
            className="absolute right-4 bottom-8 z-20 rounded-full bg-white/15 backdrop-blur-sm p-2 text-white hover:bg-white/25 transition-colors"
            aria-label="Slide siguiente"
          >
            <ChevronRight className="size-5" />
          </Button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((slide, i) => (
          <Button
            type="button"
            key={`dot-${slide.id}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active
                ? "w-12 bg-white"
                : "w-6 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
