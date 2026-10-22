import type { Core } from "@strapi/strapi"

const plugins = ({ env }: Core.Config.Shared.ConfigParams) => {
  const awsAccessKeyId = env("AWS_ACCESS_KEY_ID")
  const awsAccessSecret = env("AWS_ACCESS_SECRET")
  const awsRegion = env("AWS_REGION")
  const awsBucket = env("AWS_BUCKET")
  const awsConfigured = [
    awsAccessKeyId,
    awsAccessSecret,
    awsRegion,
    awsBucket,
  ].every((value) => value?.trim())
  const awsAcl = env("AWS_ACL", "private")

  return {
    // Explicit resolution is needed in this pnpm monorepo so Strapi loads the
    // plugin's server entrypoint and registers its `color` custom field.
    "color-picker": {
      enabled: true,
      resolve: "./node_modules/@strapi/plugin-color-picker",
    },
    ...(awsConfigured && {
      upload: {
        config: {
          provider: "aws-s3",
          providerOptions: {
            rootPath: env("AWS_ROOT_PATH", "mappdiffusion"),
            s3Options: {
              credentials: {
                accessKeyId: awsAccessKeyId,
                secretAccessKey: awsAccessSecret,
              },
              region: awsRegion,
              forcePathStyle: env("AWS_FORCE_PATH_STYLE", "false") === "true",
              params: {
                ACL: awsAcl === "none" ? undefined : awsAcl,
                signedUrlExpires: Number(env("AWS_SIGNED_URL_EXPIRES", "900")),
                Bucket: awsBucket,
              },
            },
          },
          actionOptions: {
            upload: {},
            uploadStream: {},
            delete: {},
          },
        },
      },
    }),
    meilisearch: {
      config: {
        host: env("MEILI_HOST"),
        apiKey: env("MEILI_MASTER_KEY"),
      },
    },
  }
}

export default plugins
