import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

const CATEGORY_COLORS: Record<string, string> = {
  institucional: "bg-brand-success/10 text-brand-success",
  capacitación: "bg-brand-accent text-brand-primary",
  capacitacion: "bg-brand-accent text-brand-primary",
  informes: "bg-brand-warning/10 text-brand-warning",
  normatividad: "bg-brand-accent text-brand-primary",
  trámites: "bg-brand-warning/10 text-brand-warning",
  tramites: "bg-brand-warning/10 text-brand-warning",
};

function getCategoryColor(title: string) {
  const key = title.toLowerCase();
  return CATEGORY_COLORS[key] || "bg-brand-accent text-brand-primary";
}

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: Readonly<ArticleCardProps>) {
  const formattedDate = (() => {
    try {
      return format(new Date(article.publishedAt), "dd MMM yyyy", {
        locale: es,
      });
    } catch {
      return article.publishedAt;
    }
  })();

  const firstCategory = article.categories?.[0];

  return (
    <Link
      href={`articulos/${article.slug}`}
      className="group flex flex-col h-full"
    >
      <Card className="p-0 h-full flex flex-col overflow-hidden transition-shadow hover:shadow-md">
        <CardHeader className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </CardHeader>

        <CardContent className="pb-4">
          {/* Meta */}
          <div className="flex items-center gap-3">
            {firstCategory && (
              <Badge
                className={`text-xs font-bold uppercase tracking-wider ${getCategoryColor(
                  firstCategory.title,
                )}`}
              >
                {firstCategory.title}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground font-medium">
              {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-brand-primary leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors mb-3">
            {article.title}
          </h3>
          {/* Extract */}
          <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
            {article.extract}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
