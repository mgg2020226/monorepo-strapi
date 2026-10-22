const DEFAULT_STRAPI_URL =
  process.env.NODE_ENV === "production"
    ? "https://micatastro.mapptech.com.co"
    : "http://localhost:1337";

function getRemotePatterns() {
  const patterns = [
    {
      protocol: "http",
      hostname: "localhost",
      port: "1337",
      pathname: "/uploads/**",
    },
  ];

  try {
    const strapiUrl = new URL(
      (process.env.NEXT_PUBLIC_STRAPI_URL || DEFAULT_STRAPI_URL).trim(),
    );

    patterns.push({
      protocol: strapiUrl.protocol.replace(":", ""),
      hostname: strapiUrl.hostname,
      port: strapiUrl.port,
      pathname: "/uploads/**",
    });
  } catch {
    // keep the local dev fallback if the env var is malformed
  }

  return patterns;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: getRemotePatterns(),
  },
};

export default nextConfig;
