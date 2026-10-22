import { getCollectionByManager } from "@/lib/strapi";
import type { ServicioItem, ServicioType } from "@/types/strapi.types";

export async function getServicios(
  managerSlug: string,
  type?: ServicioType,
): Promise<ServicioItem[]> {
  try {
    const filters = type ? { type: { $eq: type } } : undefined;

    const response = await getCollectionByManager<ServicioItem>(
      "servicio-items",
      managerSlug,
      {
        populate: {
          requirements: true,
          deliverables: true,
        },
        filters,
        sort: ["sort_order:asc", "title:asc"],
      },
    );

    return response?.data ?? [];
  } catch {
    return [];
  }
}
