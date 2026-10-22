import { getCollectionByManager } from "@/lib/strapi";

interface Edicto {
  id: string;
  documentId?: string;
  title: string;
  description: string;
  fecha_publicacion: Date;
  tramite: string;
  href: string;
}

interface GetEdictoParams {
  filters?: Record<string, unknown>;
  sort?: string[];
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}

export async function getEdictos(
  params: GetEdictoParams = {},
  managerSlug: string,
): Promise<Edicto[]> {
  try {
    const response = await getCollectionByManager<Edicto>(
      "edictos",
      managerSlug,
      {
        sort: params?.sort || ["fecha_publicacion:desc"],
        filters: params?.filters,
        pagination: params?.pagination,
      },
    );
    return response?.data || [];
  } catch {
    return [];
  }
}

export function formatEdictoForDisplay(edicto: Edicto) {
  return {
    id: edicto.id,
    title: edicto.title,
    description: edicto.description,
    fecha_publicacion: edicto.fecha_publicacion,
    tramite: edicto.tramite,
    href: edicto.href,
  };
}
