const DEFAULT_STRAPI_URL =
  process.env.NODE_ENV === "production"
    ? "https://micatastro.mapptech.com.co"
    : "http://localhost:1339";

export function getStrapiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_STRAPI_URL || DEFAULT_STRAPI_URL)
    .trim()
    .replace(/\/+$/, "");
}

export function toStrapiUrl(url: string | null | undefined): string | null {
  const normalizedUrl = url?.trim();

  if (!normalizedUrl) return null;
  if (/^https?:\/\//i.test(normalizedUrl)) return normalizedUrl;

  const path = normalizedUrl.startsWith("/")
    ? normalizedUrl
    : `/${normalizedUrl}`;
  return `${getStrapiBaseUrl()}${path}`;
}
