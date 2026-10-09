export { StrapiAnimatedLogoRow } from "./sections/StrapiAnimatedLogoRow"
export { StrapiCarousel } from "./sections/StrapiCarousel"
export { StrapiCTABanner } from "./sections/StrapiCTABanner"
export { StrapiContentRichText } from "./sections/StrapiContentRichText"
export { StrapiFaq } from "./sections/StrapiFaq"
export { StrapiFeatureGrid } from "./sections/StrapiFeatureGrid"
export { StrapiFeaturesList } from "./sections/StrapiFeaturesList"
export { StrapiStatistics } from "./sections/StrapiFigures"
export { StrapiGallery } from "./sections/StrapiGallery"
export { StrapiHeadingWithCTAButton } from "./sections/StrapiHeadingWithCTAButton"
export { StrapiHero } from "./sections/StrapiHero"
export { StrapiHeroStandard } from "./sections/StrapiHeroStandard"
export { StrapiImageWithCTAButton } from "./sections/StrapiImageWithCTAButton"
export { StrapiHeroFeatured } from "./sections/StrapiHeroFeatured"
export { StrapiProcessSteps } from "./sections/StrapiProcessSteps"
export { StrapiProductGrid } from "./sections/StrapiProductGrid"
export { StrapiBenefitsSplit } from "./sections/StrapiBenefitsSplit"
export { StrapiSecurityBlock } from "./sections/StrapiSecurityBlock"
export { StrapiTestimonials } from "./sections/StrapiTestimonials"
export { StrapiLogoCloud } from "./sections/StrapiLogoCloud"
export { StrapiCta } from "./sections/StrapiCta"
export { StrapiVideo } from "./sections/StrapiVideo"
export { DynamicForm } from "./forms/DynamicForm"
export type {
  DynamicFormDefinition,
  DynamicFormField,
  DynamicFormFieldType,
  DynamicFormOption,
  DynamicFormValues,
} from "./forms/types"
export { StrapiStructuredData } from "./seo-utilities/StrapiStructuredData"
export { StrapiBasicImage } from "./utilities/StrapiBasicImage"
export { StrapiCkEditorContent } from "./utilities/StrapiCkEditorContent"
export { StrapiImageWithLink } from "./utilities/StrapiImageWithLink"
export { StrapiLink } from "./utilities/StrapiLink"
export { StrapiMediaImage } from "./utilities/StrapiMediaImage"
export { default as StrapiTipTapEditorContent } from "./utilities/StrapiTipTapEditorContent"
export type { PageBuilderComponentProps } from "./types"

export const sharedSectionUids = [
  "sections.hero-standard",
  "sections.hero-featured",
  "sections.process-steps",
  "sections.product-grid",
  "sections.benefits-split",
  "sections.security-block",
  "sections.testimonials",
  "sections.logo-cloud",
  "sections.content-rich-text",
  "sections.feature-grid",
  "sections.gallery",
  "sections.video",
  "sections.cta",
  "forms.dynamic-form",
] as const

export type SharedSectionUid = (typeof sharedSectionUids)[number]
