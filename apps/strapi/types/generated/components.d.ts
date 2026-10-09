import type { Schema, Struct } from "@strapi/strapi"

export interface AdminPermission extends Struct.ComponentSchema {
  collectionName: "components_admin_permissions"
  info: {
    displayName: "Admin permission"
    icon: "lock"
  }
  attributes: {
    actions: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<["read"]>
    resource: Schema.Attribute.Enumeration<
      [
        "site",
        "page",
        "blog-post",
        "blog-category",
        "calendar-event",
        "portfolio-project",
        "legal-page",
        "form-definition",
        "media",
      ]
    > &
      Schema.Attribute.Required
    scope: Schema.Attribute.Enumeration<["assigned-sites", "all-sites"]> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"assigned-sites">
  }
}

export interface BlogTag extends Struct.ComponentSchema {
  collectionName: "components_blog_tags"
  info: {
    displayName: "Blog tag"
    icon: "tag"
  }
  attributes: {
    active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    color: Schema.Attribute.String
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    slug: Schema.Attribute.UID<"name"> &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
  }
}

export interface ElementsFooterItem extends Struct.ComponentSchema {
  collectionName: "components_elements_footer_items"
  info: {
    description: ""
    displayName: "FooterItem"
  }
  attributes: {
    links: Schema.Attribute.Component<"utilities.link", true>
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface FormField extends Struct.ComponentSchema {
  collectionName: "components_form_fields"
  info: {
    displayName: "Form field"
    icon: "input"
  }
  attributes: {
    accept: Schema.Attribute.String
    helpText: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    maxLength: Schema.Attribute.Integer
    maxValue: Schema.Attribute.Decimal
    minLength: Schema.Attribute.Integer
    minValue: Schema.Attribute.Decimal
    name: Schema.Attribute.String & Schema.Attribute.Required
    options: Schema.Attribute.Component<"form.option", true>
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>
    placeholder: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    required: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    type: Schema.Attribute.Enumeration<
      [
        "text",
        "email",
        "tel",
        "number",
        "date",
        "time",
        "textarea",
        "select",
        "checkbox",
        "radio",
        "file",
      ]
    > &
      Schema.Attribute.Required
    visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
  }
}

export interface FormOption extends Struct.ComponentSchema {
  collectionName: "components_form_options"
  info: {
    displayName: "Form option"
    icon: "check"
  }
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>
    value: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface FormsContactForm extends Struct.ComponentSchema {
  collectionName: "components_forms_contact_forms"
  info: {
    displayName: "ContactForm"
  }
  attributes: {
    description: Schema.Attribute.Text
    gdpr: Schema.Attribute.Component<"utilities.link", false>
    title: Schema.Attribute.String
  }
}

export interface FormsDynamicForm extends Struct.ComponentSchema {
  collectionName: "components_sections_dynamic_forms"
  info: {
    displayName: "Dynamic form"
    icon: "forms"
  }
  attributes: {
    formSlug: Schema.Attribute.String & Schema.Attribute.Required
    motion: Schema.Attribute.Component<"ui.motion", false>
    style: Schema.Attribute.Component<"ui.style", false>
  }
}

export interface LayoutNavbarItem extends Struct.ComponentSchema {
  collectionName: "components_layout_navbar_items"
  info: {
    displayName: "NavbarItem"
  }
  attributes: {
    categoryItems: Schema.Attribute.Component<"utilities.link", true>
    isCategoryLink: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    label: Schema.Attribute.String
    link: Schema.Attribute.Component<"utilities.link", false>
  }
}

export interface SectionsAnimatedLogoRow extends Struct.ComponentSchema {
  collectionName: "components_sections_animated_logo_rows"
  info: {
    description: ""
    displayName: "AnimatedLogoRow"
  }
  attributes: {
    logos: Schema.Attribute.Component<"utilities.basic-image", true>
    title: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
  }
}

export interface SectionsBenefitsSplit extends Struct.ComponentSchema {
  collectionName: "components_sections_benefits_splits"
  info: {
    displayName: "Benefits split"
    icon: "layout"
  }
  attributes: {
    panels: Schema.Attribute.Component<"shared.benefit-panel", true> &
      Schema.Attribute.Required
  }
}

export interface SectionsCarousel extends Struct.ComponentSchema {
  collectionName: "components_sections_carousels"
  info: {
    description: ""
    displayName: "Carousel"
  }
  attributes: {
    images: Schema.Attribute.Component<"utilities.image-with-link", true>
    radius: Schema.Attribute.Enumeration<["sm", "md", "lg", "xl", "full"]>
  }
}

export interface SectionsContentRichText extends Struct.ComponentSchema {
  collectionName: "components_sections_content_rich_texts"
  info: {
    displayName: "Rich text"
    icon: "align-left"
  }
  attributes: {
    body: Schema.Attribute.RichText &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    motion: Schema.Attribute.Component<"ui.motion", false>
    style: Schema.Attribute.Component<"ui.style", false>
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
  }
}

export interface SectionsCta extends Struct.ComponentSchema {
  collectionName: "components_sections_ctas"
  info: {
    displayName: "CTA"
    icon: "cursor"
  }
  attributes: {
    actions: Schema.Attribute.Component<"ui.link", true>
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    motion: Schema.Attribute.Component<"ui.motion", false>
    style: Schema.Attribute.Component<"ui.style", false>
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
  }
}

export interface SectionsCtaBanner extends Struct.ComponentSchema {
  collectionName: "components_sections_cta_banners"
  info: {
    displayName: "CTABanner"
  }
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
    features: Schema.Attribute.Component<
      "shared.image-with-title-and-description",
      true
    >
    links: Schema.Attribute.Component<"utilities.link", true>
    title: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
  }
}

export interface SectionsFaq extends Struct.ComponentSchema {
  collectionName: "components_sections_faqs"
  info: {
    description: ""
    displayName: "Faq"
  }
  attributes: {
    accordions: Schema.Attribute.Component<"utilities.accordions", true>
    subTitle: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsFeatureGrid extends Struct.ComponentSchema {
  collectionName: "components_sections_feature_grids"
  info: {
    displayName: "Feature grid"
    icon: "grid"
  }
  attributes: {
    columnsDesktop: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 6
          min: 1
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>
    columnsMobile: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 2
          min: 1
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    items: Schema.Attribute.Component<"sections.feature-item", true> &
      Schema.Attribute.Required
    motion: Schema.Attribute.Component<"ui.motion", false>
    style: Schema.Attribute.Component<"ui.style", false>
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
  }
}

export interface SectionsFeatureItem extends Struct.ComponentSchema {
  collectionName: "components_sections_feature_items"
  info: {
    displayName: "Feature item"
    icon: "star"
  }
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    icon: Schema.Attribute.String
    link: Schema.Attribute.Component<"ui.link", false>
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
  }
}

export interface SectionsFeaturesList extends Struct.ComponentSchema {
  collectionName: "components_sections_features_lists"
  info: {
    displayName: "FeaturesList"
  }
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
    features: Schema.Attribute.Component<
      "shared.image-with-title-and-description",
      true
    >
    listStyle: Schema.Attribute.Enumeration<["boxGrid", "grid", "list"]> &
      Schema.Attribute.DefaultTo<"list">
    mainImage: Schema.Attribute.Component<"shared.image-with-config", false>
    title: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
  }
}

export interface SectionsGallery extends Struct.ComponentSchema {
  collectionName: "components_sections_galleries"
  info: {
    displayName: "Gallery"
    icon: "images"
  }
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    images: Schema.Attribute.Media<"images", true> & Schema.Attribute.Required
    layout: Schema.Attribute.Enumeration<["grid", "masonry", "carousel"]> &
      Schema.Attribute.DefaultTo<"grid">
    motion: Schema.Attribute.Component<"ui.motion", false>
    style: Schema.Attribute.Component<"ui.style", false>
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
  }
}

export interface SectionsHeadingWithCtaButton extends Struct.ComponentSchema {
  collectionName: "components_sections_heading_with_cta_buttons"
  info: {
    description: ""
    displayName: "HeadingWithCTAButton"
  }
  attributes: {
    cta: Schema.Attribute.Component<"utilities.link", false>
    subText: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: "components_sections_heroes"
  info: {
    description: ""
    displayName: "Hero"
  }
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
    links: Schema.Attribute.Component<"utilities.link", true>
    note: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
    tag: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
    title: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
  }
}

export interface SectionsHeroFeatured extends Struct.ComponentSchema {
  collectionName: "components_sections_hero_featureds"
  info: {
    displayName: "Featured hero"
    icon: "landscape"
  }
  attributes: {
    actions: Schema.Attribute.Component<"ui.link", true>
    description: Schema.Attribute.Text
    eyebrow: Schema.Attribute.String
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    perks: Schema.Attribute.Component<"shared.hero-perk", true>
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsHeroStandard extends Struct.ComponentSchema {
  collectionName: "components_sections_hero_standards"
  info: {
    displayName: "Standard hero"
    icon: "picture"
  }
  attributes: {
    actions: Schema.Attribute.Component<"ui.link", true>
    alignment: Schema.Attribute.Enumeration<["left", "center", "right"]> &
      Schema.Attribute.DefaultTo<"left">
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    image: Schema.Attribute.Media<"images">
    motion: Schema.Attribute.Component<"ui.motion", false>
    style: Schema.Attribute.Component<"ui.style", false>
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
  }
}

export interface SectionsImageWithCtaButton extends Struct.ComponentSchema {
  collectionName: "components_sections_image_with_cta_buttons"
  info: {
    description: ""
    displayName: "ImageWithCTAButton"
  }
  attributes: {
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    link: Schema.Attribute.Component<"utilities.link", false>
    subText: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsLogoCloud extends Struct.ComponentSchema {
  collectionName: "components_sections_logo_clouds"
  info: {
    displayName: "Logo cloud"
    icon: "picture"
  }
  attributes: {
    description: Schema.Attribute.Text
    eyebrow: Schema.Attribute.String
    layout: Schema.Attribute.Enumeration<["strip", "grid"]> &
      Schema.Attribute.DefaultTo<"grid">
    logos: Schema.Attribute.Component<"shared.logo-item", true> &
      Schema.Attribute.Required
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsProcessSteps extends Struct.ComponentSchema {
  collectionName: "components_sections_process_steps"
  info: {
    displayName: "Process steps"
    icon: "bulletList"
  }
  attributes: {
    description: Schema.Attribute.Text
    steps: Schema.Attribute.Component<"shared.process-step", true> &
      Schema.Attribute.Required
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsProductGrid extends Struct.ComponentSchema {
  collectionName: "components_sections_product_grids"
  info: {
    displayName: "Product grid"
    icon: "grid"
  }
  attributes: {
    description: Schema.Attribute.Text
    products: Schema.Attribute.Component<"shared.product-card", true> &
      Schema.Attribute.Required
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsSecurityBlock extends Struct.ComponentSchema {
  collectionName: "components_sections_security_blocks"
  info: {
    displayName: "Security block"
    icon: "shield"
  }
  attributes: {
    description: Schema.Attribute.Text
    eyebrow: Schema.Attribute.String
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    points: Schema.Attribute.Component<"shared.security-point", true>
    supportingTitle: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsStatistics extends Struct.ComponentSchema {
  collectionName: "components_sections_statistics"
  info: {
    displayName: "Statistics"
  }
  attributes: {
    description: Schema.Attribute.Text
    figures: Schema.Attribute.Component<"shared.figure", true>
    title: Schema.Attribute.String
  }
}

export interface SectionsTestimonials extends Struct.ComponentSchema {
  collectionName: "components_sections_testimonials"
  info: {
    displayName: "Testimonials"
    icon: "discuss"
  }
  attributes: {
    description: Schema.Attribute.Text
    items: Schema.Attribute.Component<"shared.testimonial", true> &
      Schema.Attribute.Required
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsVideo extends Struct.ComponentSchema {
  collectionName: "components_sections_videos"
  info: {
    displayName: "Video"
    icon: "video"
  }
  attributes: {
    autoplay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    loop: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    motion: Schema.Attribute.Component<"ui.motion", false>
    muted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    poster: Schema.Attribute.Media<"images">
    style: Schema.Attribute.Component<"ui.style", false>
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    videoUrl: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SeoUtilitiesSeo extends Struct.ComponentSchema {
  collectionName: "components_seo_utilities_seos"
  info: {
    description: ""
    displayName: "Seo"
    icon: "search"
  }
  attributes: {
    applicationName: Schema.Attribute.String
    canonicalUrl: Schema.Attribute.String
    keywords: Schema.Attribute.Text
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160
      }>
    metaImage: Schema.Attribute.Media<"images">
    metaRobots: Schema.Attribute.Enumeration<
      [
        "all",
        "index",
        "index,follow",
        "noindex",
        "noindex,follow",
        "noindex,nofollow",
        "none",
        "noarchive",
        "nosnippet",
        "max-snippet",
      ]
    > &
      Schema.Attribute.DefaultTo<"all">
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60
      }>
    og: Schema.Attribute.Component<"seo-utilities.seo-og", false>
    structuredData: Schema.Attribute.JSON
    twitter: Schema.Attribute.Component<"seo-utilities.seo-twitter", false>
  }
}

export interface SeoUtilitiesSeoOg extends Struct.ComponentSchema {
  collectionName: "components_seo_utilities_seo_ogs"
  info: {
    displayName: "SeoOg"
    icon: "oneToMany"
  }
  attributes: {
    description: Schema.Attribute.String
    image: Schema.Attribute.Media<"images">
    siteName: Schema.Attribute.String
    title: Schema.Attribute.String
    type: Schema.Attribute.Enumeration<["website", "article"]> &
      Schema.Attribute.DefaultTo<"website">
    url: Schema.Attribute.String
  }
}

export interface SeoUtilitiesSeoTwitter extends Struct.ComponentSchema {
  collectionName: "components_seo_utilities_seo_twitters"
  info: {
    displayName: "SeoTwitter"
    icon: "oneToMany"
  }
  attributes: {
    card: Schema.Attribute.String
    creator: Schema.Attribute.String
    creatorId: Schema.Attribute.String
    description: Schema.Attribute.String
    images: Schema.Attribute.Media<"images", true>
    siteId: Schema.Attribute.String
    title: Schema.Attribute.String
  }
}

export interface SeoUtilitiesSocialIcons extends Struct.ComponentSchema {
  collectionName: "components_seo_utilities_social_icons"
  info: {
    displayName: "SocialIcons"
  }
  attributes: {
    socials: Schema.Attribute.Component<"utilities.image-with-link", true>
    title: Schema.Attribute.String
  }
}

export interface SeoMetadata extends Struct.ComponentSchema {
  collectionName: "components_seo_metadata"
  info: {
    displayName: "SEO metadata"
    icon: "search"
  }
  attributes: {
    canonicalUrl: Schema.Attribute.String
    keywords: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    noFollow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    noIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    shareImage: Schema.Attribute.Media<"images">
  }
}

export interface SharedBenefitPanel extends Struct.ComponentSchema {
  collectionName: "components_shared_benefit_panels"
  info: {
    displayName: "Benefit panel"
    icon: "grid"
  }
  attributes: {
    benefits: Schema.Attribute.Component<"utilities.text", true>
    description: Schema.Attribute.Text
    eyebrow: Schema.Attribute.String
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SharedFigure extends Struct.ComponentSchema {
  collectionName: "components_shared_figures"
  info: {
    displayName: "Figure"
  }
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
    number: Schema.Attribute.BigInteger
    prefix: Schema.Attribute.String
    suffix: Schema.Attribute.String
  }
}

export interface SharedHeroPerk extends Struct.ComponentSchema {
  collectionName: "components_shared_hero_perks"
  info: {
    displayName: "Hero perk"
    icon: "spark"
  }
  attributes: {
    description: Schema.Attribute.String
    icon: Schema.Attribute.Enumeration<["zap", "shield-check", "user-round"]> &
      Schema.Attribute.DefaultTo<"zap">
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SharedImageWithConfig extends Struct.ComponentSchema {
  collectionName: "components_shared_image_with_configs"
  info: {
    displayName: "ImageWithConfig"
  }
  attributes: {
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    position: Schema.Attribute.Enumeration<["left", "right"]>
  }
}

export interface SharedImageWithTitleAndDescription
  extends Struct.ComponentSchema {
  collectionName: "components_shared_image_with_title_and_descriptions"
  info: {
    displayName: "ImageWithTitleAndDescription"
  }
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    title: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
  }
}

export interface SharedLogoItem extends Struct.ComponentSchema {
  collectionName: "components_shared_logo_items"
  info: {
    displayName: "Logo item"
    icon: "picture"
  }
  attributes: {
    href: Schema.Attribute.String
    image: Schema.Attribute.Component<"utilities.basic-image", false> &
      Schema.Attribute.Required
  }
}

export interface SharedProcessStep extends Struct.ComponentSchema {
  collectionName: "components_shared_process_steps"
  info: {
    displayName: "Process step"
    icon: "bulletList"
  }
  attributes: {
    description: Schema.Attribute.Text
    icon: Schema.Attribute.Component<"utilities.basic-image", false>
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SharedProductCard extends Struct.ComponentSchema {
  collectionName: "components_shared_product_cards"
  info: {
    displayName: "Product card"
    icon: "cube"
  }
  attributes: {
    action: Schema.Attribute.Component<"ui.link", false>
    description: Schema.Attribute.Text
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SharedSecurityPoint extends Struct.ComponentSchema {
  collectionName: "components_shared_security_points"
  info: {
    displayName: "Security point"
    icon: "shield"
  }
  attributes: {
    description: Schema.Attribute.Text
    icon: Schema.Attribute.Enumeration<
      ["eye", "shield-check", "search-check", "badge-check"]
    > &
      Schema.Attribute.DefaultTo<"shield-check">
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SharedTestimonial extends Struct.ComponentSchema {
  collectionName: "components_shared_testimonials"
  info: {
    displayName: "Testimonial"
    icon: "discuss"
  }
  attributes: {
    authorName: Schema.Attribute.String & Schema.Attribute.Required
    authorRole: Schema.Attribute.String
    avatar: Schema.Attribute.Component<"utilities.basic-image", false>
    quote: Schema.Attribute.Text & Schema.Attribute.Required
  }
}

export interface SiteFooterConfig extends Struct.ComponentSchema {
  collectionName: "components_site_footer_configs"
  info: {
    displayName: "Footer config"
    icon: "layout"
  }
  attributes: {
    columns: Schema.Attribute.Component<"site.navigation-column", true>
    copyright: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    legalLinks: Schema.Attribute.Component<"ui.link", true>
    showSocialLinks: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
  }
}

export interface SiteHeaderConfig extends Struct.ComponentSchema {
  collectionName: "components_site_header_configs"
  info: {
    displayName: "Header config"
    icon: "layout"
  }
  attributes: {
    cta: Schema.Attribute.Component<"ui.link", false>
    logoVariant: Schema.Attribute.Enumeration<["default", "light", "dark"]> &
      Schema.Attribute.DefaultTo<"default">
    navigation: Schema.Attribute.Component<"site.navigation-item", true>
    showCta: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    showLanguageSwitcher: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>
    showSearch: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
  }
}

export interface SiteLocaleConfig extends Struct.ComponentSchema {
  collectionName: "components_site_locale_configs"
  info: {
    displayName: "Locale config"
    icon: "language"
  }
  attributes: {
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    isDefault: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    locale: Schema.Attribute.Enumeration<["es", "en"]> &
      Schema.Attribute.Required
  }
}

export interface SiteNavigationColumn extends Struct.ComponentSchema {
  collectionName: "components_site_navigation_columns"
  info: {
    displayName: "Navigation column"
    icon: "list"
  }
  attributes: {
    links: Schema.Attribute.Component<"site.navigation-item", true>
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
  }
}

export interface SiteNavigationItem extends Struct.ComponentSchema {
  collectionName: "components_site_navigation_items"
  info: {
    displayName: "Navigation item"
    icon: "link"
  }
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>
    target: Schema.Attribute.Enumeration<["_self", "_blank"]> &
      Schema.Attribute.DefaultTo<"_self">
  }
}

export interface SitePalette extends Struct.ComponentSchema {
  collectionName: "components_site_palettes"
  info: {
    displayName: "Site palette"
    icon: "paint-brush"
  }
  attributes: {
    accent: Schema.Attribute.String & Schema.Attribute.Required
    background: Schema.Attribute.String & Schema.Attribute.Required
    border: Schema.Attribute.String
    contrastMode: Schema.Attribute.Enumeration<["light", "dark", "auto"]> &
      Schema.Attribute.DefaultTo<"light">
    destructive: Schema.Attribute.String
    fontBody: Schema.Attribute.String
    fontHeading: Schema.Attribute.String
    foreground: Schema.Attribute.String & Schema.Attribute.Required
    muted: Schema.Attribute.String
    primary: Schema.Attribute.String & Schema.Attribute.Required
    radius: Schema.Attribute.Enumeration<["none", "sm", "md", "lg", "xl"]> &
      Schema.Attribute.DefaultTo<"md">
    secondary: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SiteSocialLink extends Struct.ComponentSchema {
  collectionName: "components_site_social_links"
  info: {
    displayName: "Social link"
    icon: "share-alt"
  }
  attributes: {
    icon: Schema.Attribute.String
    label: Schema.Attribute.String
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>
    platform: Schema.Attribute.Enumeration<
      ["facebook", "instagram", "linkedin", "x", "youtube", "tiktok", "other"]
    > &
      Schema.Attribute.Required
    url: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface UiLink extends Struct.ComponentSchema {
  collectionName: "components_ui_links"
  info: {
    displayName: "UI link"
    icon: "link"
  }
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required
    icon: Schema.Attribute.String
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    size: Schema.Attribute.Enumeration<["sm", "md", "lg"]> &
      Schema.Attribute.DefaultTo<"md">
    target: Schema.Attribute.Enumeration<["_self", "_blank"]> &
      Schema.Attribute.DefaultTo<"_self">
    type: Schema.Attribute.Enumeration<
      ["internal", "external", "email", "phone"]
    > &
      Schema.Attribute.DefaultTo<"internal">
    variant: Schema.Attribute.Enumeration<
      ["default", "secondary", "outline", "ghost", "link"]
    > &
      Schema.Attribute.DefaultTo<"default">
  }
}

export interface UiMotion extends Struct.ComponentSchema {
  collectionName: "components_ui_motions"
  info: {
    displayName: "UI motion"
    icon: "magic"
  }
  attributes: {
    delay: Schema.Attribute.Enumeration<["none", "short", "medium", "long"]> &
      Schema.Attribute.DefaultTo<"none">
    duration: Schema.Attribute.Enumeration<["fast", "normal", "slow"]> &
      Schema.Attribute.DefaultTo<"normal">
    preset: Schema.Attribute.Enumeration<
      [
        "none",
        "fade",
        "slide-up",
        "slide-down",
        "slide-left",
        "slide-right",
        "scale",
        "reveal",
      ]
    > &
      Schema.Attribute.DefaultTo<"none">
    respectReducedMotion: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>
    trigger: Schema.Attribute.Enumeration<
      ["on-load", "on-scroll", "on-hover"]
    > &
      Schema.Attribute.DefaultTo<"on-scroll">
  }
}

export interface UiStyle extends Struct.ComponentSchema {
  collectionName: "components_ui_styles"
  info: {
    displayName: "UI style"
    icon: "brush"
  }
  attributes: {
    alignment: Schema.Attribute.Enumeration<["left", "center", "right"]> &
      Schema.Attribute.DefaultTo<"left">
    background: Schema.Attribute.Enumeration<
      ["default", "muted", "primary", "secondary", "dark", "custom"]
    > &
      Schema.Attribute.DefaultTo<"default">
    container: Schema.Attribute.Enumeration<
      ["none", "narrow", "default", "wide", "full"]
    > &
      Schema.Attribute.DefaultTo<"default">
    customClass: Schema.Attribute.String
    paddingBottom: Schema.Attribute.Enumeration<
      ["none", "sm", "md", "lg", "xl"]
    > &
      Schema.Attribute.DefaultTo<"lg">
    paddingTop: Schema.Attribute.Enumeration<["none", "sm", "md", "lg", "xl"]> &
      Schema.Attribute.DefaultTo<"lg">
  }
}

export interface UtilitiesAccordions extends Struct.ComponentSchema {
  collectionName: "components_utilities_accordions"
  info: {
    description: ""
    displayName: "Accordions"
  }
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required
    question: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface UtilitiesBasicImage extends Struct.ComponentSchema {
  collectionName: "components_utilities_basic_images"
  info: {
    displayName: "BasicImage"
  }
  attributes: {
    alt: Schema.Attribute.String
    fallbackSrc: Schema.Attribute.String
    height: Schema.Attribute.Integer
    media: Schema.Attribute.Media<"images" | "videos"> &
      Schema.Attribute.Required
    width: Schema.Attribute.Integer
  }
}

export interface UtilitiesCkEditorContent extends Struct.ComponentSchema {
  collectionName: "components_utilities_ck_editor_contents"
  info: {
    displayName: "CkEditorContent"
  }
  attributes: {
    content: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
  }
}

export interface UtilitiesCkEditorText extends Struct.ComponentSchema {
  collectionName: "components_utilities_ck_editor_texts"
  info: {
    displayName: "CkEditorText"
  }
  attributes: {
    content: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "simpleCkEditor"
        }
      >
  }
}

export interface UtilitiesImageWithLink extends Struct.ComponentSchema {
  collectionName: "components_utilities_image_with_links"
  info: {
    description: ""
    displayName: "ImageWithLink"
  }
  attributes: {
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    link: Schema.Attribute.Component<"utilities.link", false>
  }
}

export interface UtilitiesLink extends Struct.ComponentSchema {
  collectionName: "components_utilities_links"
  info: {
    displayName: "Link"
  }
  attributes: {
    decorations: Schema.Attribute.Component<"utilities.link-decorations", false>
    href: Schema.Attribute.String & Schema.Attribute.Required
    label: Schema.Attribute.String & Schema.Attribute.Required
    newTab: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>
    page: Schema.Attribute.Relation<"oneToOne", "api::page.page">
    type: Schema.Attribute.Enumeration<["external", "page"]> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"page">
  }
}

export interface UtilitiesLinkDecorations extends Struct.ComponentSchema {
  collectionName: "components_utilities_link_decorations"
  info: {
    displayName: "LinkDecorations"
  }
  attributes: {
    disableAnimations: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>
    hasIcons: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>
    leftIcon: Schema.Attribute.Component<"utilities.basic-image", false>
    rightIcon: Schema.Attribute.Component<"utilities.basic-image", false>
    size: Schema.Attribute.Enumeration<
      ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"default">
    variant: Schema.Attribute.Enumeration<
      ["default", "destructive", "outline", "secondary", "ghost", "link"]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"link">
  }
}

export interface UtilitiesLinksWithTitle extends Struct.ComponentSchema {
  collectionName: "components_utilities_links_with_titles"
  info: {
    displayName: "LinksWithTitle"
  }
  attributes: {
    links: Schema.Attribute.Component<"utilities.link", true>
    title: Schema.Attribute.String
  }
}

export interface UtilitiesText extends Struct.ComponentSchema {
  collectionName: "components_utilities_texts"
  info: {
    displayName: "Text"
  }
  attributes: {
    text: Schema.Attribute.String
  }
}

export interface UtilitiesTipTapRichText extends Struct.ComponentSchema {
  collectionName: "components_utilities_tip_tap_rich_texts"
  info: {
    displayName: "TipTapRichText"
    icon: "layer"
  }
  attributes: {
    content: Schema.Attribute.Text &
      Schema.Attribute.CustomField<
        "plugin::tiptap-editor.RichText",
        {
          preset: "everything"
        }
      >
  }
}

declare module "@strapi/strapi" {
  export namespace Public {
    export interface ComponentSchemas {
      "admin.permission": AdminPermission
      "blog.tag": BlogTag
      "elements.footer-item": ElementsFooterItem
      "form.field": FormField
      "form.option": FormOption
      "forms.contact-form": FormsContactForm
      "forms.dynamic-form": FormsDynamicForm
      "layout.navbar-item": LayoutNavbarItem
      "sections.animated-logo-row": SectionsAnimatedLogoRow
      "sections.benefits-split": SectionsBenefitsSplit
      "sections.carousel": SectionsCarousel
      "sections.content-rich-text": SectionsContentRichText
      "sections.cta": SectionsCta
      "sections.cta-banner": SectionsCtaBanner
      "sections.faq": SectionsFaq
      "sections.feature-grid": SectionsFeatureGrid
      "sections.feature-item": SectionsFeatureItem
      "sections.features-list": SectionsFeaturesList
      "sections.gallery": SectionsGallery
      "sections.heading-with-cta-button": SectionsHeadingWithCtaButton
      "sections.hero": SectionsHero
      "sections.hero-featured": SectionsHeroFeatured
      "sections.hero-standard": SectionsHeroStandard
      "sections.image-with-cta-button": SectionsImageWithCtaButton
      "sections.logo-cloud": SectionsLogoCloud
      "sections.process-steps": SectionsProcessSteps
      "sections.product-grid": SectionsProductGrid
      "sections.security-block": SectionsSecurityBlock
      "sections.statistics": SectionsStatistics
      "sections.testimonials": SectionsTestimonials
      "sections.video": SectionsVideo
      "seo-utilities.seo": SeoUtilitiesSeo
      "seo-utilities.seo-og": SeoUtilitiesSeoOg
      "seo-utilities.seo-twitter": SeoUtilitiesSeoTwitter
      "seo-utilities.social-icons": SeoUtilitiesSocialIcons
      "seo.metadata": SeoMetadata
      "shared.benefit-panel": SharedBenefitPanel
      "shared.figure": SharedFigure
      "shared.hero-perk": SharedHeroPerk
      "shared.image-with-config": SharedImageWithConfig
      "shared.image-with-title-and-description": SharedImageWithTitleAndDescription
      "shared.logo-item": SharedLogoItem
      "shared.process-step": SharedProcessStep
      "shared.product-card": SharedProductCard
      "shared.security-point": SharedSecurityPoint
      "shared.testimonial": SharedTestimonial
      "site.footer-config": SiteFooterConfig
      "site.header-config": SiteHeaderConfig
      "site.locale-config": SiteLocaleConfig
      "site.navigation-column": SiteNavigationColumn
      "site.navigation-item": SiteNavigationItem
      "site.palette": SitePalette
      "site.social-link": SiteSocialLink
      "ui.link": UiLink
      "ui.motion": UiMotion
      "ui.style": UiStyle
      "utilities.accordions": UtilitiesAccordions
      "utilities.basic-image": UtilitiesBasicImage
      "utilities.ck-editor-content": UtilitiesCkEditorContent
      "utilities.ck-editor-text": UtilitiesCkEditorText
      "utilities.image-with-link": UtilitiesImageWithLink
      "utilities.link": UtilitiesLink
      "utilities.link-decorations": UtilitiesLinkDecorations
      "utilities.links-with-title": UtilitiesLinksWithTitle
      "utilities.text": UtilitiesText
      "utilities.tip-tap-rich-text": UtilitiesTipTapRichText
    }
  }
}
