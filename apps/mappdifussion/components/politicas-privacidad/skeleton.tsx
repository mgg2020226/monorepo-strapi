import { createSkeletonItems } from "@/lib/utils";

export function PoliticasPrivacidadSkeleton() {
  return (
    <div className="animate-pulse min-h-screen bg-brand-muted/30">
      {/* Hero */}
      <div className="bg-brand-card border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-6 py-14 text-center flex flex-col items-center gap-y-4">
          <div className="size-14 rounded-full bg-brand-primary/10" />
          <div className="h-10 w-80 bg-muted rounded" />
          <div className="h-4 w-56 bg-muted/60 rounded" />
        </div>
      </div>

      {/* Content card */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-brand-card rounded-xl border border-brand-border p-8 md:p-12 space-y-4">
          <div className="size-64 bg-muted rounded mb-6" />
          <div className="space-y-2">
            {createSkeletonItems("paragraph-primary", 5).map(
              ({ id, index }) => (
                <div
                  key={id}
                  className={`h-4 bg-muted/70 rounded ${index % 5 === 4 ? "w-3/4" : "w-full"}`}
                />
              ),
            )}
          </div>
          <div className="h-5 w-40 bg-muted rounded mt-6" />
          <div className="space-y-2">
            {createSkeletonItems("paragraph-secondary", 4).map(
              ({ id, index }) => (
                <div
                  key={id}
                  className={`h-4 bg-muted/70 rounded ${index % 4 === 3 ? "w-4/5" : "w-full"}`}
                />
              ),
            )}
          </div>
          <div className="h-5 w-52 bg-muted rounded mt-6" />
          <div className="space-y-2">
            {createSkeletonItems("paragraph-tertiary", 3).map(({ id }) => (
              <div key={id} className="h-4 w-full bg-muted/70 rounded" />
            ))}
          </div>
        </div>
        <div className="h-3 w-64 bg-muted/50 rounded mx-auto mt-8" />
      </div>
    </div>
  );
}
