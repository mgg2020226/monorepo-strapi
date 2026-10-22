import { getCollectionByManager } from "@/lib/strapi";
import type { Image } from "@/types/strapi.types";

interface Metadata {
  documentId: string;
  title: string;
  description: string;
  icon?: Image;
  slug?: string;
}

/**
 * Obtiene los metadatos desde Strapi (ahora como colección)
 * @param managerSlug - Slug del manager
 * @param slug - Slug o identificador de los metadatos (opcional, por defecto 'home')
 * @returns Datos de metadata o null si no existe
 */
export async function getMetadata(
  managerSlug: string,
): Promise<Metadata | null> {
  try {
    const response = await getCollectionByManager<Metadata>(
      "metadatas",
      managerSlug,
      {
        populate: "*",
      },
    );

    const metadataItem = response?.data?.[0];

    if (!metadataItem) {
      return null;
    }

    return metadataItem;
  } catch {
    return null;
  }
}
