import qs from "qs";
import { getStrapiBaseUrl } from "@/lib/strapi-base-url";

const API_URL = getStrapiBaseUrl();

type FetchOptions = {
  headers?: Record<string, string>;
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

interface ManagerRecord {
  documentId: string;
}

interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

type StrapiQueryParams = {
  filters?: Record<string, unknown>;
  populate?: Record<string, unknown> | string | string[];
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  fields?: string[];
  publicationState?: "live" | "preview";
};

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
  customHeaders: Record<string, string> = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...customHeaders,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("[Strapi] API request failed", {
      endpoint,
      status: response.status,
      statusText: response.statusText,
      error: errorData,
    });
    throw new Error(
      errorData?.error?.message || `API request failed (${response.status})`,
    );
  }

  return response.json();
}

export async function managerExists(managerSlug: string): Promise<boolean> {
  if (!managerSlug) {
    return false;
  }

  try {
    const response = await fetchAPI<{ data: ManagerRecord[] }>(
      `/api/managers?filters[slug][$eq]=${managerSlug}&fields[0]=documentId`,
      { method: "GET" },
    );

    return (response.data?.length ?? 0) > 0;
  } catch {
    return false;
  }
}

export async function getManagerDocumentId(
  managerSlug: string,
): Promise<string | null> {
  if (!managerSlug) {
    return null;
  }

  try {
    const response = await fetchAPI<{ data: ManagerRecord[] }>(
      `/api/managers?filters[slug][$eq]=${managerSlug}&fields[0]=documentId`,
      { method: "GET" },
    );

    const managerDocumentId = response.data?.[0]?.documentId ?? null;

    if (!managerDocumentId) {
      console.error("[Strapi] Manager documentId not found", {
        managerSlug,
      });
    }

    return managerDocumentId;
  } catch (error) {
    console.error("[Strapi] Failed to fetch manager documentId", {
      managerSlug,
      error,
    });
    return null;
  }
}

function withManagerFilter(
  params: StrapiQueryParams,
  managerDocumentId: string,
) {
  return {
    ...params,
    filters: {
      ...(params.filters || {}),
      manager: {
        documentId: { $eq: managerDocumentId },
      },
    },
  };
}

export async function getCollectionByManager<T>(
  collection: string,
  managerSlug: string,
  params: StrapiQueryParams = {},
  options: FetchOptions = {},
): Promise<{ data: T[]; meta?: StrapiMeta } | null> {
  const managerDocumentId = await getManagerDocumentId(managerSlug);

  if (!managerDocumentId) {
    console.error("[Strapi] Skipping manager-scoped collection fetch", {
      collection,
      managerSlug,
      reason: "manager documentId not found",
    });
    return null;
  }

  const query = qs.stringify(withManagerFilter(params, managerDocumentId), {
    encodeValuesOnly: true,
  });

  try {
    return await fetchAPI(`/api/${collection}?${query}`, {
      method: "GET",
      headers: options.headers,
      next: options.next,
    });
  } catch (error) {
    console.error("[Strapi] Failed to fetch manager-scoped collection", {
      collection,
      managerSlug,
      managerDocumentId,
      error,
    });
    return null;
  }
}

export async function getCollection<T>(
  collection: string,
  params?: StrapiQueryParams,
  options: FetchOptions = {},
): Promise<{ data: T[]; meta?: StrapiMeta }> {
  const query = params
    ? `?${qs.stringify(params, { encodeValuesOnly: true })}`
    : "";

  return fetchAPI(`/api/${collection}${query}`, {
    method: "GET",
    headers: options.headers,
    next: options.next,
  });
}

export async function createEntry<T>(
  collection: string,
  data: Record<string, unknown>,
): Promise<{ data: T }> {
  return fetchAPI(`/api/${collection}`, {
    method: "POST",
    body: JSON.stringify({ data }),
  });
}

export async function updateEntry<T>(
  collection: string,
  id: number | string,
  data: Record<string, unknown>,
): Promise<{ data: T }> {
  return fetchAPI(`/api/${collection}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ data }),
  });
}
