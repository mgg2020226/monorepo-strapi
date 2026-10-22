"use client";

import { useMemo, useState } from "react";
import type { ServicioItem } from "@/types/strapi.types";
import { ServicioDetailCard } from "./servicio-detail-card";
import { ServicioSidebar } from "./servicio-sidebar";
import { ServicioCarouselSection } from "./servicios-carousel";

interface Props {
  items: ServicioItem[];
}

export function ServiciosContent({ items }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(
    items[0]?.id ?? null,
  );
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(items.flatMap((i) => (i.category ? [i.category] : []))),
    ) as string[];
    return cats;
  }, [items]);

  const filtered = useMemo(
    () =>
      category === "all" ? items : items.filter((i) => i.category === category),
    [items, category],
  );

  const selected =
    filtered.find((item) => item.id === selectedId) ?? filtered[0];

  if (!selected) {
    return null;
  }

  return (
    <>
      <ServicioCarouselSection
        filtered={filtered}
        selectedId={selectedId}
        onSelect={(item) => setSelectedId(item.id)}
        categories={categories}
        category={category}
        onCategoryChange={setCategory}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ServicioDetailCard selected={selected} />
        </div>
        <ServicioSidebar selected={selected} />
      </div>
    </>
  );
}
