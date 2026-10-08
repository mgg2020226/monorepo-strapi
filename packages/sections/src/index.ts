export { StrapiAnimatedLogoRow } from "./sections/StrapiAnimatedLogoRow"
export { StrapiCarousel } from "./sections/StrapiCarousel"
export { StrapiCTABanner } from "./sections/StrapiCTABanner"
export { StrapiFaq } from "./sections/StrapiFaq"
export { StrapiFeaturesList } from "./sections/StrapiFeaturesList"
export { StrapiStatistics } from "./sections/StrapiFigures"
export { StrapiHeadingWithCTAButton } from "./sections/StrapiHeadingWithCTAButton"
export { StrapiHero } from "./sections/StrapiHero"
export { StrapiImageWithCTAButton } from "./sections/StrapiImageWithCTAButton"
export { StrapiStructuredData } from "./seo-utilities/StrapiStructuredData"
export { StrapiBasicImage } from "./utilities/StrapiBasicImage"
export { StrapiCkEditorContent } from "./utilities/StrapiCkEditorContent"
export { StrapiImageWithLink } from "./utilities/StrapiImageWithLink"
export { StrapiLink } from "./utilities/StrapiLink"
export { default as StrapiTipTapEditorContent } from "./utilities/StrapiTipTapEditorContent"
export type { PageBuilderComponentProps } from "./types"

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
