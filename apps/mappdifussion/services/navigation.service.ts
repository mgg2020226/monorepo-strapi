import { getCollectionByManager } from "@/lib/strapi";
import type { Image, NavItem } from "@/types/strapi.types";

export interface Navigation {
  documentId: string;
  logo?: Image;
  items?: NavItem[];
}
/**
 * Obtiene los datos de la navegación desde Strapi (ahora como colección)
 * @returns Datos de la navegación
 */
export async function getNavigationData(
  managerSlug: string,
): Promise<Navigation | null> {
  try {
    const response = await getCollectionByManager<Navigation>(
      "navigation-layouts",
      managerSlug,
      {
        populate: {
          logo: true,
          items: {
            populate: {
              dropdown: true,
            },
          },
        },
      },
    );
    const navigationItem = response?.data?.[0];

    if (!navigationItem) {
      console.error("[Navigation] navigation-layouts is empty for manager", {
        managerSlug,
      });
      return null;
    }

    return navigationItem;
  } catch (error) {
    console.error("[Navigation] Failed to resolve navigation data", {
      managerSlug,
      error,
    });
    return null;
  }
}
