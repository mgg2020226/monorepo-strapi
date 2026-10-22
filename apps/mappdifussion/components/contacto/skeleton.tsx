import { createSkeletonItems } from "@/lib/utils";

export function ContactoSkeleton() {
  return (
    <div className="animate-pulse flex-grow">
      {/* Hero */}
      <section className="bg-brand-card border-b border-brand-accent py-16 px-6">
        <div className="max-w-7xl mx-auto text-center gap-y-4 flex flex-col items-center">
          <div className="h-6 w-24 bg-brand-accent rounded-full" />
          <div className="h-12 w-72 bg-brand-primary/15 rounded" />
          <div className="h-4 w-96 bg-muted rounded" />
        </div>
      </section>

      {/* Channels + Form */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Channels */}
          <div className="space-y-4">
            <div className="h-7 w-48 bg-brand-primary/15 rounded mb-6" />
            {createSkeletonItems("channel", 3).map(({ id }) => (
              <div
                key={id}
                className="flex items-start gap-4 bg-card border rounded-xl p-5"
              >
                <div className="size-10 rounded-lg bg-muted shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-5 w-32 bg-muted rounded" />
                  <div className="h-3 w-48 bg-muted/70 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="bg-card border rounded-xl p-8 space-y-5">
            <div className="h-7 w-40 bg-brand-primary/15 rounded" />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-muted rounded-lg" />
                <div className="h-10 bg-muted rounded-lg" />
              </div>
              <div className="h-10 bg-muted rounded-lg" />
              <div className="h-32 bg-muted rounded-lg" />
              <div className="h-10 w-32 bg-brand-primary/20 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-brand-accent py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-7 w-48 bg-brand-primary/20 rounded mb-10 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {createSkeletonItems("step", 3).map(({ id }) => (
              <div key={id} className="text-center space-y-3">
                <div className="size-12 rounded-full bg-brand-primary/20 mx-auto" />
                <div className="h-5 w-28 bg-brand-primary/15 rounded mx-auto" />
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-4/5 bg-muted/70 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ banner */}
      <section className="bg-brand-accent py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="h-6 w-56 bg-brand-primary/15 rounded" />
            <div className="h-4 w-80 bg-muted rounded" />
          </div>
          <div className="h-10 w-48 bg-brand-primary/20 rounded-full" />
        </div>
      </section>
    </div>
  );
}
