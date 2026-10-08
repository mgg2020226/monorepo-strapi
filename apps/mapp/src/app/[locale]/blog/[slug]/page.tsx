import CkEditorRenderer from "@repo/design-system/elementary/ck-editor"
import { Container } from "@repo/design-system/elementary/Container"
import { normalizePageFullPath } from "@repo/shared-data"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { Breadcrumbs } from "@/components/elementary/Breadcrumbs"
import { getMetadataFromStrapi } from "@/lib/metadata"
import { isValidLocale } from "@/lib/navigation"
import { fetchBlogPost } from "@/lib/strapi-api/content/server"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: rawLocale, slug } = await params
  if (!isValidLocale(rawLocale)) return null

  return getMetadataFromStrapi({
    locale: rawLocale,
    slug,
    pathPrefix: "/blog",
    uid: "api::blog-post.blog-post",
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: rawLocale, slug } = await params
  if (!isValidLocale(rawLocale)) notFound()
  const locale = rawLocale as Locale
  const t = await getTranslations({ locale, namespace: "content" })
  const response = await fetchBlogPost(slug, locale)
  const post = response.data
  if (!post) notFound()

  return (
    <Container className="px-4 py-12">
      <Breadcrumbs
        locale={locale}
        breadcrumbs={[
          {
            title: t("blog"),
            fullPath: normalizePageFullPath(["/blog"], locale),
          },
          {
            title: post.title ?? "",
            fullPath: normalizePageFullPath(["/blog", slug], locale),
          },
        ]}
      />
      <article className="mx-auto max-w-224">
        <p className="text-muted-foreground text-sm">
          {String(post.publishedAt ?? "")}
        </p>
        <h1 className="mt-3 text-4xl font-bold">{post.title}</h1>
        {post.excerpt && (
          <p className="text-muted-foreground mt-5 text-xl">{post.excerpt}</p>
        )}
        <CkEditorRenderer
          htmlContent={post.content}
          variant="blog"
          className="mt-10"
        />
        <a
          href={normalizePageFullPath(["/blog"], locale)}
          className="mt-10 inline-block underline"
        >
          {t("backToBlog")}
        </a>
      </article>
    </Container>
  )
}
