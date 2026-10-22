import { createSkeletonItems } from "@/lib/utils";

export function ArticleMainSkeleton() {
  return (
    <div className="animate-pulse lg:col-span-8">
      {/* Breadcrumb */}
      <div className="h-4 w-56 bg-muted rounded mb-4" />

      {/* Header */}
      <div className="mb-10 space-y-4">
        <div className="h-5 w-24 bg-brand-accent rounded" />
        <div className="space-y-2">
          <div className="h-8 w-full bg-brand-primary/15 rounded" />
          <div className="h-8 w-4/5 bg-brand-primary/15 rounded" />
        </div>
        {/* Meta bar */}
        <div className="flex items-center gap-6 py-6 border-y border-brand-accent">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-muted shrink-0" />
            <div className="h-4 w-28 bg-muted rounded" />
          </div>
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>

      {/* Hero image */}
      <div className="w-full aspect-video rounded-xl bg-muted mb-12" />

      {/* Extract */}
      <div className="h-5 w-full bg-muted rounded mb-2" />
      <div className="h-5 w-4/5 bg-muted rounded mb-6" />

      {/* Body text */}
      <div className="space-y-3">
        {createSkeletonItems("line", 8).map(({ id, index }) => (
          <div
            key={id}
            className={`h-4 bg-muted/70 rounded ${index % 5 === 4 ? "w-3/4" : "w-full"}`}
          />
        ))}
        <div className="h-7 w-56 bg-brand-primary/15 rounded mt-6" />
        {createSkeletonItems("line-secondary", 5).map(({ id, index }) => (
          <div
            key={id}
            className={`h-4 bg-muted/70 rounded ${index % 4 === 3 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </div>

      {/* Tags */}
      <div className="flex gap-2 mt-12 pt-8 border-t border-brand-accent">
        <div className="h-4 w-16 bg-muted/60 rounded" />
        {createSkeletonItems("tag", 3).map(({ id }) => (
          <div key={id} className="h-6 w-20 bg-muted rounded-full" />
        ))}
      </div>
    </div>
  );
}

export function ArticleSidebarSkeleton() {
  return (
    <div className="animate-pulse lg:col-span-4 space-y-6">
      {/* Categories card */}
      <div className="bg-card border rounded-xl p-6 space-y-3">
        <div className="h-5 w-40 bg-brand-primary/15 rounded" />
        {createSkeletonItems("category", 4).map(({ id }) => (
          <div key={id} className="flex justify-between">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-4 w-8 bg-muted/60 rounded" />
          </div>
        ))}
      </div>
      {/* Related articles */}
      <div className="bg-card border rounded-xl p-6 space-y-4">
        <div className="h-5 w-36 bg-brand-primary/15 rounded" />
        {createSkeletonItems("related", 3).map(({ id }) => (
          <div key={id} className="flex gap-3">
            <div className="size-14 bg-muted rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-3 w-20 bg-muted/60 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
