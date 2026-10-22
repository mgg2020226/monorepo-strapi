import {
  type BlocksContent,
  BlocksRenderer,
} from "@strapi/blocks-react-renderer";
import { Shield } from "lucide-react";
import { Suspense } from "react";
import { MissingDataAlert } from "@/components/missing-data-alert";
import { getPrivacyPoliciesPage } from "@/services/privacy-policies-page.service";
import { PoliticasPrivacidadSkeleton } from "./skeleton";

async function PoliticasPrivacidadContent({ manager }: { manager: string }) {
  const data = await getPrivacyPoliciesPage(manager);

  if (!data) {
    return (
      <MissingDataAlert
        title="Políticas de Privacidad no configuradas"
        description="El contenido de las políticas de privacidad no está disponible. Por favor, crea el contenido de la página en el CMS para que se pueda visualizar correctamente."
        itemType="privacy-policies-pages"
      />
    );
  }

  return (
    <div className="min-h-screen bg-brand-muted/30">
      {/* ── Hero de cabecera ─────────────────────────────── */}
      <div className="bg-brand-card border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-6 py-14 text-center">
          <div className="inline-flex items-center justify-center size-14 rounded-full bg-brand-primary/10 mb-5">
            <Shield className="size-7 text-brand-primary" />
          </div>
          <h1 className="text-4xl font-semibold text-brand-foreground mb-3">
            {data.title}
          </h1>
          <p className="text-brand-muted-foreground text-sm">
            Vigente a partir de su publicación en este portal
          </p>
        </div>
      </div>

      {/* ── Contenido ────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div
          className="rich-content bg-brand-card rounded-xl border border-brand-border shadow-sm p-8 md:p-12
          prose prose-slate max-w-none
          prose-headings:text-brand-foreground prose-headings:font-semibold
          prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3 prose-h2:pb-2 prose-h2:border-b prose-h2:border-brand-border
          prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-brand-muted-foreground prose-p:leading-relaxed prose-p:my-3
          prose-strong:text-brand-foreground prose-strong:font-semibold
          prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline
          prose-ul:my-3 prose-li:text-brand-muted-foreground prose-li:my-1
          prose-ol:my-3
          prose-blockquote:text-brand-muted-foreground prose-blockquote:border-brand-primary prose-blockquote:bg-brand-muted/50 prose-blockquote:rounded-r-lg prose-blockquote:py-1
          prose-code:text-brand-foreground prose-code:bg-brand-muted prose-code:px-1 prose-code:rounded
        "
        >
          <BlocksRenderer content={data.content as BlocksContent} />
        </div>

        {/* ── Pie de página del documento ──────────────── */}
        <p className="text-center text-xs text-brand-muted-foreground mt-8">
          Para dudas o solicitudes escríbenos a través del correo institucional.
        </p>
      </div>
    </div>
  );
}

export default function PoliticasPrivacidadComponent({
  manager,
}: {
  manager: string;
}) {
  return (
    <Suspense fallback={<PoliticasPrivacidadSkeleton />}>
      <PoliticasPrivacidadContent manager={manager} />
    </Suspense>
  );
}
