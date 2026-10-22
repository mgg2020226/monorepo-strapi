import { getCollectionByManager } from "@/lib/strapi";
import type { FooterLink, Image } from "@/types/strapi.types";
import type { SocialLink } from "./about.service";

interface ContactChannel {
  id: number;
  label: string;
  type: string;
  value: string;
  icon?: string;
}

export interface Footer {
  documentId: string;
  name?: string;
  copyright_text?: string;
  address?: string;
  social_links?: SocialLink[];
  footer_links?: FooterLink[];
  hours?: string;
  contact_channels?: ContactChannel[];
  slug?: string;
  logo?: Image;
  description?: string;
}

export async function getFooterData(
  managerSlug: string,
  _slug = "main",
): Promise<Footer | null> {
  try {
    const response = await getCollectionByManager<Footer>(
      "footer-layouts",
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
