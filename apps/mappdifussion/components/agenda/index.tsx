import { Suspense } from "react";
import { ManagerBreadcrumb } from "@/components/manager-breadcrumb";
import { getAgendaEvents } from "@/services/agenda.service";
import { AgendaLayout } from "./_components/agenda-layout";
import { AgendaSkeleton } from "./skeleton";

interface AgendaPageProps {
  manager: string;
}

async function AgendaContent({ manager }: AgendaPageProps) {
  const events = await getAgendaEvents(manager);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter((e) => {
    const [y, m, d] = e.date.split("-").map(Number);
    return new Date(y, m - 1, d) >= today;
  });

  const featured =
    upcomingEvents.find((e) => e.is_featured) || upcomingEvents[0] || null;

  return (
    <main id="agenda" className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
      <ManagerBreadcrumb manager={manager} current="Agenda" tone="brand" />

      <div className="mb-10">
        <h1 className="font-montserrat text-4xl font-semibold text-brand-primary mb-2">
          Agenda
        </h1>
        <p className="text-brand-foreground max-w-2xl">
          Calendario oficial de eventos técnicos, académicos y jornadas de
          atención al ciudadano del Gestor Catastral.
        </p>
      </div>

      <AgendaLayout events={events} featured={featured} manager={manager} />
    </main>
  );
}

export default function AgendaPage({ manager }: AgendaPageProps) {
  return (
    <Suspense fallback={<AgendaSkeleton />}>
      <AgendaContent manager={manager} />
    </Suspense>
  );
}
