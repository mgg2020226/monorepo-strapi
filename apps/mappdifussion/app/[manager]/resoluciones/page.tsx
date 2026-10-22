import ResolucionesTable from "@/components/resoluciones";

export const metadata = {
  title: "Resoluciones | Gestor Catastral",
  description:
    "Consulte las resoluciones catastrales emitidas por la entidad, incluyendo actualizaciones y modificaciones prediales.",
};

interface PageProps {
  params: Promise<{
    manager: string;
  }>;
}

export default async function ResolucionesPage({ params }: PageProps) {
  const { manager } = await params;

  return <ResolucionesTable manager={manager} />;
}
