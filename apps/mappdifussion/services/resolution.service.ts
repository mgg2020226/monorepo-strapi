import { getCollectionByManager } from "@/lib/strapi";
import { getStrapiImageUrl, getStrapiMediaUrl } from "@/lib/strapi-images";
import type { FileAsset, Image } from "@/types/strapi.types";

interface ResolutionCategory {
  id: number;
  title: string;
  description?: string;
}

interface Resolution {
  id: string;
  documentId?: string;
  title: string;
  date: Date;
  description: string;
  document?: FileAsset | null;
  image?: Image;
  categories?: ResolutionCategory[];
  resolution_type?: "avaluos" | "geografica" | "catastral";
  year?: number;
}

interface GetResolutionsParams {
  filters?: Record<string, unknown>;
  sort?: string[];
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}

export async function getResolutions(
  params: GetResolutionsParams = {},
  managerSlug: string,
): Promise<Resolution[]> {
  try {
    const response = await getCollectionByManager<Resolution>(
      "resolutions",
      managerSlug,
      {
        populate: {
          document: true,
          image: true,
          categories: true,
        },
        sort: params.sort || ["date:desc"],
        filters: params.filters,
        pagination: params.pagination,
      },
    );
    return response?.data || [];
  } catch (error) {
    throw error;
  }
}

const resolutionDateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function formatResolutionDate(date: string | Date): string {
  return resolutionDateFormatter.format(new Date(date));
}

export function formatResolutionForDisplay(resolution: Resolution) {
  const imageUrl = getStrapiImageUrl(resolution.image, "medium") || "";
  const documentUrl = getStrapiMediaUrl(resolution.document?.url) || "";

  return {
    id: resolution.id,
    title: resolution.title,
    date: resolution.date,
    formattedDate: formatResolutionDate(resolution.date),
    description: resolution.description,
    documentUrl,
    imageUrl,
    categories: resolution.categories ?? [],
    resolution_type: resolution.resolution_type,
    year: resolution.year,
  };
}
