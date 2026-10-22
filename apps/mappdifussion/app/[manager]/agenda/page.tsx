import AgendaPage from "@/components/agenda";

export const metadata = {
  title: "Agenda | Gestor Catastral",
  description:
    "Infórmese sobre los eventos de actualización catastral, normatividad vigente, capacitaciones, charlas y trámites ciudadanos.",
};

interface PageProps {
  params: Promise<{ manager: string }>;
}

export default async function Page({ params }: PageProps) {
  const { manager } = await params;
  return <AgendaPage manager={manager} />;
}
