import { getCollectionByManager } from "@/lib/strapi";
import type { ThemeSettings } from "@/types/strapi.types";

export async function getThemeSettings(
  managerSlug: string,
): Promise<ThemeSettings | null> {
  try {
    const response = await getCollectionByManager<ThemeSettings>(
      "theme-settings",
      managerSlug,
      {},
    );
    return response?.data?.[0] ?? null;
  } catch {
    return null;
  }
}
