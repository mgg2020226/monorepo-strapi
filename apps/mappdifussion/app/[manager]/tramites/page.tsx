import { Suspense } from "react";
import { EmptyCollectionState } from "@/components/empty-collection-state";
import { ServiciosContent } from "@/components/servicios/_components/servicios-content";
import { ServiciosPageHeader } from "@/components/servicios/_components/servicios-page-header";
import { ServiciosSkeleton } from "@/components/servicios/skeleton";
import { getServicios } from "@/services/servicio.service";

export const metadata = {
  title: "Trámites | Gestor Catastral",
  description:
    "Consulte los trámites catastrales disponibles, requisitos y pasos para gestionar actualizaciones y correcciones prediales.",
};

interface Props {
  params: Promise<{ manager: string }>;
}

async function TramitesContent({ manager }: { manager: string }) {
  const items = await getServicios(manager, "tramite");

  if (!items.length) {
    return (
      <EmptyCollectionState
        title="Aún no hay trámites publicados"
        description="Los trámites catastrales disponibles para este gestor aparecerán aquí cuando sean publicados."
        primaryHref={`/${manager}`}
        primaryLabel="Volver al inicio"
        secondaryHref={`/${manager}/contacto`}
        secondaryLabel="Contactar al gestor"
      />
    );
  }

  return (
    <main
      id="tramites"
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
    >
      <ServiciosPageHeader
        manager={manager}
        title="Trámites"
        description="Consulte los trámites catastrales disponibles para este gestor."
      />
      <ServiciosContent items={items} />
    </main>
  );
}

export default async function TramitesPage({ params }: Props) {
  const { manager } = await params;
  return (
    <Suspense fallback={<ServiciosSkeleton />}>
      <TramitesContent manager={manager} />
    </Suspense>
  );
}
