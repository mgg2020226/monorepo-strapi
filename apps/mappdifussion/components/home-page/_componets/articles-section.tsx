import Link from "next/link";
import { ArticleCard } from "@/components/home-page/_componets/article-card";
import { Button } from "@/components/ui/button";

interface Category {
  id: number;
  title: string;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  extract: string;
  imageUrl: string;
  publishedAt: string;
  author: string;
  categories?: Category[];
}

interface ArticlesSectionProps {
  articles: Article[];
  title?: string;
}

export function ArticlesSection({
  articles,
  title = "Actualidad y Noticias",
}: Readonly<ArticlesSectionProps>) {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-background py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-brand-primary">
            {title}
          </h2>
          <div className="w-16 h-1 bg-brand-primary mt-3 rounded-full" />
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <Link href="articulos">
            <Button
              variant="outline"
              className="border-2 border-brand-primary text-brand-primary px-8 py-3 rounded-full font-semibold hover:bg-brand-primary hover:text-white transition-colors"
            >
              Ver todos los artículos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
