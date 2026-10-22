import { Suspense } from "react";
import { EmptyCollectionState } from "@/components/empty-collection-state";
import { ServiciosContent } from "@/components/servicios/_components/servicios-content";
import { ServiciosPageHeader } from "@/components/servicios/_components/servicios-page-header";
import { ServiciosSkeleton } from "@/components/servicios/skeleton";
import { getServicios } from "@/services/servicio.service";

export const metadata = {
  title: "Productos | Gestor Catastral",
  description:
    "Explore los productos catastrales disponibles como certificados, planos y demás documentos oficiales del catastro.",
};

interface Props {
  params: Promise<{ manager: string }>;
}

async function ProductosContent({ manager }: { manager: string }) {
  const items = await getServicios(manager, "producto");

  if (!items.length) {
    return (
      <EmptyCollectionState
        title="Aún no hay productos publicados"
        description="Los productos catastrales disponibles para este gestor aparecerán aquí cuando sean publicados."
        primaryHref={`/${manager}`}
        primaryLabel="Volver al inicio"
        secondaryHref={`/${manager}/contacto`}
        secondaryLabel="Contactar al gestor"
      />
    );
  }

  return (
    <main
      id="productos"
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
    >
      <ServiciosPageHeader
        manager={manager}
        title="Productos"
        description="Consulte los productos catastrales disponibles para este gestor."
      />
      <ServiciosContent items={items} />
    </main>
  );
}

export default async function ProductosPage({ params }: Props) {
  const { manager } = await params;
  return (
    <Suspense fallback={<ServiciosSkeleton />}>
      <ProductosContent manager={manager} />
    </Suspense>
  );
}
