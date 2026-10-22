import { createSkeletonItems } from "@/lib/utils";

export function ServiciosSkeleton() {
  return (
    <div className="animate-pulse max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb + Header */}
      <div className="mb-12 space-y-4">
        <div className="h-4 w-40 bg-muted rounded" />
        <div className="h-10 w-36 bg-brand-primary/15 rounded" />
        <div className="h-5 w-[480px] bg-muted rounded" />
      </div>

      {/* Carousel / category filters */}
      <div className="flex gap-2 mb-6">
        <div className="h-8 w-14 bg-brand-primary/20 rounded-full" />
        {createSkeletonItems("category", 3).map(({ id }) => (
          <div key={id} className="h-8 w-28 bg-muted rounded-full" />
        ))}
      </div>

      {/* Carousel items row */}
      <div className="flex gap-4 mb-10 overflow-hidden">
        {createSkeletonItems("service", 4).map(({ id }) => (
          <div
            key={id}
            className="min-w-[200px] h-24 bg-card border rounded-xl p-4 space-y-2 shrink-0"
          >
            <div className="size-8 bg-muted rounded-lg" />
            <div className="h-4 w-3/4 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Detail + Sidebar grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detail card */}
        <div className="lg:col-span-2 bg-card border rounded-xl p-8 space-y-5">
          <div className="size-12 bg-muted rounded-lg" />
          <div className="h-7 w-2/3 bg-brand-primary/15 rounded" />
          <div className="space-y-2">
            {createSkeletonItems("description-line", 5).map(({ id, index }) => (
              <div
                key={id}
                className={`h-4 bg-muted/70 rounded ${index % 4 === 3 ? "w-3/4" : "w-full"}`}
              />
            ))}
          </div>
          <div className="space-y-3 pt-2">
            {createSkeletonItems("requirement", 3).map(({ id }) => (
              <div key={id} className="flex items-center gap-3">
                <div className="size-5 rounded-full bg-muted shrink-0" />
                <div className="h-4 flex-1 bg-muted/70 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-card border rounded-xl p-6 space-y-5">
          <div className="h-6 w-40 bg-brand-primary/15 rounded" />
          <div className="space-y-3">
            {createSkeletonItems("sidebar-item", 4).map(({ id }) => (
              <div key={id} className="h-10 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
