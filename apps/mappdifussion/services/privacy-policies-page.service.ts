import { getCollectionByManager } from "@/lib/strapi";

interface PrivacyPoliciesPageType {
  documentId: string;
  content: unknown[];
  title: string;
  slug?: string;
}

/**
 * Obtiene la página de políticas de privacidad desde Strapi (ahora como colección)
 * @param slug - Slug o identificador de la página (opcional, por defecto 'main')
 * @returns Datos de la página de políticas de privacidad
 */
export async function getPrivacyPoliciesPage(
  manager: string,
): Promise<PrivacyPoliciesPageType | null> {
  try {
    const response = await getCollectionByManager<PrivacyPoliciesPageType>(
      "privacy-policies-pages",
      manager,
      {
        populate: "*",
      },
    );

    const pageData = response?.data?.[0];

    if (!pageData) {
      return null;
    }

    return pageData;
  } catch {
    return null;
  }
}
