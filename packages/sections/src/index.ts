/**
 * Shared section contracts. React renderers stay in each site app until a
 * section has proved reusable across two or more companies.
 */
export const sharedSectionUids = [
  "sections.hero-standard",
  "sections.content-rich-text",
  "sections.feature-grid",
  "sections.gallery",
  "sections.video",
  "sections.cta",
  "forms.dynamic-form",
] as const

export type SharedSectionUid = (typeof sharedSectionUids)[number]
