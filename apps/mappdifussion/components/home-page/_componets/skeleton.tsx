import { createSkeletonItems } from "@/lib/utils";

export function HomepageContentSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero */}
      <div className="relative h-[560px] m-3 rounded-md bg-brand-primary/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl space-y-5">
            <div className="h-6 w-32 bg-white/20 rounded-full" />
            <div className="space-y-3">
              <div className="h-10 w-3/4 bg-white/20 rounded-lg" />
              <div className="h-10 w-1/2 bg-white/20 rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-white/15 rounded" />
              <div className="h-4 w-5/6 bg-white/15 rounded" />
            </div>
            <div className="flex gap-3 pt-2">
              <div className="h-10 w-36 bg-white/20 rounded-full" />
              <div className="h-10 w-32 bg-white/15 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* NormaBannerCarousel */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {createSkeletonItems("norma", 3).map(({ id }) => (
            <div key={id} className="h-28 bg-white rounded-xl shadow-md" />
          ))}
        </div>
      </div>

      {/* ServiciosUnClic */}
      <section className="py-16 bg-brand-accent mt-5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2">
              <div className="h-7 w-64 bg-brand-primary/20 rounded" />
              <div className="h-4 w-80 bg-brand-primary/10 rounded" />
            </div>
            <div className="h-9 w-32 bg-brand-primary/20 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {createSkeletonItems("service", 4).map(({ id }) => (
              <div
                key={id}
                className="bg-white rounded-xl p-6 space-y-3 shadow-sm"
              >
                <div className="size-8 bg-brand-primary/20 rounded-lg" />
                <div className="h-5 w-3/4 bg-brand-primary/15 rounded" />
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-muted rounded" />
                  <div className="h-3 w-5/6 bg-muted rounded" />
                  <div className="h-3 w-4/6 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BentoServices */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="h-8 w-72 bg-brand-primary/15 rounded mx-auto" />
          <div className="h-1 w-20 bg-brand-primary/20 mx-auto" />
          <div className="h-4 w-96 bg-muted rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[240px]">
          <div className="md:col-span-8 md:row-span-2 bg-muted/50 rounded-lg p-10 space-y-6">
            <div className="size-16 bg-brand-accent rounded-xl" />
            <div className="h-7 w-2/3 bg-muted rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-5/6 bg-muted rounded" />
              <div className="h-4 w-4/6 bg-muted rounded" />
            </div>
          </div>
          {createSkeletonItems("bento", 4).map(({ id }) => (
            <div
              key={id}
              className="md:col-span-4 bg-muted/50 rounded-lg p-8 space-y-4"
            >
              <div className="size-12 bg-brand-accent rounded-lg" />
              <div className="h-5 w-3/4 bg-muted rounded" />
              <div className="h-3 w-full bg-muted rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="mb-10 space-y-3">
          <div className="h-8 w-48 bg-brand-primary/15 rounded" />
          <div className="h-1 w-16 bg-brand-primary/20 rounded-full" />
        </div>
        <div className="space-y-3">
          {createSkeletonItems("faq", 5).map(({ id }) => (
            <div key={id} className="h-14 bg-muted/50 rounded-lg" />
          ))}
        </div>
      </section>
    </div>
  );
}

export function ArticlesSkeleton() {
  return (
    <div className="animate-pulse w-full py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 space-y-3">
          <div className="h-9 w-72 bg-brand-primary/15 rounded" />
          <div className="h-1 w-16 bg-brand-primary/20 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {createSkeletonItems("article", 3).map(({ id }) => (
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
