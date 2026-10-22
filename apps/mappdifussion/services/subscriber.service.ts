import "server-only";

import { randomBytes } from "node:crypto";
import {
  createEntry,
  getCollection,
  getManagerDocumentId,
  updateEntry,
} from "@/lib/strapi";

interface SubscriberRecord {
  documentId: string;
  active: boolean;
}

export async function subscribeEmail(
  email: string,
  managerSlug: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const managerDocumentId = await getManagerDocumentId(managerSlug);
    if (!managerDocumentId) {
      return { ok: false, error: "Gestor no encontrado." };
    }

    const check = await getCollection<SubscriberRecord>("subscribers", {
      filters: {
        email: { $eq: email },
        manager: { documentId: { $eq: managerDocumentId } },
      },
      fields: ["documentId", "active"],
    });

    const existing = check.data[0];

    if (existing) {
      if (existing.active) {
        return { ok: false, error: "Este correo ya esta suscrito." };
      }
      await updateEntry("subscribers", existing.documentId, {
        active: true,
        unsubscribe_token: randomBytes(32).toString("hex"),
      });
      return { ok: true };
    }

    await createEntry("subscribers", {
      email,
      active: true,
      unsubscribe_token: randomBytes(32).toString("hex"),
      manager: managerDocumentId,
    });

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

export async function unsubscribeByToken(
  token: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const find = await getCollection<SubscriberRecord>("subscribers", {
      filters: {
        unsubscribe_token: { $eq: token },
        active: { $eq: true },
      },
      fields: ["documentId"],
    });
    const subscriber = find.data[0];

    if (!subscriber) {
      return { ok: false, error: "Token invalido o ya dado de baja." };
    }

    await updateEntry("subscribers", subscriber.documentId, { active: false });

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
