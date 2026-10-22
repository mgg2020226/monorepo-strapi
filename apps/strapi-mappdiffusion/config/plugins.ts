import type { Core } from '@strapi/strapi';

const plugins = ({ env }: Core.Config.Shared.ConfigParams) => ({
  meilisearch: {
    config: {
      host: env('MEILI_HOST'),
      apiKey: env('MEILI_MASTER_KEY'),
    }
  },
});
export default plugins;
