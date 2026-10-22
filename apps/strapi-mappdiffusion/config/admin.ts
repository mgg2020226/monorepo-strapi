import type { Core } from '@strapi/strapi';

const requireEnv = (
  env: Core.Config.Shared.ConfigParams['env'],
  name: string
): string => {
  const value = env(name);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: requireEnv(env, 'ADMIN_JWT_SECRET'),
    sessions: {
      maxRefreshTokenLifespan: env.int('ADMIN_MAX_REFRESH_TOKEN_LIFESPAN', 2592000),
      maxSessionLifespan: env.int('ADMIN_MAX_SESSION_LIFESPAN', 2592000),
    },
  },
  apiToken: {
    salt: requireEnv(env, 'API_TOKEN_SALT'),
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});

export default config;
