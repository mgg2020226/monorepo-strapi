import { createSkeletonItems } from "@/lib/utils";

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function CalendarSkeleton() {
  return (
    <section className="animate-pulse agenda-fullcalendar bg-card border border-border rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="h-6 w-40 bg-muted rounded" />
        <div className="flex gap-2">
          <div className="size-8 bg-muted rounded" />
          <div className="h-8 w-14 bg-muted rounded" />
          <div className="size-8 bg-muted rounded" />
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wide"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells — 5 weeks */}
      <div className="grid grid-cols-7">
        {createSkeletonItems("day", 35).map(({ id, index }) => {
          const hasEvent = [2, 8, 15, 16, 22, 28].includes(index);
          const hasEvent2 = [8, 22].includes(index);
          return (
            <div
              key={id}
              className="min-h-[90px] border-b border-r border-border p-1.5 last:border-r-0"
            >
              <div className="size-6 bg-muted/50 rounded-full mb-1.5" />
              {hasEvent && (
                <div className="h-5 w-full bg-brand-primary/20 rounded mb-1" />
              )}
              {hasEvent2 && (
                <div className="h-5 w-4/5 bg-brand-primary/10 rounded" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function AgendaSkeleton() {
  return (
    <div className="animate-pulse flex-grow w-full max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="h-4 w-48 bg-muted rounded mb-4" />

      {/* Header */}
      <div className="mb-10 space-y-2">
        <div className="h-10 w-32 bg-brand-primary/15 rounded" />
        <div className="h-4 w-[480px] bg-muted rounded" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8">
        {createSkeletonItems("tab", 3).map(({ id }) => (
          <div key={id} className="h-8 w-24 bg-muted rounded-full" />
        ))}
      </div>

      {/* Layout: event list + featured */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event list */}
        <div className="lg:col-span-2 space-y-4">
          {createSkeletonItems("event", 5).map(({ id }) => (
            <div key={id} className="bg-card rounded-xl p-5 flex gap-5 border">
              <div className="size-16 bg-muted rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 bg-muted rounded" />
                <div className="h-3 w-1/2 bg-muted/70 rounded" />
                <div className="h-3 w-1/3 bg-muted/70 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Featured event card */}
        <div className="space-y-4">
          <div className="h-48 bg-muted rounded-xl" />
          <div className="space-y-3 p-4 bg-card border rounded-xl">
            <div className="h-3 w-20 bg-brand-primary/20 rounded" />
            <div className="h-6 w-full bg-muted rounded" />
            <div className="h-6 w-4/5 bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted/70 rounded" />
            <div className="h-9 w-32 bg-brand-primary/20 rounded-full mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventDetailSkeleton() {
  return (
    <div className="animate-pulse flex-grow">
      {/* Hero */}
      <section className="bg-brand-primary/20 py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-4 w-40 bg-white/20 rounded" />
          <div className="space-y-3">
            <div className="h-12 w-3/4 bg-white/20 rounded" />
            <div className="h-12 w-1/2 bg-white/20 rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-9 w-36 bg-white/20 rounded-lg" />
            <div className="h-9 w-28 bg-white/20 rounded-lg" />
            <div className="h-9 w-28 bg-white/20 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="h-5 w-36 bg-muted rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-card border rounded-xl p-8 space-y-4">
              <div className="h-7 w-48 bg-brand-primary/15 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-5/6 bg-muted rounded" />
                <div className="h-4 w-4/6 bg-muted rounded" />
              </div>
            </div>
            <div className="bg-card border rounded-xl p-8 space-y-6">
              <div className="h-7 w-40 bg-brand-primary/15 rounded" />
              {createSkeletonItems("timeline", 4).map(({ id }) => (
                <div key={id} className="pl-12 space-y-1">
                  <div className="h-3 w-20 bg-muted/70 rounded" />
                  <div className="h-5 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-full bg-muted/60 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-card border rounded-xl p-6 space-y-4">
              <div className="h-6 w-36 bg-brand-primary/15 rounded" />
              {createSkeletonItems("speaker", 2).map(({ id }) => (
                <div key={id} className="flex gap-3">
                  <div className="size-12 rounded-full bg-muted shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 w-3/4 bg-muted rounded" />
                    <div className="h-3 w-1/2 bg-muted/70 rounded" />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-card border rounded-xl p-6 space-y-3">
              <div className="h-6 w-40 bg-brand-primary/15 rounded" />
              {createSkeletonItems("resource", 3).map(({ id }) => (
                <div key={id} className="h-11 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
