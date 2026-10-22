"use client";

import { ListFilter, Search, SearchX, Trash } from "lucide-react";
import { useMemo, useReducer, useState } from "react";
import {
  FilterPagination,
  FilterResultsHeader,
  FilterToggleButton,
} from "@/components/shared/list-controls";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ResolutionCard } from "./resolution-card";

type ResolutionType = "avaluos" | "geografica" | "catastral";

interface ResolutionItem {
  id: string;
  title: string;
  date: string | Date;
  formattedDate: string;
  description: string;
  documentUrl?: string;
  imageUrl?: string;
  resolution_type?: ResolutionType;
  year?: number;
}

interface ResolutionsLayoutProps {
  resolutions: ResolutionItem[];
  years: number[];
  manager: string;
}

const ITEMS_PER_PAGE = 12;

// ── Filter state ──────────────────────────────────────────────

interface FilterState {
  search: string;
  selectedTypes: ResolutionType[];
  selectedYear: string;
  sort: "newest" | "oldest";
  page: number;
}

type FilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "TOGGLE_TYPE"; payload: ResolutionType }
  | { type: "SET_YEAR"; payload: string }
  | { type: "SET_SORT"; payload: "newest" | "oldest" }
  | { type: "SET_PAGE"; payload: number }
  | { type: "RESET" };

const initialFilter: FilterState = {
  search: "",
  selectedTypes: [],
  selectedYear: "all",
  sort: "newest",
  page: 1,
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload, page: 1 };
    case "TOGGLE_TYPE":
      return {
        ...state,
        selectedTypes: state.selectedTypes.includes(action.payload)
          ? state.selectedTypes.filter((t) => t !== action.payload)
          : [...state.selectedTypes, action.payload],
        page: 1,
      };
    case "SET_YEAR":
      return { ...state, selectedYear: action.payload, page: 1 };
    case "SET_SORT":
      return { ...state, sort: action.payload, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "RESET":
      return initialFilter;
    default:
      return state;
  }
}

// ── Sub-components ────────────────────────────────────────────

interface FiltersSidebarProps {
  search: string;
  selectedTypes: ResolutionType[];
  selectedYear: string;
  years: number[];
  hasActiveFilters: boolean;
  activeCount: number;
  dispatch: React.Dispatch<FilterAction>;
}

