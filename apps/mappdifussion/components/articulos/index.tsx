import {
  type BlocksContent,
  BlocksRenderer,
} from "@strapi/blocks-react-renderer";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArticleSidebar } from "@/components/blog/_components/article-sidebar";
import { ShareButton } from "@/components/blog/_components/share-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import {
  formatArticleForDisplay,
  getArticleBySlug,
  getArticles,
} from "@/services/article.service";
import { ArticleMainSkeleton, ArticleSidebarSkeleton } from "./skeleton";

interface Props {
  manager: string;
  slug: string;
}

async function ArticleMain({ manager, slug }: Props) {
  const article = await getArticleBySlug(manager, slug);
  if (!article) notFound();

  const display = formatArticleForDisplay(article);
  const formattedDate = format(
    new Date(display.publishedAt),
    "d 'de' MMMM, yyyy",
    { locale: es },
  );
  const firstCategory = display.categories[0];

  return (
    <article className="lg:col-span-8">
      {/* Breadcrumb */}
      <Breadcrumb className="flex items-center gap-2 text-sm text-brand-muted-foreground mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${manager}`}>Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${manager}/articulos`}>
              Artículos
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-brand-foreground font-medium">
              {article.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <header className="mb-10">
        {firstCategory && (
          <span className="inline-block bg-brand-accent text-brand-primary px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-4">
            {firstCategory.title}
          </span>
        )}
        <h1 className="text-xl font-semibold text-brand-primary leading-tight mb-6">
          {article.title}
        </h1>

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-6 py-6 border-y border-brand-accent">
          {display.author && (
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-brand-primary flex items-center justify-center text-brand-primary-foreground font-bold text-sm shrink-0">
                {display.author.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm font-semibold text-brand-primary">
                {display.author}
              </p>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-brand-foreground">
            <CalendarDays className="size-4" />
            <span>{formattedDate}</span>
          </div>
          {/* Share / Bookmark */}
          <div className="ml-auto flex gap-2">
            <ShareButton title={article.title} />
          </div>
        </div>
      </header>

      {/* Hero image */}
      {display.imageUrl && (
        <Card className="relative w-full aspect-video rounded-xl overflow-hidden mb-12 shadow-sm">
          <Image
            src={display.imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover"
            priority
          />
          <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded">
            Archivo Digital Catastral
          </div>
        </Card>
      )}

      {/* Extract (lead paragraph) */}
      {article.extract && (
        <p className="font-medium text-brand-primary leading-relaxed text-lg mb-6">
          {article.extract}
        </p>
      )}

      {/* Article body */}
      <div
        className="
          text-lg
          [&_p]:mb-6 [&_p]:leading-[1.8] [&_p]:text-brand-foreground
          [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:text-brand-primary [&_h2]:mt-10 [&_h2]:mb-4
          [&_h3]:font-bold [&_h3]:text-xl [&_h3]:text-brand-primary [&_h3]:mt-8 [&_h3]:mb-3
          [&_blockquote]:my-10 [&_blockquote]:p-8 [&_blockquote]:bg-brand-muted [&_blockquote]:shadow-[inset_3px_0_0_var(--brand-primary)] [&_blockquote]:rounded-r-lg
          [&_blockquote_p]:text-xl [&_blockquote_p]:italic [&_blockquote_p]:text-brand-primary [&_blockquote_p]:font-semibold [&_blockquote_p]:leading-relaxed [&_blockquote_p]:mb-0
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_li]:text-brand-foreground [&_li]:mb-2
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6
          [&_a]:text-brand-primary [&_a]:underline
          [&_img]:rounded-lg [&_img]:shadow-md [&_img]:my-4
          [&_strong]:text-brand-foreground [&_strong]:font-semibold
        "
      >
        <BlocksRenderer content={article.content as BlocksContent} />
      </div>

      {/* Tags (categories as tags) */}
      {display.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-12 py-8 border-t border-brand-accent">
          <span className="text-xs font-bold text-brand-muted-foreground mr-2 uppercase self-center">
            Etiquetas:
          </span>
          {display.categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${manager}/articulos`}
              className="px-3 py-1 bg-brand-muted hover:bg-brand-accent text-brand-primary rounded-full text-xs transition-colors"
            >
              {cat.title}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}

async function ArticleSidebarContent({ manager, slug }: Props) {
  const allArticles = await getArticles(manager, { limit: 10 });

  const catCounts = new Map<string, number>();
  for (const a of allArticles) {
    for (const c of a.categories ?? []) {
      catCounts.set(c.title, (catCounts.get(c.title) ?? 0) + 1);
    }
  }
  const popularCategories = Array.from(catCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([title, count]) => ({ title, count, href: `/${manager}/articulos` }));

  const article = allArticles.find((a) => a.slug === slug);
  const relatedArticles = allArticles
    .filter((a) => a.slug !== slug)
    .slice(0, 3)
    .map((a) => ({ slug: a.slug, title: a.title }));

  return (
    <ArticleSidebar
      manager={manager}
      popularCategories={popularCategories}
      relatedArticles={relatedArticles}
    />
  );
}

export default function ArticleDetail({ manager, slug }: Props) {
  return (
    <div className="bg-brand-background min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Suspense fallback={<ArticleMainSkeleton />}>
            <ArticleMain manager={manager} slug={slug} />
          </Suspense>
          <Suspense fallback={<ArticleSidebarSkeleton />}>
            <ArticleSidebarContent manager={manager} slug={slug} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
