import { themes as prismThemes } from "prism-react-renderer"
import type { Config } from "@docusaurus/types"
import type * as Preset from "@docusaurus/preset-classic"

const url = process.env.DOCUSAURUS_URL ?? "https://mgg2020226.github.io"
const baseUrl = process.env.DOCUSAURUS_BASE_URL ?? "/monorepo-strapi/"

const config: Config = {
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },
  themes: ["@docusaurus/theme-mermaid"],
  plugins: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: "/",
      },
    ],
  ],
  organizationName: "mgg2020226",
  projectName: "monorepo-strapi",
  title: "Strapi Next Monorepo Starter",
  tagline: "Enterprise-grade Strapi v5 + Next.js starter template",
  url,
  baseUrl,
  trailingSlash: true,
  onBrokenLinks: "throw",
  favicon: "img/favicon.svg",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/mgg2020226/monorepo-strapi/edit/principal/apps/docs/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/page-builder-flow.webp",
    metadata: [{ property: "og:type", content: "website" }],
    navbar: {
      title: "Strapi Next Starter",
      items: [
        {
          type: "docSidebar",
          sidebarId: "docs",
          position: "left",
          label: "Docs",
        },
        {
          href: "https://strapinextjs.notum.tech",
          label: "Live demo",
          position: "right",
        },
        {
          href: "https://github.com/mgg2020226/monorepo-strapi",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} Monorepo Strapi. Report docs issues on <a href="https://github.com/mgg2020226/monorepo-strapi/issues">GitHub</a>.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ["bash", "json", "typescript"],
    },
  } satisfies Preset.ThemeConfig,
}

export default config
