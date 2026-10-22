import { getCollectionByManager } from "@/lib/strapi";
import { toStrapiUrl } from "@/lib/strapi-base-url";
import { getStrapiImageUrl } from "@/lib/strapi-images";
import type { Image } from "@/types/strapi.types";

interface ConferencistRaw {
  id: number;
  name: string;
  position?: string;
  description?: string;
  photo?: { url?: string };
}

interface ResourceRaw {
  id: number;
  title: string;
  locked?: boolean;
  url?: string;
}

interface AgendaEventRaw {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  full_description?: string;
  date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  event_type?: EventType;
  modality?: EventModality;
  category?: string;
  is_featured?: boolean;
  registration_url?: string;
  image?: Image;
  agenda_items?: AgendaItem[];
  conferencistas?: ConferencistRaw[];
  recursos?: ResourceRaw[];
}

type EventType =
  | "tecnico"
  | "academico"
  | "internacional"
  | "operacional"
  | "civico";

export interface AgendaEvent {
  id: string;
  documentId: string;
  title: string;
  description?: string;
  date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  event_type?: EventType;
  is_featured?: boolean;
  registration_url?: string;
  imageUrl?: string;
}

export const EVENT_TYPE_META: Record<
  EventType,
  { label: string; color: string; bg: string; border: string }
> = {
  tecnico: {
    label: "Técnico",
    color: "text-brand-primary",
    bg: "bg-brand-accent",
    border: "border-primary",
  },
  academico: {
    label: "Académico",
    color: "text-brand-warning",
    bg: "bg-brand-warning/10",
    border: "border-brand-warning",
  },
  internacional: {
    label: "Internacional",
    color: "text-brand-primary-foreground",
    bg: "bg-brand-primary",
    border: "border-brand-primary",
  },
  operacional: {
    label: "Operativo",
    color: "text-brand-primary",
    bg: "bg-brand-accent",
    border: "border-primary",
  },
  civico: {
    label: "Cívico",
    color: "text-brand-success",
    bg: "bg-brand-success/10",
    border: "border-brand-success",
  },
};

interface AgendaItem {
  id: number;
  start_time?: string;
  end_time?: string;
  title: string;
  description?: string;
  icon_name?: string;
}

interface EventSpeaker {
  id: number;
  name: string;
  position?: string;
  description?: string;
  photoUrl?: string;
}

interface EventResource {
  id: number;
  title: string;
  locked?: boolean;
  url?: string;
}

export type EventModality = "presential" | "virtual" | "hybrid";

interface AgendaEventDetail extends AgendaEvent {
  full_description?: string;
  modality?: EventModality;
  category?: string;
  agenda_items?: AgendaItem[];
  conferencistas?: EventSpeaker[];
  recursos?: EventResource[];
}

export async function getAgendaEventByDocumentId(
  documentId: string,
  managerSlug: string,
): Promise<AgendaEventDetail | null> {
  try {
    const response = await getCollectionByManager<AgendaEventRaw>(
      "agenda-events",
      managerSlug,
      {
        filters: { documentId: { $eq: documentId } },
        populate: {
          image: true,
          agenda_items: true,
          conferencistas: { populate: { photo: true } },
          recursos: true,
        },
      },
    );

    const e = response?.data?.[0];
    if (!e) return null;

    return {
      id: String(e.id),
      documentId: e.documentId,
      title: e.title,
      description: e.description,
      full_description: e.full_description,
      date: e.date,
      start_time: e.start_time,
      end_time: e.end_time,
      location: e.location,
      event_type: e.event_type,
      modality: e.modality,
      category: e.category,
      is_featured: e.is_featured ?? false,
      registration_url: e.registration_url,
      imageUrl: getStrapiImageUrl(e.image, "large") || undefined,
      agenda_items: (e.agenda_items || []).map((item) => ({
        id: item.id,
        start_time: item.start_time,
        end_time: item.end_time,
        title: item.title,
        description: item.description,
        icon_name: item.icon_name,
      })),
      conferencistas: (e.conferencistas || []).map((s) => ({
        id: s.id,
        name: s.name,
        position: s.position,
        description: s.description,
        photoUrl: toStrapiUrl(s.photo?.url) || undefined,
      })),
      recursos: (e.recursos || []).map((r) => ({
        id: r.id,
        title: r.title,
        locked: r.locked ?? false,
        url: r.url || undefined,
      })),
    };
  } catch {
    return null;
  }
}

export async function getAgendaEvents(
  managerSlug: string,
): Promise<AgendaEvent[]> {
  try {
    const params = { populate: { image: true }, sort: ["date:asc"] };
    const response = await getCollectionByManager<AgendaEventRaw>(
      "agenda-events",
      managerSlug,
      params,
    );

    return (response?.data || []).map((e) => ({
      id: String(e.id),
      documentId: e.documentId,
      title: e.title,
      description: e.description,
      date: e.date,
      start_time: e.start_time,
      end_time: e.end_time,
      location: e.location,
      event_type: e.event_type as EventType | undefined,
      is_featured: e.is_featured ?? false,
      registration_url: e.registration_url,
      imageUrl: getStrapiImageUrl(e.image, "large") || undefined,
    }));
  } catch {
    return [];
  }
}
