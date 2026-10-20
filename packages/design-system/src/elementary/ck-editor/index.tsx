import { type Locale, useLocale } from "next-intl"

import { cn } from "@repo/design-system/utils"

import {
  processLinksInHtmlContent,
  removeEmptyImagesFromContent,
} from "./utils"

function CkEditorRenderer({
  htmlContent,
  className,
  locale: passedLocale,
  variant = "page",
}: {
  htmlContent?: string | null
  className?: string
  locale?: Locale
  variant?: "page" | "blog"
}) {
  const currentLocale = useLocale()
  const locale = passedLocale ?? currentLocale

  const processHtmlContent = (html: string, locale: Locale) => {
    const transformers = [
      (h: string) => processLinksInHtmlContent(h, locale),
      removeEmptyImagesFromContent,
    ]

    return transformers.reduce((result, transform) => transform(result), html)
  }

  const renderPlainTextContent = (content: string) => {
    const blocks = content
      .split(/\n+/)
      .map((block) => block.trim())
      .filter(Boolean)

    return blocks.map((block, index) => {
      const isHeading =
        index === 0 ||
        /^\d+\.\s/.test(block) ||
        block === "Responsable del tratamiento"

      return isHeading ? (
        <h2 key={`${index}-${block}`}>{block}</h2>
      ) : (
        <p key={`${index}-${block}`}>{block}</p>
      )
    })
  }

  const isHtml = htmlContent ? /<\/?[a-z][^>]*>/i.test(htmlContent) : false

  return htmlContent ? (
    isHtml ? (
      <div
        className={cn(`ck-editor-rich-text-${variant}`, className)}
        dangerouslySetInnerHTML={{
          __html: processHtmlContent(htmlContent, locale),
        }}
      />
    ) : (
      <div className={cn(`ck-editor-rich-text-${variant}`, className)}>
        {renderPlainTextContent(htmlContent)}
      </div>
    )
  ) : null
}

export default CkEditorRenderer
