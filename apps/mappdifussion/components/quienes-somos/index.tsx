import { Suspense } from "react";
import { ManagerBreadcrumb } from "@/components/manager-breadcrumb";
import { MissingDataAlert } from "@/components/missing-data-alert";
import { getAboutPage } from "@/services/about.service";
import { Identity } from "./_components/identity";
import { Representative } from "./_components/representative";
import Teams from "./_components/team";
import { QuienesSomosSkeleton } from "./skeleton";

interface QuienesSomosPageProps {
  manager: string;
}

async function QuienesSomosContent({ manager }: QuienesSomosPageProps) {
  const data = await getAboutPage(manager);

  if (!data) {
    return (
      <MissingDataAlert
        title="Página no configurada"
        description="La página de ¿Quiénes Somos? no está disponible. Crea el contenido en el CMS."
        itemType="about-page"
      />
    );
  }

  return (
    <main id="quienes-somos" className="max-w-7xl mx-auto px-6 py-12">
      <ManagerBreadcrumb
        manager={manager}
        current="¿Quiénes Somos?"
        tone="brand"
      />

      <Identity
        title={data.title}
        description={data.description}
        mission={data.mission}
        vision={data.vision}
      />

      {data.lider_institucional && (
        <Representative lider={data.lider_institucional} />
      )}

      {data.team_members && data.team_members.length > 0 && (
        <section className="mb-20">
          <Teams member={data.team_members} />
        </section>
      )}
    </main>
  );
}

export default function QuienesSomosPage({ manager }: QuienesSomosPageProps) {
  return (
    <Suspense fallback={<QuienesSomosSkeleton />}>
      <QuienesSomosContent manager={manager} />
    </Suspense>
  );
}
