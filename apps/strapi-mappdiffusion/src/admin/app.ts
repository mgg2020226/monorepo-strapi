import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [
      'ar',
      'fr',
      'cs',
      'de',
      'dk',
      'es',
    ],
  },
  bootstrap(app: StrapiApp) {},
};
