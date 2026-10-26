import type { Schema, Struct } from '@strapi/strapi';

export interface CatastroAgendaItem extends Struct.ComponentSchema {
  collectionName: 'components_catastro_agenda_items';
  info: {
    displayName: 'Agenda Item';
    icon: 'calendar';
  };
  attributes: {
    description: Schema.Attribute.String;
    end_time: Schema.Attribute.Time;
    start_time: Schema.Attribute.Time;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CatastroConferencista extends Struct.ComponentSchema {
  collectionName: 'components_catastro_conferencistas';
  info: {
    displayName: 'Conferencista';
    icon: 'user';
  };
  attributes: {
    description: Schema.Attribute.Text;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    photo: Schema.Attribute.Media<'images'>;
    position: Schema.Attribute.String;
  };
}

export interface CatastroContactChannel extends Struct.ComponentSchema {
  collectionName: 'components_catastro_contact_channels';
  info: {
    description: 'Canal de atenci\u00F3n';
    displayName: 'Contact Channel';
    icon: 'phone';
  };
  attributes: {
    icon_type: Schema.Attribute.Enumeration<
      ['map_pin', 'phone', 'mail', 'clock']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'phone'>;
    line1: Schema.Attribute.String;
    line1_muted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    line2: Schema.Attribute.String;
    line2_muted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CatastroDeliverableItem extends Struct.ComponentSchema {
  collectionName: 'components_catastro_deliverable_items';
  info: {
    displayName: 'Deliverable Item';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<['green', 'blue', 'orange', 'gray']> &
      Schema.Attribute.DefaultTo<'blue'>;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CatastroLiderInstitucional extends Struct.ComponentSchema {
  collectionName: 'components_catastro_lider_institucionals';
  info: {
    displayName: 'L\u00EDder Institucional';
    icon: 'user';
  };
  attributes: {
    biography: Schema.Attribute.Blocks;
    buttons: Schema.Attribute.Component<'component.link', true>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    photo: Schema.Attribute.Media<'images'>;
    position: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CatastroNormaBannerSlide extends Struct.ComponentSchema {
  collectionName: 'components_catastro_norma_banner_slides';
  info: {
    displayName: 'Norma Banner Slide';
    icon: 'file-alt';
  };
  attributes: {
    button: Schema.Attribute.Component<'component.link', false>;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CatastroRecursoEvento extends Struct.ComponentSchema {
  collectionName: 'components_catastro_recurso_eventos';
  info: {
    displayName: 'Recurso Evento';
    icon: 'file';
  };
  attributes: {
    locked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
  };
}

export interface CatastroRequirementItem extends Struct.ComponentSchema {
  collectionName: 'components_catastro_requirement_items';
  info: {
    displayName: 'Requirement Item';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentCarouselSlide extends Struct.ComponentSchema {
  collectionName: 'components_component_carousel_slides';
  info: {
    displayName: 'Carousel Slide';
  };
  attributes: {
    buttons: Schema.Attribute.Component<'component.link', true>;
    description: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentContactChannel extends Struct.ComponentSchema {
  collectionName: 'components_component_contact_channels';
  info: {
    displayName: 'Contact Channel';
  };
  attributes: {
    icon: Schema.Attribute.Enumeration<['phone', 'mail', 'map-pin']> &
      Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<['phone', 'email', 'address']> &
      Schema.Attribute.Required;
    value: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface ComponentLink extends Struct.ComponentSchema {
  collectionName: 'components_component_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    isExternal: Schema.Attribute.Boolean;
    label: Schema.Attribute.String;
  };
}

export interface ComponentLinkFooter extends Struct.ComponentSchema {
  collectionName: 'components_component_link_footers';
  info: {
    displayName: 'Footer Link ';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentNavItem extends Struct.ComponentSchema {
  collectionName: 'components_component_nav_items';
  info: {
    displayName: 'Nav Item';
  };
  attributes: {
    dropdown: Schema.Attribute.Component<'component.nav-item-child', true>;
    href: Schema.Attribute.String;
    icon: Schema.Attribute.Media<'images' | 'files'>;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentNavItemChild extends Struct.ComponentSchema {
  collectionName: 'components_component_nav_item_children';
  info: {
    displayName: 'Nav Item Child';
  };
  attributes: {
    description: Schema.Attribute.String;
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    icon_name: Schema.Attribute.String;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_component_social_links';
  info: {
    displayName: 'Social Link';
    icon: 'chartCircle';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      ['facebook', 'twitter', 'instagram', 'youtube', 'whatsapp']
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface LayoutAboutSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_about_sections';
  info: {
    displayName: 'About Section';
  };
  attributes: {
    button: Schema.Attribute.Component<'component.link', false>;
  };
}

export interface LayoutActionCards extends Struct.ComponentSchema {
  collectionName: 'components_layout_action_cards';
  info: {
    displayName: 'Action Cards Section';
  };
  attributes: {
    cards: Schema.Attribute.Relation<'oneToMany', 'api::card.card'>;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    view_all_button: Schema.Attribute.Component<'component.link', false>;
  };
}

export interface LayoutFaqSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_faq_sections';
  info: {
    displayName: 'Faq Section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    faqs: Schema.Attribute.Relation<'oneToMany', 'api::faq.faq'>;
    title: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface LayoutHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_hero_sections';
  info: {
    displayName: 'Hero Section';
  };
  attributes: {
    slides: Schema.Attribute.Component<'layout.hero-slide', true>;
  };
}

export interface LayoutHeroSlide extends Struct.ComponentSchema {
  collectionName: 'components_layout_hero_slides';
  info: {
    displayName: 'Hero Slide';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'>;
    buttons: Schema.Attribute.Component<'component.link', true>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LayoutImageCarousel extends Struct.ComponentSchema {
  collectionName: 'components_layout_image_carousels';
  info: {
    displayName: 'Image Carousel';
  };
  attributes: {
    slides: Schema.Attribute.Component<'component.carousel-slide', true>;
  };
}

export interface LayoutLinkSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_link_sections';
  info: {
    displayName: 'Links Section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    links: Schema.Attribute.Relation<'oneToMany', 'api::link.link'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    view_all_button: Schema.Attribute.Component<'component.link', false>;
  };
}

export interface LayoutNewsSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_news_sections';
  info: {
    displayName: 'News Section';
  };
  attributes: {
    articles: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
    button: Schema.Attribute.Component<'component.link', false>;
    title: Schema.Attribute.String;
  };
}

export interface LayoutNormaBanner extends Struct.ComponentSchema {
  collectionName: 'components_layout_norma_banners';
  info: {
    displayName: 'Norma Banner';
  };
  attributes: {
    slides: Schema.Attribute.Component<'catastro.norma-banner-slide', true> &
      Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'catastro.agenda-item': CatastroAgendaItem;
      'catastro.conferencista': CatastroConferencista;
      'catastro.contact-channel': CatastroContactChannel;
      'catastro.deliverable-item': CatastroDeliverableItem;
      'catastro.lider-institucional': CatastroLiderInstitucional;
      'catastro.norma-banner-slide': CatastroNormaBannerSlide;
      'catastro.recurso-evento': CatastroRecursoEvento;
      'catastro.requirement-item': CatastroRequirementItem;
      'component.carousel-slide': ComponentCarouselSlide;
      'component.contact-channel': ComponentContactChannel;
      'component.link': ComponentLink;
      'component.link-footer': ComponentLinkFooter;
      'component.nav-item': ComponentNavItem;
      'component.nav-item-child': ComponentNavItemChild;
      'component.social-link': ComponentSocialLink;
      'layout.about-section': LayoutAboutSection;
      'layout.action-cards': LayoutActionCards;
      'layout.faq-section': LayoutFaqSection;
      'layout.hero-section': LayoutHeroSection;
      'layout.hero-slide': LayoutHeroSlide;
      'layout.image-carousel': LayoutImageCarousel;
      'layout.link-section': LayoutLinkSection;
      'layout.news-section': LayoutNewsSection;
      'layout.norma-banner': LayoutNormaBanner;
    }
  }
}
