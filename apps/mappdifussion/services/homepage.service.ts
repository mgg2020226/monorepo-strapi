import { getCollectionByManager } from "@/lib/strapi";
import type {
  ActionCardsSection,
  FAQSection,
  HeroSection,
  HomepageData,
  LinksSection,
  NormaBannerSection,
  NormaBannerSlide,
  ServiciosSection,
} from "@/types/strapi.types";

type HeroData = Omit<HeroSection, "__component" | "id">;

/**
 * Obtiene los datos raw de la homepage desde Strapi (por manager)
 */
async function getHomepageData(
  managerSlug: string,
): Promise<HomepageData | null> {
  try {
    const response = await getCollectionByManager<HomepageData["data"]>(
      "home-pages",
      managerSlug,
      {
        populate: {
          homepage: {
            on: {
              "layout.hero-section": {
                populate: {
                  slides: {
                    populate: ["background_image", "buttons"],
                  },
                },
              },
              "layout.norma-banner": {
                populate: {
                  slides: {
                    populate: ["button"],
                  },
                },
              },
              "layout.action-cards": {
                populate: {
                  cards: {
                    populate: ["button"],
                  },
                  view_all_button: true,
                },
              },
              "layout.link-section": {
                populate: ["links", "view_all_button"],
              },
              "layout.news-section": {
                populate: ["articles", "button"],
              },
              "layout.faq-section": {
                populate: ["faqs"],
              },
            },
          },
        },
      },
    );
    const homepageItem = response?.data?.[0];

    if (!homepageItem) {
      console.error("[Homepage] home-pages is empty for manager", {
        managerSlug,
      });
      return null;
    }

    if (homepageItem.homepage) {
      homepageItem.homepage = homepageItem.homepage.map((component) => {
        if (component.__component === "layout.faq-section" && component.faqs) {
          return {
            ...component,
            faqs: component.faqs.filter((faq) => faq.is_active === true),
          } as FAQSection;
        }
        return component;
      });
    }

    return {
      data: homepageItem,
    };
  } catch (error) {
    console.error("[Homepage] Failed to fetch homepage data", {
      managerSlug,
      error,
    });
    return null;
  }
}

/**
 * Extrae los datos del hero section
 */
function extractHeroData(response: HomepageData): HeroData | null {
  const heroSection = response.data.homepage?.find(
    (item): item is HeroSection => item.__component === "layout.hero-section",
  );

  if (!heroSection) return null;

  const { __component, id, ...heroData } = heroSection;
  return heroData;
}

/**
 * Extrae el norma banner carousel
 */
function extractNormaBanner(response: HomepageData): NormaBannerSlide[] | null {
  const bannerSection = response.data.homepage?.find(
    (item): item is NormaBannerSection =>
      item.__component === "layout.norma-banner",
  );

  const slides = bannerSection?.slides || [];
  return slides.length > 0 ? slides : null;
}

/**
 * Extrae las action cards (full section data)
 */
function extractActionCards(
  response: HomepageData,
): Omit<ActionCardsSection, "__component" | "id"> | null {
  const actionCardsSection = response.data.homepage?.find(
    (item): item is ActionCardsSection =>
      item.__component === "layout.action-cards",
  );

  if (!actionCardsSection?.cards?.length) return null;

  const { __component, id, ...sectionData } = actionCardsSection;
  return sectionData;
}

/**
 * Extrae los links
 */
function extractLinks(response: HomepageData): LinksSection[] | null {
  const linksSection = response.data.homepage?.filter(
    (item): item is LinksSection => item.__component === "layout.link-section",
  );

  return linksSection && linksSection.length > 0 ? linksSection : null;
}

/**
 * Extrae las FAQs
 */
function extractFAQ(response: HomepageData): FAQSection | null {
  const faqSection = response.data.homepage?.filter(
    (item): item is FAQSection => item.__component === "layout.faq-section",
  );

  return faqSection && faqSection.length > 0 ? faqSection[0] : null;
}

/**
 * Extrae la sección servicios-un-clic
 */
function extractServicios(
  response: HomepageData,
): Omit<ServiciosSection, "__component" | "id"> | null {
  const section = response.data.homepage?.find(
    (item): item is ServiciosSection =>
      item.__component === "layout.servicios-section",
  );

  if (!section?.items?.length) return null;

  const { __component, id, ...data } = section;
  return data;
}

/**
 * Obtiene todo el contenido procesado de la homepage (por manager)
 */
export async function getHomepageContent(managerSlug: string) {
  try {
    const response = await getHomepageData(managerSlug);

    if (!response) {
      return {
        heroData: null,
        normaBannerData: null,
        actionCardsData: null,
        linksData: null,
        faqData: null,
        serviciosData: null,
      };
    }

    return {
      heroData: extractHeroData(response),
      normaBannerData: extractNormaBanner(response),
      actionCardsData: extractActionCards(response),
      linksData: extractLinks(response),
      faqData: extractFAQ(response),
      serviciosData: extractServicios(response),
    };
  } catch {
    return {
      heroData: null,
      normaBannerData: null,
      actionCardsData: null,
      linksData: null,
      faqData: null,
      serviciosData: null,
    };
  }
}
