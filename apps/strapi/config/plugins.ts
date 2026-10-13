import { emailConfig } from "./plugins/email"
import { smartPopulateConfig } from "./plugins/smart-populate"
import { tipTapEditorConfig } from "./plugins/tiptap"
import { uploadConfig } from "./plugins/upload"

export default ({ env }) => {
  return {
    "config-sync": {
      enabled: true,
    },

    "users-permissions": {
      config: {
        register: {
          enabled: false,
        },
        jwt: {
          expiresIn: "30d", // this value is synced with Better Auth session maxAge
        },
        // Rate limiting for auth/registration endpoints (login, register,
        // forgot/reset password) to mitigate brute-force and abuse.
        // https://docs.strapi.io/cms/features/users-permissions#rate-limiting-configuration
        ratelimit: {
          enabled: true,
          interval: 60000, // 1 minute window
          max: 5, // max 5 requests per window, per user/path/IP
        },
      },
    },

    i18n: {
      enabled: true,
      config: {
        defaultLocale: "es",
        locales: ["es", "en"],
      },
    },

    typesense: {
      enabled: Boolean(env("TYPESENSE_API_KEY") && env("TYPESENSE_HOST")),
      config: {
        apiKey: env("TYPESENSE_API_KEY"),
        nodes: [
          {
            host: env("TYPESENSE_HOST", "localhost"),
            port: Number(env("TYPESENSE_PORT", "8108")),
            protocol: env("TYPESENSE_PROTOCOL", "http"),
          },
        ],
        collections: {
          "api::page.page": {
            name: "pages",
            facets: ["site", "locale", "pageType"],
          },
          "api::blog-post.blog-post": {
            name: "blog_posts",
            facets: ["site", "locale", "category", "tags"],
          },
        },
      },
    },

    sentry: {
      enabled: true,
      config: {
        // Only set `dsn` property in production
        dsn: env("NODE_ENV") === "production" ? env("SENTRY_DSN") : null,
        sendMetadata: true,
      },
    },

    upload: uploadConfig(env),

    email: emailConfig(env),

    "tiptap-editor": tipTapEditorConfig(),

    "smart-populate": smartPopulateConfig(),
  }
}
