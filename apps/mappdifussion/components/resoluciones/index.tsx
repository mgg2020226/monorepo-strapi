import { Suspense } from "react";
import { EmptyCollectionState } from "@/components/empty-collection-state";
import { ManagerBreadcrumb } from "@/components/manager-breadcrumb";
import {
  formatResolutionForDisplay,
  getResolutions,
} from "@/services/resolution.service";
import { ResolutionsLayout } from "./_components/resolutions-layout";
import { ResolucionesSkeleton } from "./skeleton";

interface ResolucionesPageProps {
  manager: string;
}

async function ResolucionesContent({ manager }: ResolucionesPageProps) {
  const resolutions = await getResolutions({ sort: ["date:desc"] }, manager);

  if (!resolutions || resolutions.length === 0) {
    return (
      <EmptyCollectionState
        title="Aún no hay resoluciones publicadas"
        description="Las resoluciones emitidas por este gestor aparecerán aquí cuando estén disponibles para consulta."
        primaryHref={`/${manager}`}
        primaryLabel="Volver al inicio"
        secondaryHref={`/${manager}/contacto`}
        secondaryLabel="Contactar al gestor"
      />
    );
  }

  const formatted = resolutions.map((r) => {
    const base = formatResolutionForDisplay(r);
    return {
      ...base,
      documentUrl: base.documentUrl || undefined,
    };
  });

  const years = Array.from(
    new Set(formatted.flatMap((r) => (r.year ? [r.year] : []))),
  ).sort((a, b) => b - a);

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
      <ManagerBreadcrumb manager={manager} current="Resoluciones" />

      <div className="mb-10">
        <h1 className="mb-2 font-montserrat text-4xl font-semibold text-brand-primary">
          Resoluciones
        </h1>
        <p className="max-w-2xl text-foreground">
          Consulte los actos administrativos, disposiciones técnicas y
          operativas emitidas por la oficina del Gestor Catastral para el
          cumplimiento de la política pública.
        </p>
      </div>

      <ResolutionsLayout
        resolutions={formatted}
        years={years}
        manager={manager}
      />
    </main>
  );
}

export default function ResolucionesPage({ manager }: ResolucionesPageProps) {
  return (
    <Suspense fallback={<ResolucionesSkeleton />}>
      <ResolucionesContent manager={manager} />
    </Suspense>
  );
}
