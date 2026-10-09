import {
  StrapiAnimatedLogoRow,
  StrapiCarousel,
  StrapiCkEditorContent,
  StrapiCTABanner,
  StrapiContentRichText,
  StrapiFaq,
  StrapiFeatureGrid,
  StrapiFeaturesList,
  StrapiGallery,
  StrapiHeroStandard,
  StrapiHeadingWithCTAButton,
  StrapiHero,
  StrapiImageWithCTAButton,
  StrapiCta,
  StrapiStatistics,
  StrapiTipTapEditorContent,
  StrapiVideo,
  StrapiHeroFeatured,
  StrapiProcessSteps,
  StrapiProductGrid,
  StrapiBenefitsSplit,
  StrapiSecurityBlock,
  StrapiTestimonials,
  StrapiLogoCloud,
} from "@repo/sections"
import type { UID } from "@repo/strapi-types"

import StrapiContactForm from "@/components/page-builder/components/forms/StrapiContactForm"
import StrapiDynamicForm from "@/components/page-builder/components/forms/StrapiDynamicForm"

/**
 * Mapping of Strapi Component UID to React Component
 *
 * Consider improving dynamic/lazy loading of these components to reduce bundle size.
 */
export const PageContentComponents: Partial<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic component map requires any for varying prop types
  Record<UID.Component, React.ComponentType<any>>
> = {
  // elements, seo-utilities, utilities
  // They are usually rendered or used deep inside other components or handlers
  // Add them here if they can be used on Page content level
  "utilities.ck-editor-content": StrapiCkEditorContent,
  "utilities.ck-editor-text": StrapiCkEditorContent,
  "utilities.tip-tap-rich-text": StrapiTipTapEditorContent,
  "sections.content-rich-text": StrapiContentRichText,

  // Sections
  "sections.animated-logo-row": StrapiAnimatedLogoRow,
  "sections.faq": StrapiFaq,
  "sections.carousel": StrapiCarousel,
  "sections.heading-with-cta-button": StrapiHeadingWithCTAButton,
  "sections.hero": StrapiHero,
  "sections.image-with-cta-button": StrapiImageWithCTAButton,
  "sections.statistics": StrapiStatistics,
  "sections.features-list": StrapiFeaturesList,
  "sections.feature-grid": StrapiFeatureGrid,
  "sections.gallery": StrapiGallery,
  "sections.hero-standard": StrapiHeroStandard,
  "sections.cta": StrapiCta,
  "sections.video": StrapiVideo,
  "sections.cta-banner": StrapiCTABanner,
  "sections.hero-featured": StrapiHeroFeatured,
  "sections.process-steps": StrapiProcessSteps,
  "sections.product-grid": StrapiProductGrid,
  "sections.benefits-split": StrapiBenefitsSplit,
  "sections.security-block": StrapiSecurityBlock,
  "sections.testimonials": StrapiTestimonials,
  "sections.logo-cloud": StrapiLogoCloud,

  // Forms
  "forms.contact-form": StrapiContactForm,
  "forms.dynamic-form": StrapiDynamicForm,

  // Add more components here
}
