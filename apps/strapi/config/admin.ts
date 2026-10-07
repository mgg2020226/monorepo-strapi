import { microsoftSSOProvider } from "./auth-providers"

export default ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET"),
    providers: [microsoftSSOProvider(env)].filter(Boolean),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT"),
    },
  },
  watchIgnoreFiles: ["**/config/sync/**"],
})
