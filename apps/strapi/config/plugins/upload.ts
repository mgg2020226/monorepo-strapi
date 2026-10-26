import { logger } from "../../src/utils/logging"
import type { EnvGetter } from "../../types/internals"

const uploadSizeLimit = (env: EnvGetter) =>
  Number(env("UPLOAD_SIZE_LIMIT_MB", "25")) * 1024 * 1024

const localUploadConfig = (env: EnvGetter): Record<string, unknown> => ({
  sizeLimit: uploadSizeLimit(env),
})

const prepareAwsS3Config = (env: EnvGetter) => {
  const awsAccessKeyId = env("AWS_ACCESS_KEY_ID")
  const awsAccessSecret = env("AWS_ACCESS_SECRET")
  const awsRegion = env("AWS_REGION")
  const awsBucket = env("AWS_BUCKET")
  const awsRequirements = [
    awsAccessKeyId,
    awsAccessSecret,
    awsRegion,
    awsBucket,
  ]

  if (awsRequirements.some((value) => value == null || value === "")) {
    return
  }

  return {
    provider: "aws-s3",
    providerOptions: {
      baseUrl: env("CDN_URL"),
      rootPath: env("CDN_ROOT_PATH"),
      s3Options: {
        credentials: {
          accessKeyId: awsAccessKeyId,
          secretAccessKey: awsAccessSecret,
        },
        region: awsRegion,
        forcePathStyle: env("AWS_FORCE_PATH_STYLE", "false") === "true",
        params: {
          ACL: env("AWS_ACL", "public-read"),
          signedUrlExpires: env("AWS_SIGNED_URL_EXPIRES", 15 * 60),
          Bucket: awsBucket,
        },
      },
    },
    actionOptions: {
      upload: {},
      uploadStream: {},
      delete: {},
    },
  }
}

export function uploadConfig(env: EnvGetter) {
  const s3 = prepareAwsS3Config(env)

  if (s3) {
    logger.info("Using AWS S3 for uploads.")
  } else {
    logger.warn(
      "No cloud upload configuration is set. Falling back to local upload provider."
    )
  }

  return { config: s3 ?? localUploadConfig(env) }
}
