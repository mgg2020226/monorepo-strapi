import "server-only";

import { createEntry, getManagerDocumentId } from "@/lib/strapi";
import type { ContactSubmission } from "./contact.service";

export async function submitContactForm(
  data: ContactSubmission,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { manager_slug, ...rest } = data;
    const managerDocumentId = await getManagerDocumentId(manager_slug);

    const payload = {
      ...rest,
      ...(managerDocumentId ? { manager: managerDocumentId } : {}),
    };

    await createEntry("contacts", payload);

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo conectar con el servidor.",
    };
  }
}
