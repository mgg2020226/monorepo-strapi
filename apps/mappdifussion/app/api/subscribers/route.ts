import { NextResponse } from "next/server";
import { subscribeEmail } from "@/services/subscriber.service";

interface SubscribePayload {
  email: string;
  managerSlug: string;
}

function isSubscribePayload(value: unknown): value is SubscribePayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<SubscribePayload>;

  return (
    typeof payload.email === "string" && typeof payload.managerSlug === "string"
  );
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Solicitud invalida." },
      { status: 400 },
    );
  }

  if (!isSubscribePayload(payload)) {
    return NextResponse.json(
      { ok: false, error: "Datos de suscripcion invalidos." },
      { status: 400 },
    );
  }

  const email = payload.email.trim();
  const managerSlug = payload.managerSlug.trim();

  if (!email || !managerSlug) {
    return NextResponse.json(
      { ok: false, error: "Correo y gestor son requeridos." },
      { status: 400 },
    );
  }

  const result = await subscribeEmail(email, managerSlug);

  return NextResponse.json(result, {
    status: result.ok ? 200 : 400,
  });
}
