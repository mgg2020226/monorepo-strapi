import { NextResponse } from "next/server";
import type { ContactSubmission } from "@/services/contact.service";
import { submitContactForm } from "@/services/contact-submission.service";

function isContactSubmission(value: unknown): value is ContactSubmission {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<ContactSubmission>;

  return (
    typeof payload.full_name === "string" &&
    typeof payload.email === "string" &&
    typeof payload.message === "string" &&
    typeof payload.accepts_policy === "boolean" &&
    typeof payload.manager_slug === "string"
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

  if (!isContactSubmission(payload)) {
    return NextResponse.json(
      { ok: false, error: "Datos de contacto invalidos." },
      { status: 400 },
    );
  }

  if (!payload.accepts_policy) {
    return NextResponse.json(
      { ok: false, error: "Debe aceptar la politica de privacidad." },
      { status: 400 },
    );
  }

  const result = await submitContactForm(payload);

  return NextResponse.json(result, {
    status: result.ok ? 200 : 400,
  });
}
