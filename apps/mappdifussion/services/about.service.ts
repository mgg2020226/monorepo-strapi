import { getCollectionByManager } from "@/lib/strapi";
import { toStrapiUrl } from "@/lib/strapi-base-url";

interface RichTextChild {
  text?: string;
}

interface RichTextBlock {
  children?: RichTextChild[];
}

interface AboutPageRaw {
  documentId: string;
  title: string;
  description: string;
  mission?: string;
  vision?: string;
  slug?: string;
  institutional_leader?: {
    name: string;
    position: string;
    biography?: RichTextBlock[] | string;
    photo?: { url?: string };
    buttons?: Array<{
      id: number;
      label: string;
      href?: string;
      isExternal?: boolean;
    }>;
  };
}

export interface SocialLink {
  id: number;
  platform:
    | "linkedin"
    | "twitter"
    | "facebook"
    | "instagram"
    | "whatsapp"
    | "youtube";
  url: string;
}

interface TeamMemberRaw {
  id: number;
  documentId: string;
  name: string;
  position: string;
  department?: string;
  email?: string;
  image?: {
    id: number;
    url: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  department?: string;
  email?: string;
  image: string;
  expanded: boolean;
}

export interface LiderInstitucional {
  name: string;
  position: string;
  biography?: string; // plain text extracted from blocks
  photo?: { url: string };
  buttons?: Array<{
    id: number;
    label: string;
    href?: string;
    isExternal?: boolean;
  }>;
}

interface AboutPage {
  documentId?: string;
  title: string;
  description: string;
  mission?: string;
  vision?: string;
  lider_institucional?: LiderInstitucional;
  team_members: TeamMember[];
  slug?: string;
}

function blocksToText(blocks: RichTextBlock[]): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((b) => b.children?.map((c) => c.text ?? "").join("") ?? "")
    .filter(Boolean)
    .join("\n");
}

/**
 * Obtiene la página "Acerca de" desde Strapi (ahora como colección)
 * @param slug - Slug o identificador de la página (opcional, por defecto 'main')
 * @returns Datos de la página About con jerarquía de miembros del equipo
 */
export async function getAboutPage(
  managerSlug: string,
  _slug = "home",
): Promise<AboutPage | null> {
  try {
    const populate = {
      institutional_leader: { populate: { photo: true, buttons: true } },
    };

    const aboutResponse = await getCollectionByManager<AboutPageRaw>(
      "about-pages",
      managerSlug,
      { populate },
    );

    const aboutData = aboutResponse?.data?.[0] || null;

    if (!aboutData) {
      return null;
    }

    const membersResponse = await getCollectionByManager<TeamMemberRaw>(
      "team-members",
      managerSlug,
      {
        populate: {
          image: true,
        },
        pagination: { pageSize: 100 },
      },
    );

    const hierarchy = buildHierarchy(membersResponse?.data || []);

    const rawLider = aboutData.institutional_leader;
    const lider: LiderInstitucional | undefined = rawLider
      ? {
          name: rawLider.name,
          position: rawLider.position,
          biography: Array.isArray(rawLider.biography)
            ? blocksToText(rawLider.biography)
            : (rawLider.biography ?? undefined),
          photo: rawLider.photo?.url
            ? { url: toStrapiUrl(rawLider.photo.url) || "" }
            : undefined,
          buttons: rawLider.buttons,
        }
      : undefined;

    return {
      documentId: aboutData.documentId,
      title: aboutData.title,
      description: aboutData.description,
      mission: aboutData.mission,
      vision: aboutData.vision,
      lider_institucional: lider,
      team_members: hierarchy,
      slug: aboutData.slug,
    };
  } catch {
    return null;
  }
}

/**
 * Construye la jerarquía de miembros del equipo (padres e hijos)
 * @param members - Array de miembros raw desde Strapi
 * @returns Array de miembros organizados jerárquicamente
 */
function buildHierarchy(members: TeamMemberRaw[]): TeamMember[] {
  // Crear mapa de miembros transformados
  const memberMap = new Map<string, TeamMember>();

  // Transformar todos los miembros
  members.forEach((member) => {
    memberMap.set(member.documentId, {
      id: member.documentId,
      name: member.name,
      position: member.position,
      department: member.department,
      email: member.email,
      image: toStrapiUrl(member.image?.url) || "/placeholder.svg",
      expanded: false,
    });
  });

  // Construir jerarquía conectando padres e hijos
  const roots: TeamMember[] = [];

  members.forEach((member) => {
    const currentNode = memberMap.get(member.documentId);
    if (!currentNode) return;
    roots.push(currentNode);
  });

  return roots;
}
