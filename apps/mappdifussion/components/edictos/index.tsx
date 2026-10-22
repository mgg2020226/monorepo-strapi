import { Suspense } from "react";
import { EmptyCollectionState } from "@/components/empty-collection-state";
import { ManagerBreadcrumb } from "@/components/manager-breadcrumb";
import { formatEdictoForDisplay, getEdictos } from "@/services/edicto.service";
import { EdictoLayout } from "./_components/edictos-layout";
import { EdictosSkeleton } from "./skeleton";

interface EdictoPageProps {
  manager: string;
}

async function EdictoContent({ manager }: EdictoPageProps) {
  const edictos = await getEdictos(
    { sort: ["fecha_publicacion:desc"] },
    manager,
  );

  if (!edictos || edictos.length === 0) {
    return (
      <EmptyCollectionState
        title="Aún no hay edictos publicados"
        description="Las notificaciones por edicto se mostrarán en esta sección cuando el gestor publique nuevas actuaciones."
        primaryHref={`/${manager}`}
        primaryLabel="Volver al inicio"
        secondaryHref={`/${manager}/contacto`}
        secondaryLabel="Contactar al gestor"
      />
    );
  }

  const formatted = edictos.map(formatEdictoForDisplay);

  const tramites = Array.from(
    new Set(formatted.flatMap((e) => (e.tramite ? [e.tramite] : []))),
  ).sort();

  return (
    <main id="edictos" className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
      <ManagerBreadcrumb manager={manager} current="Edictos" />

      <div className="mb-10">
        <h1 className="mb-2 font-montserrat text-4xl font-semibold text-brand-primary">
          Edictos
        </h1>
        <p className="max-w-2xl text-foreground">
          Consulte las notificaciones por edicto emitidas por la oficina del
          Gestor Catastral en cumplimiento de los procesos catastrales.
        </p>
      </div>

      <EdictoLayout edictos={formatted} tramites={tramites} />
    </main>
  );
}

export default function EdictoPage({ manager }: EdictoPageProps) {
  return (
    <Suspense fallback={<EdictosSkeleton />}>
      <EdictoContent manager={manager} />
    </Suspense>
  );
}
