import { Meilisearch } from "meilisearch";

/**
 * Cliente singleton de Meilisearch.
 * ⚠️  Usa siempre la Search API Key (solo lectura), NUNCA la Master Key.
 */
const defaultHost =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:7700";
const host = (process.env.NEXT_PUBLIC_MEILI_HOST ?? defaultHost).trim();
const apiKey = process.env.NEXT_PUBLIC_MEILI_SEARCH_KEY ?? "";

export const meiliClient = host ? new Meilisearch({ host, apiKey }) : null;

/* ================================================================
   Tipos por índice  (campos reales según schema.json de cada API)
================================================================= */

interface ArticleHit {
  id: number;
  title: string;
  extract: string;
  slug: string;
  _formatted?: Partial<ArticleHit>;
}
interface ResolutionHit {
  id: number;
  title: string;
  description: string;
  link: string;
  date: string;
  _formatted?: Partial<ResolutionHit>;
}
interface AboutPageHit {
  // fields: title, description
  id: number;
  title: string;
  description: string;
  _formatted?: Partial<AboutPageHit>;
}
interface CardHit {
  // fields: title, description
  id: number;
  title: string;
  description?: string;
  _formatted?: Partial<CardHit>;
}
interface EdictotHit {
  id: number;
  title: string;
  description: string;
  _formatted?: Partial<EdictotHit>;
}
interface ServicioHit {
  id: number;
  title: string;
  short_description: string;
  type: "producto" | "tramite";
  _formatted?: Partial<ServicioHit>;
}

interface FooterLayoutHit {
  // fields: description, address
  id: number;
  description?: string;
  address?: string;
  _formatted?: Partial<FooterLayoutHit>;
}
interface HomePageHit {
  // solo dynamiczone — sin campos de texto directos
  id: number;
  _formatted?: Partial<HomePageHit>;
}
interface LinkHit {
  // fields: label, url
  id: number;
  label: string;
  url: string;
  _formatted?: Partial<LinkHit>;
}
interface TeamMemberHit {
  // fields: name, position, department
  id: number;
  name: string;
  position: string;
  department?: string;
  _formatted?: Partial<TeamMemberHit>;
}
interface TermsOfUsePageHit {
  // fields: title
  id: number;
  title: string;
  _formatted?: Partial<TermsOfUsePageHit>;
}
/** Todos los tipos de resultado posibles etiquetados con su índice */
export type SearchHit =
  | ({ _index: "article" } & ArticleHit)
  | ({ _index: "resolution" } & ResolutionHit)
  | ({ _index: "about-page" } & AboutPageHit)
  | ({ _index: "card" } & CardHit)
  | ({ _index: "footer-layout" } & FooterLayoutHit)
  | ({ _index: "home-page" } & HomePageHit)
  | ({ _index: "link" } & LinkHit)
  | ({ _index: "team-member" } & TeamMemberHit)
  | ({ _index: "terms-of-use-page" } & TermsOfUsePageHit)
  | ({ _index: "edicto" } & EdictotHit)
  | ({ _index: "servicio-item" } & ServicioHit);
