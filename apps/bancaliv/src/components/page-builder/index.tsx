import {
  BancalivFeaturedHero,
  BancalivFaq,
  BancalivLogoCloud,
  BancalivSection,
  BancalivStatistics,
} from "@/components/brand"
import {
  StrapiAnimatedLogoRow,
  StrapiCarousel,
  StrapiCkEditorContent,
  StrapiCTABanner,
  StrapiContentRichText,
  StrapiFeatureGrid,
  StrapiFeaturesList,
  StrapiGallery,
  StrapiHeroStandard,
  StrapiHeadingWithCTAButton,
  StrapiHero,
  StrapiImageWithCTAButton,
  StrapiTipTapEditorContent,
  StrapiVideo,
  StrapiProcessSteps,
  StrapiBenefitsSplit,
  StrapiSecurityBlock,
  StrapiTestimonials,
  StrapiBeforeAfterSlider,
  StrapiHeroMedia,
  StrapiMissionVision,
  StrapiPortfolioProjects,
  StrapiServicesHub,
} from "@repo/sections"

import { BancalivCta } from "@/components/page-builder/components/BancalivCta"
import { BancalivProductGrid } from "@/components/page-builder/components/BancalivProductGrid"
import StrapiBancalivContactForm from "@/components/page-builder/components/forms/StrapiBancalivContactForm"
import StrapiDynamicForm from "@/components/page-builder/components/forms/StrapiDynamicForm"

/**
 * Mapping of Strapi Component UID to React Component
 *
 * Consider improving dynamic/lazy loading of these components to reduce bundle size.
 */
export const PageContentComponents: Partial<
  Record<string, React.ComponentType<any>>
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
  "sections.faq": BancalivFaq,
  "sections.carousel": StrapiCarousel,
  "sections.heading-with-cta-button": StrapiHeadingWithCTAButton,
  "sections.hero": StrapiHero,
  "sections.image-with-cta-button": StrapiImageWithCTAButton,
  "sections.statistics": BancalivStatistics,
  "sections.features-list": StrapiFeaturesList,
  "sections.feature-grid": StrapiFeatureGrid,
  "sections.gallery": StrapiGallery,
  "sections.hero-standard": StrapiHeroStandard,
  "sections.cta": BancalivCta,
  "sections.video": StrapiVideo,
  "sections.cta-banner": StrapiCTABanner,
  "sections.hero-featured": BancalivFeaturedHero,
  "sections.process-steps": StrapiProcessSteps,
  "sections.product-grid": BancalivProductGrid,
  "sections.benefits-split": StrapiBenefitsSplit,
  "sections.security-block": StrapiSecurityBlock,
  "sections.testimonials": StrapiTestimonials,
  "sections.logo-cloud": BancalivLogoCloud,
  "sections.hero-media": StrapiHeroMedia,
  "sections.mission-vision": StrapiMissionVision,
  "sections.services-hub": StrapiServicesHub,
  "sections.before-after-slider": StrapiBeforeAfterSlider,
  "sections.portfolio-projects": StrapiPortfolioProjects,

  // Forms
  "forms.contact-form": StrapiBancalivContactForm,
  "forms.dynamic-form": StrapiDynamicForm,
  "bancaliv.section": BancalivSection,

  // Add more components here
}
