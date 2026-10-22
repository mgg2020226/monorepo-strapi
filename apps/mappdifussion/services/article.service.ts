import { getCollection, getCollectionByManager } from "@/lib/strapi";
import { getStrapiImageUrl } from "@/lib/strapi-images";
import type { Image } from "@/types/strapi.types";

/* =======================
   Types
======================= */

interface ArticleAuthor {
  username: string;
  email: string;
}

interface Category {
  id: number;
  title: string;
  description: string;
}

interface Article {
  id: number;
  documentId: string;
  title: string;
  content: unknown;
  extract: string;
  slug: string;
  publication_date: string;
  image: Image;
  author?: ArticleAuthor;
  categories?: Category[];
}

/* =======================
   Services
======================= */

/**
 * Obtiene artículos activos y vigentes por manager
 */
export async function getArticles(
  manager: string,
  params?: Record<string, unknown>,
): Promise<Article[]> {
  try {
    const defaultParams = {
      populate: "*",
      sort: "publication_date:desc",
      ...params,
    };

    let response = await getCollectionByManager<Article>(
      "articles",
      manager,
      defaultParams,
      { next: { revalidate: 60 } },
    );

    // Fallback: if manager relation not set up in Strapi, fetch all
    if (!response?.data?.length) {
      response = await getCollection<Article>("articles", defaultParams, {
        next: { revalidate: 60 },
      });
    }

    return response?.data || [];
  } catch {
    return [];
  }
}

/**
 * Obtiene un artículo por slug y manager
 */
export async function getArticleBySlug(
  manager: string,
  slug: string,
): Promise<Article | null> {
  try {
    const articles = await getArticles(manager, {
      filters: {
        slug: {
          $eq: slug,
        },
      },
    });

    return articles.length > 0 ? articles[0] : null;
  } catch {
    return null;
  }
}

/**
 * Normaliza el artículo para UI
 */
export function formatArticleForDisplay(article: Article) {
  const imageUrl = getStrapiImageUrl(article?.image, "medium") || "";

  const authorName = article.author?.username || "";

  return {
    id: article.documentId || String(article.id),
    slug: article.slug,
    title: article.title,
    extract: article.extract,
    content: article.content,
    imageUrl,
    publishedAt: article.publication_date,
    author: authorName,
    categories: article.categories || [],
  };
}
