import AgendaEventDetailPage from "@/components/agenda/event-detail";

export const metadata = {
  title: "Evento | Gestor Catastral",
  description:
    "Detalle del evento catastral: fecha, lugar y descripción de la actividad programada.",
};

interface PageProps {
  params: Promise<{ manager: string; slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { manager, slug } = await params;
  return <AgendaEventDetailPage manager={manager} documentId={slug} />;
}
