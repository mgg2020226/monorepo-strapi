import { createSkeletonItems } from "@/lib/utils";

export function QuienesSomosSkeleton() {
  return (
    <div className="animate-pulse max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <div className="h-4 w-52 bg-muted rounded mb-4" />

      {/* Identity section */}
      <section className="mb-20 space-y-8">
        <div className="space-y-3">
          <div className="h-10 w-72 bg-brand-primary/15 rounded" />
          <div className="space-y-1.5">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-5/6 bg-muted rounded" />
            <div className="h-4 w-4/6 bg-muted rounded" />
          </div>
        </div>
        {/* Mission / Vision cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {createSkeletonItems("mission-vision", 2).map(({ id }) => (
            <div key={id} className="bg-card border rounded-xl p-8 space-y-3">
              <div className="h-6 w-28 bg-brand-primary/15 rounded" />
              <div className="space-y-1.5">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Representative section */}
      <section className="mb-20">
        <div className="h-7 w-56 bg-brand-primary/15 rounded mb-8" />
        <div className="flex flex-col md:flex-row gap-8 items-start bg-card border rounded-xl p-8">
          <div className="size-32 rounded-full bg-muted shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="h-4 w-36 bg-brand-primary/15 rounded" />
            <div className="space-y-1.5">
              <div className="h-4 w-full bg-muted/70 rounded" />
              <div className="h-4 w-5/6 bg-muted/70 rounded" />
              <div className="h-4 w-4/6 bg-muted/70 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="mb-20">
        <div className="h-7 w-40 bg-brand-primary/15 rounded mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {createSkeletonItems("member", 8).map(({ id }) => (
            <div
              key={id}
              className="bg-card border rounded-xl p-6 flex flex-col items-center gap-y-3"
            >
              <div className="size-20 rounded-full bg-muted" />
              <div className="h-5 w-28 bg-muted rounded text-center" />
              <div className="h-3 w-20 bg-muted/60 rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