function FiltersSidebar({
  search,
  selectedTypes,
  selectedYear,
  years,
  hasActiveFilters,
  activeCount,
  dispatch,
}: FiltersSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <aside className="lg:col-span-3 lg:sticky lg:top-20">
      {/* Mobile toggle */}
      <FilterToggleButton
        open={open}
        activeCount={activeCount}
        onToggle={() => setOpen((v) => !v)}
      />

      <div className={`glass-panel p-6 ${open ? "block" : "hidden"} lg:block`}>
        <h3 className="font-semibold text-brand-primary mb-4 hidden lg:flex items-center gap-2">
          <ListFilter className="size-5" />
          Filtros de Búsqueda
        </h3>

        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="res-search"
              className="text-xs font-bold uppercase tracking-wider text-brand-muted-foreground"
            >
              Número o Año
            </label>
            <div className="relative">
              <Input
                id="res-search"
                type="text"
                placeholder="Ej: 2024"
                value={search}
                onChange={(e) =>
                  dispatch({ type: "SET_SEARCH", payload: e.target.value })
                }
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-brand-input focus:ring-2 focus:ring-brand-ring focus:border-brand-ring outline-none text-sm"
              />
              <Search className="absolute left-3 top-2.5 size-4 text-brand-muted-foreground" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-muted-foreground">
              Tipo de Resolución
            </span>
            <div className="flex flex-col gap-3 mt-2">
              {(
                [
                  { value: "avaluos", label: "Avaluos" },
                  { value: "geografica", label: "Geográfica" },
                  { value: "catastral", label: "Catastral" },
                ] as { value: ResolutionType; label: string }[]
              ).map(({ value, label }) => (
                <label
                  key={value}
                  htmlFor={`type-${value}`}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <Checkbox
                    id={`type-${value}`}
                    checked={selectedTypes.includes(value)}
                    onCheckedChange={() =>
                      dispatch({ type: "TOGGLE_TYPE", payload: value })
                    }
                  />
                  <span className="text-sm text-brand-foreground group-hover:text-brand-primary">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="res-year"
              className="text-xs font-bold uppercase tracking-wider text-brand-muted-foreground"
            >
              Vigencia
            </label>
            <Select
              value={selectedYear}
              onValueChange={(value) =>
                dispatch({ type: "SET_YEAR", payload: value ?? "all" })
              }
            >
              <SelectTrigger className="w-full">
                <span
                  className="flex flex-1 text-left text-sm truncate"
                  data-slot="select-value"
                >
                  {selectedYear === "all" ? "Año" : selectedYear}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los años</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            onClick={() => dispatch({ type: "RESET" })}
            disabled={!hasActiveFilters}
            className="w-full bg-brand-background hover:bg-brand-destructive/5 text-brand-destructive border border-brand-destructive font-bold py-2.5 rounded-md transition-[background-color,opacity] text-sm tracking-wide disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Trash /> Limpiar filtros
          </Button>
        </div>
      </div>
    </aside>
  );
}

// ── Main layout ───────────────────────────────────────────────

export function ResolutionsLayout({
  resolutions,
  years,
  manager: _manager,
}: ResolutionsLayoutProps) {
  const [{ search, selectedTypes, selectedYear, sort, page }, dispatch] =
    useReducer(filterReducer, initialFilter);
  const selectedTypeSet = useMemo(
    () => new Set(selectedTypes),
    [selectedTypes],
  );

  const filtered = useMemo(() => {
    let result = [...resolutions];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          String(r.year).includes(q),
      );
    }

    if (selectedTypeSet.size > 0) {
      result = result.filter(
        (r) => r.resolution_type && selectedTypeSet.has(r.resolution_type),
      );
    }

    if (selectedYear !== "all") {
      result = result.filter((r) => r.year === Number(selectedYear));
    }

    if (sort === "newest") {
      result.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    } else if (sort === "oldest") {
      result.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    }

    return result;
  }, [resolutions, search, selectedTypeSet, selectedYear, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedTypes.length > 0 ||
    selectedYear !== "all" ||
    sort !== "newest";

  const activeCount =
    (search.trim() ? 1 : 0) +
    selectedTypes.length +
    (selectedYear !== "all" ? 1 : 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <FiltersSidebar
        search={search}
        selectedTypes={selectedTypes}
        selectedYear={selectedYear}
        years={years}
        hasActiveFilters={hasActiveFilters}
        activeCount={activeCount}
        dispatch={dispatch}
      />

      <div className="lg:col-span-9 flex flex-col lg:max-h-[calc(100vh-8rem)]">
        <FilterResultsHeader
          shown={paginated.length}
          total={filtered.length}
          itemLabel="resoluciones"
          sort={sort}
          oldestLabel="Más antiguas"
          onSortChange={(value) =>
            dispatch({ type: "SET_SORT", payload: value })
          }
        />

        <div
          className="lg:overflow-y-auto flex-1 space-y-6 p-4"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "var(--border) transparent",
          }}
        >
          {paginated.length > 0 ? (
            <>
              {paginated.map((r) => (
                <ResolutionCard key={r.id} {...r} />
              ))}
              {totalPages > 1 && (
                <FilterPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(value) =>
                    dispatch({ type: "SET_PAGE", payload: value })
                  }
                />
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <SearchX className="size-12 text-border mx-auto" />
              <p className="mt-4 text-brand-secondary-foreground">
                No se encontraron resoluciones con los filtros aplicados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
