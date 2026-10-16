---
sidebar_position: 6
---

# Page Paths

Pages use `parent` and `children` relations to form a URL hierarchy. A page's `fullPath` is the chain of its parent slugs and its own slug; the root page uses `/`.

When a published page is created, renamed, moved, unpublished, or deleted, Strapi recalculates the `fullPath` values of all affected published pages in every locale. Editors should change `slug` or `parent`; the synchronization middleware updates `fullPath` automatically.

The frontend uses `fullPath` to find pages and to build breadcrumbs, metadata, and the sitemap. Cache entries for old and new paths are revalidated after synchronization.

There is no Redirect collection. Changing a path does not preserve the old URL; requests to the previous path will return the normal not-found page. Update external links when a page's path changes.

Each locale has its own slug, parent relation, and full path. A change in one locale does not change the page path in other locales.
