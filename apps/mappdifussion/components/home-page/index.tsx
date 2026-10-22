import { Suspense } from "react";
import { MissingDataAlert } from "@/components/missing-data-alert";
import {
  formatArticleForDisplay,
  getArticles,
} from "@/services/article.service";
import { getHomepageContent } from "@/services/homepage.service";
import FAQSection from "../faq-section";
import { ArticlesSection } from "./_componets/articles-section";
import { BentoServices } from "./_componets/bento-services";
import { HeroCatastral } from "./_componets/hero-catastral";
import { NormaBannerCarousel } from "./_componets/norma-banner-carousel";
import { ServiciosUnClic } from "./_componets/servicios-un-clic";
import {
  ArticlesSkeleton,
  HomepageContentSkeleton,
} from "./_componets/skeleton";

interface HomePageProps {
  manager: string;
}

async function HomepageContent({ manager }: HomePageProps) {
  const { heroData, normaBannerData, actionCardsData, linksData, faqData } =
    await getHomepageContent(manager);

  const hasContent =
    heroData || normaBannerData || actionCardsData || linksData || faqData;

  if (!hasContent) {
    return (
      <MissingDataAlert
        title="Página de inicio no configurada"
        description="El contenido de la página de inicio no está disponible. Por favor, crea el contenido de la homepage en el CMS para que se pueda visualizar correctamente."
        itemType="home-pages"
      />
    );
  }

  return (
    <>
      {heroData && <HeroCatastral {...heroData} />}
      {normaBannerData && <NormaBannerCarousel slides={normaBannerData} />}
      {linksData?.[0] && <ServiciosUnClic {...linksData[0]} />}
      {actionCardsData && <BentoServices {...actionCardsData} />}
      <Suspense fallback={<ArticlesSkeleton />}>
        <ArticlesContent manager={manager} />
      </Suspense>
      {faqData?.faqs && faqData.faqs.length > 0 && (
        <FAQSection data={faqData} />
      )}
    </>
  );
}

async function ArticlesContent({ manager }: HomePageProps) {
  const articlesData = await getArticles(manager, { limit: 3 });

  const formattedArticles = articlesData.map((article) => {
    const display = formatArticleForDisplay(article);
    return {
      id: display.id,
      slug: display.slug,
      title: display.title,
      extract: display.extract,
      imageUrl: display.imageUrl,
      publishedAt: display.publishedAt,
      author: display.author,
      categories: display.categories,
    };
  });

  if (formattedArticles.length === 0) return null;

  return <ArticlesSection articles={formattedArticles} />;
}

export default function HomePage({ manager }: HomePageProps) {
  return (
    <Suspense fallback={<HomepageContentSkeleton />}>
      <HomepageContent manager={manager} />
    </Suspense>
  );
}
