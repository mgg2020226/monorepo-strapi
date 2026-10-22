import { ChevronDown, ChevronUp, ListFilter } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

export type SortOrder = "newest" | "oldest";

interface FilterToggleButtonProps {
  open: boolean;
  activeCount: number;
  onToggle: () => void;
}

export function FilterToggleButton({
  open,
  activeCount,
  onToggle,
}: FilterToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="lg:hidden w-full flex items-center justify-between glass-panel px-4 py-3 text-sm font-bold text-brand-primary"
    >
      <span className="flex items-center gap-2">
        <ListFilter className="size-4" />
        Filtros de Búsqueda
        {activeCount > 0 && (
          <span className="bg-brand-primary text-brand-primary-foreground text-xs font-bold rounded-full size-5 flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </span>
      {open ? (
        <ChevronUp className="size-4" />
      ) : (
        <ChevronDown className="size-4" />
      )}
    </button>
  );
}

interface FilterResultsHeaderProps {
  shown: number;
  total: number;
  itemLabel: string;
  sort: SortOrder;
  oldestLabel: string;
  onSortChange: (sort: SortOrder) => void;
}

export function FilterResultsHeader({
  shown,
  total,
  itemLabel,
  sort,
  oldestLabel,
  onSortChange,
}: FilterResultsHeaderProps) {
  const sortLabels: Record<SortOrder, string> = {
    newest: "Más recientes",
    oldest: oldestLabel,
  };

  return (
    <Card className="flex-shrink-0 flex flex-row justify-between items-center glass-list-item px-6 py-3 mb-6">
      <span className="text-sm font-medium text-brand-secondary-foreground">
        Mostrando {shown} de {total} {itemLabel}
      </span>
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold text-brand-muted-foreground uppercase tracking-widest">
          Ordenar por:
        </span>
        <Select
          value={sort}
          onValueChange={(value) => onSortChange(value as SortOrder)}
        >
          <SelectTrigger className="w-36 border-none bg-transparent shadow-none text-sm font-semibold text-brand-primary focus:ring-0 h-auto p-0">
            <span className="truncate">{sortLabels[sort]}</span>
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="newest">Más recientes</SelectItem>
            <SelectItem value="oldest">{oldestLabel}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}

interface FilterPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function FilterPagination({
  page,
  totalPages,
  onPageChange,
}: FilterPaginationProps) {
  function pageNumbers(): (number | "ellipsis-start" | "ellipsis-end")[] {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [1];
    if (page > 3) pages.push("ellipsis-start");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    )
      pages.push(i);
    if (page < totalPages - 2) pages.push("ellipsis-end");
    pages.push(totalPages);
    return pages;
  }

  return (
    <Pagination className="pt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            aria-disabled={page === 1}
            className={
              page === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"
            }
          />
        </PaginationItem>
        {pageNumbers().map((pageNumber) =>
          typeof pageNumber === "string" ? (
            <PaginationItem key={pageNumber}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                isActive={page === pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className="cursor-pointer"
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
            aria-disabled={page === totalPages}
            className={
              page === totalPages
                ? "pointer-events-none opacity-40"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
