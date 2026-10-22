import { createSkeletonItems } from "@/lib/utils";

export function ResolucionesSkeleton() {
  const columns = [
    { id: "name", span: 2 },
    { id: "description", span: 6 },
    { id: "status", span: 2 },
    { id: "actions", span: 2 },
  ];
  return (
    <div className="animate-pulse flex-grow w-full max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="h-4 w-44 bg-muted rounded mb-4" />

      {/* Header */}
      <div className="mb-10 space-y-2">
        <div className="h-10 w-44 bg-brand-primary/15 rounded" />
        <div className="h-4 w-[540px] bg-muted rounded" />
      </div>

      {/* Year filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="h-8 w-14 bg-brand-primary/20 rounded-full" />
        {createSkeletonItems("year", 5).map(({ id }) => (
          <div key={id} className="h-8 w-16 bg-muted rounded-full" />
        ))}
      </div>

      {/* Search bar */}
      <div className="h-10 w-full max-w-sm bg-muted rounded-lg mb-6" />

      {/* Table of resolutions */}
      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2">
          {columns.map((column) => (
            <div
              key={`th-${column.id}`}
              className={`col-span-${column.span} h-3 bg-muted/50 rounded`}
            />
          ))}
        </div>
        {/* Items */}
        {createSkeletonItems("resolution", 10).map(({ id }) => (
          <div
            key={id}
            className="grid grid-cols-12 gap-4 items-center bg-card border rounded-lg p-4"
          >
            <div className="col-span-2 h-4 w-20 bg-muted rounded" />
            <div className="col-span-6 space-y-1.5">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-3 w-3/4 bg-muted/60 rounded" />
            </div>
            <div className="col-span-2 h-4 w-16 bg-muted/70 rounded" />
            <div className="col-span-2 flex justify-end">
              <div className="h-8 w-20 bg-muted rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
