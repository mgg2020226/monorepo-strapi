import { getCollectionByManager } from "@/lib/strapi";

interface TermsOfUsePageType {
  documentId: string;
  content: unknown[];
  title: string;
  slug?: string;
}

export async function getTermsOfUsePage(
  managerSlug: string,
): Promise<TermsOfUsePageType | null> {
  try {
    const response = await getCollectionByManager<TermsOfUsePageType>(
      "terms-of-use-pages",
      managerSlug,
      {
        populate: "*",
      },
    );

    return response?.data?.[0] ?? null;
  } catch {
    return null;
  }
}
