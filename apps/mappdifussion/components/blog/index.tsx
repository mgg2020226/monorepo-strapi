import { Suspense } from "react";
import { EmptyCollectionState } from "@/components/empty-collection-state";
import {
  formatArticleForDisplay,
  getArticles,
} from "@/services/article.service";
import { BlogLayout } from "./_components/blog-layout";
import { BlogSkeleton } from "./skeleton";

interface Props {
  manager: string;
}

async function BlogContent({ manager }: Props) {
  const articles = await getArticles(manager);

  if (!articles || articles.length === 0) {
    return (
      <EmptyCollectionState
        title="Aún no hay artículos publicados"
        description="Cuando este gestor publique novedades, comunicados o contenido informativo, aparecerán aquí. Mientras tanto, puede consultar resoluciones o volver al inicio."
        primaryHref={`/${manager}/resoluciones`}
        primaryLabel="Ver resoluciones"
        secondaryHref={`/${manager}`}
        secondaryLabel="Volver al inicio"
      />
    );
  }

  const formatted = articles.map(formatArticleForDisplay);

  const categoryMap = new Map<number, string>();
  for (const a of articles) {
    for (const c of a.categories ?? []) {
      if (!categoryMap.has(c.id)) categoryMap.set(c.id, c.title);
    }
  }
  const categories = Array.from(categoryMap.entries()).map(([id, title]) => ({
    id,
    title,
  }));

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-16 text-center">
        <span className="mb-6 inline-block rounded-full bg-brand-accent px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-brand-primary">
          Vigente
        </span>
        <h1 className="mb-6 text-4xl font-semibold leading-tight text-brand-primary md:text-5xl">
          Artículos
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-brand-foreground">
          Infórmese sobre los procesos de actualización catastral, normatividad
          vigente y trámites ciudadanos en el municipio.
        </p>
      </div>

      <BlogLayout
        articles={formatted}
        categories={categories}
        manager={manager}
      />
    </main>
  );
}

export default function BlogPage({ manager }: Props) {
  return (
    <Suspense fallback={<BlogSkeleton />}>
      <BlogContent manager={manager} />
    </Suspense>
  );
}
