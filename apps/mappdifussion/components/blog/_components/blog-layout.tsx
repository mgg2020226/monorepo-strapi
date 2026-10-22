"use client";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  Search,
  SearchX,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { NewsletterSection } from "@/components/blog/_components/newsletter-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Category {
  id: number;
  title: string;
}

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  extract: string;
  imageUrl: string;
  publishedAt: string;
  author: string;
  categories: Category[];
}

interface Props {
  articles: ArticleItem[];
  categories: Category[];
  manager: string;
}

const ITEMS_PER_PAGE = 5;

function formatDateLong(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Bogota",
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  normatividad: "bg-brand-accent text-brand-primary",
  trámites: "bg-brand-warning/10 text-brand-warning",
  tramites: "bg-brand-warning/10 text-brand-warning",
  actualización: "bg-brand-accent text-brand-primary",
  actualizacion: "bg-brand-accent text-brand-primary",
  tecnología: "bg-brand-accent text-brand-primary",
  tecnologia: "bg-brand-accent text-brand-primary",
  reportes: "bg-brand-success/10 text-brand-success",
  rural: "bg-brand-success/10 text-brand-success",
};

function categoryColor(title: string) {
  return (
    CATEGORY_COLORS[title.toLowerCase()] ?? "bg-brand-accent text-brand-primary"
  );
}

