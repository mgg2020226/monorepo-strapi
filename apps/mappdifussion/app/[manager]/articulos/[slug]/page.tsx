import ArticleDetail from "@/components/articulos";
import { getCollection } from "@/lib/strapi";
import {
  formatArticleForDisplay,
  getArticleBySlug,
  getArticles,
} from "@/services/article.service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; manager: string }>;
}) {
  const { slug, manager } = await params;
  const article = await getArticleBySlug(manager, slug);
  if (!article) return { title: "Artículo no encontrado" };
  const display = formatArticleForDisplay(article);
  return {
    title: `${article.title} | Gestor Catastral`,
    description: article.extract,
    openGraph: {
      title: article.title,
      description: article.extract,
      images: [display.imageUrl],
    },
  };
}

export async function generateStaticParams() {
  try {
    const managersResponse = await getCollection<{ slug: string }>("managers", {
      fields: ["slug"],
    });
    const managers = managersResponse.data || [];
    const allParams = await Promise.all(
      managers.map(async (mgr) => {
        try {
          const articles = await getArticles(mgr.slug);
          return articles.map((article) => ({
            manager: mgr.slug,
            slug: article.slug,
          }));
        } catch {
          return [];
        }
      }),
    );
    return allParams.flat();
  } catch {
    return [];
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string; manager: string }>;
}) {
  const { slug, manager } = await params;
  return <ArticleDetail manager={manager} slug={slug} />;
}
