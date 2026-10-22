import { getCollectionByManager } from "@/lib/strapi";
import type { ContactPageData } from "@/types/strapi.types";

export interface ContactSubmission {
  full_name: string;
  email: string;
  phone?: string;
  cadastral_code?: string;
  message: string;
  accepts_policy: boolean;
  manager_slug: string;
}

export async function getContactPage(
  manager: string,
): Promise<ContactPageData | null> {
  const result = await getCollectionByManager<ContactPageData>(
    "contact-pages",
    manager,
    {
      fields: [
        "hero_eyebrow",
        "hero_title",
        "hero_description",
        "map_address",
        "map_city",
        "map_url",
      ],
      populate: ["channels"],
    },
    { next: { revalidate: 3600 } },
  );
  return result?.data?.[0] ?? null;
}
