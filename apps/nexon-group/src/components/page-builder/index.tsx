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
  StrapiBeforeAfterSlider,
  StrapiHeroMedia,
  StrapiMissionVision,
  StrapiPortfolioProjects,
  StrapiServicesHub,
} from "@repo/sections"

import StrapiContactForm from "@/components/page-builder/components/forms/StrapiContactForm"
import StrapiDynamicForm from "@/components/page-builder/components/forms/StrapiDynamicForm"
import {
  NexonAboutRenderer,
  NexonBentoServicesRenderer,
  NexonContactRenderer,
  NexonCustomerLogosRenderer,
  NexonGrowthStoriesRenderer,
  NexonHeroRenderer,
  NexonMethodologyRenderer,
} from "@/components/page-builder/nexon/NexonSections"

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
  "sections.hero-media": StrapiHeroMedia,
  "sections.mission-vision": StrapiMissionVision,
  "sections.services-hub": StrapiServicesHub,
  "sections.before-after-slider": StrapiBeforeAfterSlider,
  "sections.portfolio-projects": StrapiPortfolioProjects,

  // Nexon brand sections. Their schemas are stored in Strapi under the nexon category.
  "nexon.hero": NexonHeroRenderer,
  "nexon.customer-logos": NexonCustomerLogosRenderer,
  "nexon.bento-services": NexonBentoServicesRenderer,
  "nexon.methodology": NexonMethodologyRenderer,
  "nexon.about": NexonAboutRenderer,
  "nexon.growth-stories": NexonGrowthStoriesRenderer,
  "nexon.contact": NexonContactRenderer,

  // Forms
  "forms.contact-form": StrapiContactForm,
  "forms.dynamic-form": StrapiDynamicForm,

  // Add more components here
}
