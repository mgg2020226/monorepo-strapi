import { createSkeletonItems } from "@/lib/utils";

export function BlogSkeleton() {
  return (
    <div className="animate-pulse max-w-7xl mx-auto px-6 py-12">
      {/* Centered header */}
      <div className="mb-16 text-center gap-y-4 flex flex-col items-center">
        <div className="h-6 w-20 bg-brand-accent rounded-full" />
        <div className="h-12 w-56 bg-brand-primary/15 rounded" />
        <div className="h-4 w-96 bg-muted rounded" />
        <div className="h-4 w-80 bg-muted/70 rounded" />
      </div>

      {/* Filter tabs + search */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="h-9 w-16 bg-brand-primary/20 rounded-full" />
        {createSkeletonItems("category", 4).map(({ id }) => (
          <div key={id} className="h-9 w-24 bg-muted rounded-full" />
        ))}
      </div>

      {/* Article grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {createSkeletonItems("article", 6).map(({ id }) => (
          <div key={id} className="rounded-xl overflow-hidden border bg-card">
            <div className="h-48 bg-muted" />
            <div className="p-5 space-y-3">
              <div className="h-3 w-24 bg-muted rounded" />
              <div className="h-5 w-full bg-muted rounded" />
              <div className="h-5 w-4/5 bg-muted rounded" />
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-muted/70 rounded" />
                <div className="h-3 w-5/6 bg-muted/70 rounded" />
              </div>
              <div className="flex gap-2 pt-1">
                <div className="h-3 w-16 bg-muted/60 rounded" />
                <div className="h-3 w-20 bg-muted/60 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
