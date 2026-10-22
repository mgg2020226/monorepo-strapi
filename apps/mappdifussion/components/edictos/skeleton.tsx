import { createSkeletonItems } from "@/lib/utils";

export function EdictosSkeleton() {
  const columns = [
    { id: "name", span: 3 },
    { id: "description", span: 5 },
    { id: "status", span: 2 },
    { id: "actions", span: 2 },
  ];
  return (
    <div className="animate-pulse flex-grow w-full max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="h-4 w-40 bg-muted rounded mb-4" />

      {/* Header */}
      <div className="mb-10 space-y-2">
        <div className="h-10 w-32 bg-brand-primary/15 rounded" />
        <div className="h-4 w-[520px] bg-muted rounded" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="h-8 w-14 bg-brand-primary/20 rounded-full" />
        {createSkeletonItems("filter", 4).map(({ id }) => (
          <div key={id} className="h-8 w-28 bg-muted rounded-full" />
        ))}
      </div>

      {/* Table/list of edictos */}
      <div className="space-y-3">
        {/* Header row */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2">
          {columns.map((column) => (
            <div
              key={`th-${column.id}`}
              className={`col-span-${column.span} h-3 bg-muted/50 rounded`}
            />
          ))}
        </div>
        {/* Items */}
        {createSkeletonItems("edict", 8).map(({ id }) => (
          <div
            key={id}
            className="grid grid-cols-12 gap-4 items-center bg-card border rounded-lg p-4"
          >
            <div className="col-span-3 h-4 bg-muted rounded" />
            <div className="col-span-5 space-y-1.5">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-3 w-4/5 bg-muted/60 rounded" />
            </div>
            <div className="col-span-2 h-5 w-20 bg-muted rounded-full" />
            <div className="col-span-2 flex justify-end">
              <div className="h-8 w-24 bg-muted rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
