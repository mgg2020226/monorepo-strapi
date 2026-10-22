import { CheckCircle, XCircle } from "lucide-react";

export const metadata = {
  title: "Cancelar suscripción | Gestor Catastral",
  description:
    "Gestione su suscripción a las notificaciones del portal catastral.",
};

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { unsubscribeByToken } from "@/services/subscriber.service";

interface Props {
  params: Promise<{ manager: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function UnsubscribePage({ params, searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    const { manager } = await params;
    return (
      <main className="min-h-screen flex items-center justify-center bg-brand-accent/50 px-4">
        <Card className="max-w-md w-full bg-card rounded-2xl shadow-sm border border-accent p-10 text-center">
          <XCircle className="size-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-foreground mb-2">
            Enlace inválido
          </h1>
          <p className="text-sm text-foreground mb-6">
            No se encontró un token de cancelación. Usa el enlace enviado en el
            correo de suscripción.
          </p>
          <Link
            href={`/${manager}`}
            className="text-brand-primary text-sm underline hover:text-brand-primary"
          >
            Volver al inicio
          </Link>
        </Card>
      </main>
    );
  }

  const [{ manager }, result] = await Promise.all([
    params,
    unsubscribeByToken(token),
  ]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-accent/50 px-4">
      <Card className="max-w-md w-full bg-card rounded-2xl shadow-sm border border-accent p-10 text-center">
        {result.ok ? (
          <>
            <CheckCircle className="size-12 text-brand-success mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Cancelación exitosa
            </h1>
            <p className="text-sm text-foreground mb-6">
              Has sido dado de baja del boletín informativo. Ya no recibirás
              correos de esta suscripción.
            </p>
          </>
        ) : (
          <>
            <XCircle className="size-12 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-foreground mb-2">
              No se pudo dar de baja
            </h1>
            <p className="text-sm text-foreground mb-6">
              {result.error || "El token es inválido o ya fue utilizado."}
            </p>
          </>
        )}
        <Link
          href={`/${manager}`}
          className="text-brand-primary text-sm underline hover:text-brand-primary"
        >
          Volver al inicio
        </Link>
      </Card>
    </main>
  );
}
