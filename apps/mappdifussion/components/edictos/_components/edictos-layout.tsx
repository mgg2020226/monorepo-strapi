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
import { EdictoCard } from "./edicto-card";

interface EdictoItem {
  id: string;
  title: string;
  description: string;
  fecha_publicacion: string | Date;
  tramite: string;
  href: string;
}

interface EdictoLayoutProps {
  edictos: EdictoItem[];
  tramites: string[];
}

const ITEMS_PER_PAGE = 12;
const edictoSearchDateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

// ── Filter state ──────────────────────────────────────────────

interface FilterState {
  search: string;
  selectedTramites: string[];
  sort: "newest" | "oldest";
  page: number;
}

type FilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "TOGGLE_TRAMITE"; payload: string }
  | { type: "SET_SORT"; payload: "newest" | "oldest" }
  | { type: "SET_PAGE"; payload: number }
  | { type: "RESET" };

const initialFilter: FilterState = {
  search: "",
  selectedTramites: [],
  sort: "newest",
  page: 1,
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload, page: 1 };
    case "TOGGLE_TRAMITE":
      return {
        ...state,
        selectedTramites: state.selectedTramites.includes(action.payload)
          ? state.selectedTramites.filter((t) => t !== action.payload)
          : [...state.selectedTramites, action.payload],
        page: 1,
      };
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
  selectedTramites: ReadonlySet<string>;
  tramites: string[];
  hasActiveFilters: boolean;
  activeCount: number;
  dispatch: React.Dispatch<FilterAction>;
}

function FiltersSidebar({
  search,
  selectedTramites,
  tramites,
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
              htmlFor="edicto-search"
              className="text-xs font-bold uppercase tracking-wider text-brand-muted-foreground"
            >
              Buscar
            </label>
            <div className="relative">
              <Input
                id="edicto-search"
                type="text"
                placeholder="Título, descripción o fecha…"
                value={search}
                onChange={(e) =>
                  dispatch({ type: "SET_SEARCH", payload: e.target.value })
                }
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-brand-input focus:ring-2 focus:ring-brand-ring focus:border-brand-ring outline-none text-sm"
              />
              <Search className="absolute left-3 top-2.5 size-4 text-brand-muted-foreground" />
            </div>
          </div>

          {tramites.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-muted-foreground">
                Trámite
              </span>
              <div className="flex flex-col gap-3 mt-2">
                {tramites.map((tramite) => (
                  <label
                    key={tramite}
                    htmlFor={`tramite-${tramite}`}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <Checkbox
                      id={`tramite-${tramite}`}
                      checked={selectedTramites.has(tramite)}
                      onCheckedChange={() =>
                        dispatch({ type: "TOGGLE_TRAMITE", payload: tramite })
                      }
                    />
                    <span className="text-sm text-brand-foreground group-hover:text-brand-primary">
                      {tramite}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

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

export function EdictoLayout({ edictos, tramites }: EdictoLayoutProps) {
  const [{ search, selectedTramites, sort, page }, dispatch] = useReducer(
    filterReducer,
    initialFilter,
  );
  const selectedTramiteSet = useMemo(
    () => new Set(selectedTramites),
    [selectedTramites],
  );

  const filtered = useMemo(() => {
    let result = [...edictos];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          edictoSearchDateFormatter
            .format(new Date(e.fecha_publicacion))
            .toLowerCase()
            .includes(q),
      );
    }

    if (selectedTramites.length > 0) {
      result = result.filter((e) => selectedTramiteSet.has(e.tramite));
    }

    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.fecha_publicacion).getTime() -
          new Date(a.fecha_publicacion).getTime(),
      );
    } else {
      result.sort(
        (a, b) =>
          new Date(a.fecha_publicacion).getTime() -
          new Date(b.fecha_publicacion).getTime(),
      );
    }

    return result;
  }, [edictos, search, selectedTramiteSet, selectedTramites.length, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const hasActiveFilters =
    search.trim() !== "" || selectedTramites.length > 0 || sort !== "newest";

  const activeCount = (search.trim() ? 1 : 0) + selectedTramites.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <FiltersSidebar
        search={search}
        selectedTramites={selectedTramiteSet}
        tramites={tramites}
        hasActiveFilters={hasActiveFilters}
        activeCount={activeCount}
        dispatch={dispatch}
      />

      <div className="lg:col-span-9 flex flex-col lg:max-h-[calc(100vh-8rem)]">
        <FilterResultsHeader
          shown={paginated.length}
          total={filtered.length}
          itemLabel="edictos"
          sort={sort}
          oldestLabel="Más antiguos"
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
              {paginated.map((e) => (
                <EdictoCard key={e.id} {...e} />
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
                No se encontraron edictos con los filtros aplicados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