function CategoryBadge({ title }: { title: string }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${categoryColor(title)}`}
    >
      {title}
    </span>
  );
}

function FeaturedCard({
  article,
  manager,
}: {
  article: ArticleItem;
  manager: string;
}) {
  const category = article.categories[0];

  return (
    <Link
      href={`/${manager}/articulos/${article.slug}`}
      className="md:col-span-8"
    >
      <Card className="glass group relative overflow-hidden rounded-xl transition-shadow duration-300 hover:shadow-lg">
        <div className="aspect-video overflow-hidden">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              width={800}
              height={450}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-brand-accent">
              <FileText className="size-12 text-brand-primary" />
            </div>
          )}
        </div>
        <div className="p-8">
          <div className="mb-4 flex items-center gap-4">
            {category && <CategoryBadge title={category.title} />}
            <span className="text-xs font-medium text-muted-foreground">
              {formatDateLong(article.publishedAt)}
            </span>
          </div>
          <h2 className="mb-4 text-2xl font-semibold leading-tight text-brand-primary transition-colors group-hover:text-brand-primary">
            {article.title}
          </h2>
          <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-foreground">
            {article.extract}
          </p>
          <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-primary hover:underline">
            LEER ARTÍCULO COMPLETO
            <ArrowRight className="size-4" />
          </p>
        </div>
      </Card>
    </Link>
  );
}

function SideCard({
  article,
  manager,
}: {
  article: ArticleItem;
  manager: string;
}) {
  const category = article.categories[0];

  return (
    <Link
      href={`/${manager}/articulos/${article.slug}`}
      className="md:col-span-4"
    >
      <Card className="glass group h-full overflow-hidden rounded-xl transition-shadow hover:shadow-md">
        <div className="h-48 overflow-hidden">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              width={400}
              height={192}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-brand-accent">
              <FileText className="size-10 text-brand-primary" />
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="mb-3 flex items-center gap-3">
            {category && <CategoryBadge title={category.title} />}
            <span className="text-xs font-medium text-muted-foreground">
              {formatDateLong(article.publishedAt)}
            </span>
          </div>
          <h3 className="mb-3 text-lg font-semibold leading-snug text-brand-primary transition-colors group-hover:text-brand-primary">
            {article.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-foreground">
            {article.extract}
          </p>
          <p className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-primary group-hover:underline">
            Ver más
            <ArrowRight className="size-3" />
          </p>
        </div>
      </Card>
    </Link>
  );
}

function GridCard({
  article,
  manager,
}: {
  article: ArticleItem;
  manager: string;
}) {
  const category = article.categories[0];

  return (
    <Link href={`/${manager}/articulos/${article.slug}`}>
      <Card className="glass group overflow-hidden rounded-xl transition-shadow hover:shadow-md">
        <div className="h-40 overflow-hidden">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              width={400}
              height={160}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-brand-accent">
              <FileText className="size-8 text-brand-primary" />
            </div>
          )}
        </div>
        <div className="p-6">
          {category && <CategoryBadge title={category.title} />}
          <h4 className="mb-2 mt-3 text-base font-semibold leading-snug text-brand-primary transition-colors group-hover:text-brand-primary">
            {article.title}
          </h4>
          <p className="mb-4 line-clamp-2 text-xs text-foreground">
            {article.extract}
          </p>
          <p className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-primary group-hover:underline">
            Leer más
            <ArrowRight className="size-3" />
          </p>
        </div>
      </Card>
    </Link>
  );
}

function Newsletter({ manager }: { manager: string }) {
  return <NewsletterSection manager={manager} />;
}

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: (number | "…")[] = [1];

  if (current > 3) {
    pages.push("…");
  }

  for (
    let index = Math.max(2, current - 1);
    index <= Math.min(total - 1, current + 1);
    index++
  ) {
    pages.push(index);
  }

  if (current < total - 2) {
    pages.push("…");
  }

  pages.push(total);
  return pages;
}

export function BlogLayout({ articles, categories, manager }: Props) {
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...articles];

    if (activeCat !== null) {
      result = result.filter((article) =>
        article.categories.some((category) => category.id === activeCat),
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (article) =>
          article.title?.toLowerCase().includes(query) ||
          article.extract?.toLowerCase().includes(query) ||
          article.categories.some((category) =>
            category.title?.toLowerCase().includes(query),
          ),
      );
    }

    return result;
  }, [articles, activeCat, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageItems = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const featured = pageItems[0] ?? null;
  const side = pageItems[1] ?? null;
  const gridItems = pageItems.slice(2);

  function resetPage() {
    setPage(1);
  }

  return (
    <>
      <Card className="glass-panel sticky top-20 z-20 mb-12 mt-6 flex flex-col items-center justify-between gap-6 p-4 md:top-25 md:mt-8 md:flex-row">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => {
              setActiveCat(null);
              resetPage();
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCat === null
                ? "bg-brand-primary text-white"
                : "border-2 border-accent bg-transparent text-brand-primary hover:border-primary"
            }`}
          >
            Todos
          </Button>
          {categories.map((category) => (
            <Button
              type="button"
              key={category.id}
              onClick={() => {
                setActiveCat(category.id);
                resetPage();
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCat === category.id
                  ? "bg-brand-primary text-white"
                  : "border-2 border-accent bg-transparent text-brand-primary hover:border-primary"
              }`}
            >
              {category.title}
            </Button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Input
            type="text"
            placeholder="Buscar artículos..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              resetPage();
            }}
            className="h-10 w-full rounded-full border border-input pl-10 pr-4 text-sm outline-none transition-[border-color,box-shadow] focus:border-transparent focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </Card>

      {pageItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {featured && <FeaturedCard article={featured} manager={manager} />}
          {side && <SideCard article={side} manager={manager} />}
          {gridItems.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:col-span-12 md:grid-cols-3">
              {gridItems.map((article) => (
                <GridCard
                  key={article.id}
                  article={article}
                  manager={manager}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="py-20 text-center">
          <SearchX className="mx-auto size-12 text-border" />
          <p className="mt-4 text-foreground">
            No se encontraron artículos con los filtros aplicados.
          </p>
        </div>
      )}

      <Newsletter manager={manager} />

      {totalPages > 1 && (
        <nav className="mt-16 flex items-center justify-center gap-2">
          <Button
            type="button"
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            disabled={page === 1}
            className="flex size-10 items-center justify-center rounded-lg border-2 border-accent text-brand-primary transition-colors hover:bg-brand-accent disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="size-5" />
          </Button>

          {pageNumbers(page, totalPages).map((value, index, items) =>
            value === "…" ? (
              <span
                key={
                  index < items.length / 2 ? "ellipsis-start" : "ellipsis-end"
                }
                className="px-2 text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <Button
                type="button"
                key={value}
                onClick={() => setPage(value as number)}
                className={`flex size-10 items-center justify-center rounded-lg text-sm font-bold transition-all ${
                  page === value
                    ? "bg-primary text-brand-primary-foreground"
                    : "border-2 border-accent text-foreground hover:border-primary hover:text-brand-primary"
                }`}
              >
                {value}
              </Button>
            ),
          )}

          <Button
            type="button"
            onClick={() =>
              setPage((current) => Math.min(current + 1, totalPages))
            }
            disabled={page === totalPages}
            className="flex size-10 items-center justify-center rounded-lg border-2 border-accent text-brand-primary transition-colors hover:bg-brand-accent disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="size-5" />
          </Button>
        </nav>
      )}
    </>
  );
}
