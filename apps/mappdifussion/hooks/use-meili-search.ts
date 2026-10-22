"use client";

import { useEffect, useRef, useState } from "react";
import { meiliClient, type SearchHit } from "@/lib/meilisearch";

/**
 * Hook que consulta Meilisearch en múltiples índices con debounce.
 */
export function useMeiliSearch(query: string, delay = 300) {
  const [results, setResults] = useState<SearchHit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [settledQuery, setSettledQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const normalizedQuery = query.trim();

  useEffect(() => {
    if (!normalizedQuery) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      if (!meiliClient) {
        setError("El buscador no está configurado.");
        setResults([]);
        setSettledQuery(normalizedQuery);
        return;
      }

      try {
        const { results: r } = await meiliClient.multiSearch({
          queries: [
            // ── 0: article  (title, extract, slug) ───────────────────────
            {
              indexUid: "article",
              q: normalizedQuery,
              limit: 4,
              attributesToHighlight: ["title", "extract"],
              highlightPreTag: "<mark>",
              highlightPostTag: "</mark>",
            },
            // ── 1: resolution  (title, description) ──────────────────────
            {
              indexUid: "resolution",
              q: normalizedQuery,
              limit: 4,
              attributesToHighlight: ["title", "description"],
              highlightPreTag: "<mark>",
              highlightPostTag: "</mark>",
            },
            // ── 2: about-page  (title, description) ──────────────────────
            {
              indexUid: "about-page",
              q: normalizedQuery,
              limit: 3,
              attributesToHighlight: ["title", "description"],
              highlightPreTag: "<mark>",
              highlightPostTag: "</mark>",
            },
            // ── 3: card  (title, description) ────────────────────────────
            {
              indexUid: "card",
              q: normalizedQuery,
              limit: 4,
              attributesToHighlight: ["title", "description"],
              highlightPreTag: "<mark>",
              highlightPostTag: "</mark>",
            },
            // ── 4: footer-layout  (description, address) ─────────────────
            {
              indexUid: "footer-layout",
              q: normalizedQuery,
              limit: 3,
              attributesToHighlight: ["description", "address"],
              highlightPreTag: "<mark>",
              highlightPostTag: "</mark>",
            },
            // ── 5: home-page  (sin campos de texto directos) ─────────────
            {
              indexUid: "home-page",
              q: normalizedQuery,
              limit: 2,
              attributesToHighlight: [],
              highlightPreTag: "<mark>",
              highlightPostTag: "</mark>",
            },
            // ── 6: link  (label, url) ─────────────────────────────────────
            {
              indexUid: "link",
              q: normalizedQuery,
              limit: 3,
              attributesToHighlight: ["label", "url"],
              highlightPreTag: "<mark>",
              highlightPostTag: "</mark>",
            },
            // ── 7: team-member  (name, position, department) ─────────────
            {
              indexUid: "team-member",
              q: normalizedQuery,
              limit: 4,
              attributesToHighlight: ["name", "position", "department"],
              highlightPreTag: "<mark>",
              highlightPostTag: "</mark>",
            },
            // ── 8: terms-of-use-page  (title) ───────────────────────────
            {
              indexUid: "terms-of-use-page",
              q: normalizedQuery,
              limit: 2,
              attributesToHighlight: ["title"],
              highlightPreTag: "<mark>",
              highlightPostTag: "</mark>",
            },
            // ── 9: edicto  (title, description) ──────────────────────────
            {
              indexUid: "edicto",
              q: normalizedQuery,
              limit: 4,
              attributesToHighlight: ["title", "description"],
              highlightPreTag: "<mark>",
              highlightPostTag: "</mark>",
            },
            // ── 10: servicio  (title, short_description) ─────────────────
            {
              indexUid: "servicio-item",
              q: normalizedQuery,
              limit: 4,
              attributesToHighlight: ["title", "short_description"],
              highlightPreTag: "<mark>",
              highlightPostTag: "</mark>",
            },
          ],
        });

        // Mapear cada resultado con su índice de origen (el orden debe coincidir con queries[])
        const flat: SearchHit[] = [
          ...r[0].hits.map(
            (h) => ({ _index: "article" as const, ...h }) as SearchHit,
          ),
          ...r[1].hits.map(
            (h) => ({ _index: "resolution" as const, ...h }) as SearchHit,
          ),
          ...r[2].hits.map(
            (h) => ({ _index: "about-page" as const, ...h }) as SearchHit,
          ),
          ...r[3].hits.map(
            (h) => ({ _index: "card" as const, ...h }) as SearchHit,
          ),
          ...r[4].hits.map(
            (h) => ({ _index: "footer-layout" as const, ...h }) as SearchHit,
          ),
          ...r[5].hits.map(
            (h) => ({ _index: "home-page" as const, ...h }) as SearchHit,
          ),
          ...r[6].hits.map(
            (h) => ({ _index: "link" as const, ...h }) as SearchHit,
          ),
          ...r[7].hits.map(
            (h) => ({ _index: "team-member" as const, ...h }) as SearchHit,
          ),
          ...r[8].hits.map(
            (h) =>
              ({ _index: "terms-of-use-page" as const, ...h }) as SearchHit,
          ),
          ...r[9].hits.map(
            (h) => ({ _index: "edicto" as const, ...h }) as SearchHit,
          ),
          ...r[10].hits.map(
            (h) => ({ _index: "servicio-item" as const, ...h }) as SearchHit,
          ),
        ];

        setResults(flat);
        setError(null);
        setSettledQuery(normalizedQuery);
      } catch {
        setError("No se pudo conectar al buscador.");
        setResults([]);
        setSettledQuery(normalizedQuery);
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [normalizedQuery, delay]);

  return {
    results: normalizedQuery && settledQuery === normalizedQuery ? results : [],
    loading: Boolean(normalizedQuery) && settledQuery !== normalizedQuery,
    error: normalizedQuery && settledQuery === normalizedQuery ? error : null,
  };
}
