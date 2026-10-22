"use client";

import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContactSubmission } from "@/hooks/use-contact-submission";

interface ContactFormProps {
  manager: string;
}

const EMPTY = {
  full_name: "",
  email: "",
  phone: "",
  cadastral_code: "",
  message: "",
  accepted: false,
};

export function ContactForm({ manager }: ContactFormProps) {
  const contactMutation = useContactSubmission();
  const [fields, setFields] = useState(EMPTY);
  const consentRef = useRef<HTMLInputElement>(null);
  const submitInFlightRef = useRef(false);

  const mutationError =
    contactMutation.error instanceof Error ? contactMutation.error.message : "";

  const updateField = <K extends keyof typeof EMPTY>(
    key: K,
    value: (typeof EMPTY)[K],
  ) => {
    if (key === "accepted" && consentRef.current) {
      consentRef.current.setCustomValidity("");
    }
    if (contactMutation.isError || contactMutation.isSuccess) {
      contactMutation.reset();
    }
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (submitInFlightRef.current || contactMutation.isPending) return;

    if (!fields.accepted) {
      consentRef.current?.setCustomValidity(
        "Debe aceptar la política de privacidad para continuar.",
      );
      consentRef.current?.reportValidity();
      return;
    }
    consentRef.current?.setCustomValidity("");

    submitInFlightRef.current = true;
    try {
      await contactMutation.mutateAsync({
        full_name: fields.full_name,
        email: fields.email,
        phone: fields.phone || undefined,
        cadastral_code: fields.cadastral_code || undefined,
        message: fields.message,
        accepts_policy: fields.accepted,
        manager_slug: manager,
      });

      setFields(EMPTY);
    } catch {
      // The mutation exposes the error state to the form.
    } finally {
      submitInFlightRef.current = false;
    }
  };

  const inputClass =
    "h-10 w-full rounded-[5px] border border-brand-input px-4 text-[15px] outline-none transition-[border-color,box-shadow] focus:border-brand-primary focus:shadow-[0_4px_0_0_var(--brand-accent)]";
  const labelClass = "text-sm font-medium text-brand-foreground";

  return (
    <div className="rounded-xl border border-brand-accent bg-brand-card p-8 shadow-sm md:p-10">
      <h2 className="mb-2 font-montserrat text-2xl font-semibold text-brand-primary">
        Envíenos un mensaje
      </h2>
      <p className="mb-8 text-sm text-brand-muted-foreground">
        Complete el siguiente formulario y un asesor se pondrá en contacto con
        usted para brindarle la información requerida.
      </p>

      {contactMutation.isSuccess && (
        <div
          aria-live="polite"
          className="mb-6 flex items-start gap-3 rounded-lg border border-brand-success/30 bg-brand-success/10 p-4"
        >
          <CheckCircle className="mt-0.5 size-5 shrink-0 text-brand-success" />
          <div>
            <p className="text-sm font-semibold text-brand-success">
              Mensaje enviado correctamente
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Un asesor se pondrá en contacto con usted en menos de 72 horas
              hábiles.
            </p>
          </div>
        </div>
      )}

      {mutationError && (
        <div
          aria-live="polite"
          className="mb-6 flex items-start gap-3 rounded-lg border border-brand-destructive/30 bg-brand-destructive/10 p-4"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-brand-destructive" />
          <p className="text-sm text-brand-destructive">{mutationError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="cf-full-name" className={labelClass}>
              Nombre Completo <span className="text-brand-primary">*</span>
            </label>
            <Input
              id="cf-full-name"
              required
              type="text"
              className={inputClass}
              placeholder="Ej: Juan Pérez"
              value={fields.full_name}
              onChange={(event) => updateField("full_name", event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="cf-email" className={labelClass}>
              Correo Electrónico <span className="text-brand-primary">*</span>
            </label>
            <Input
              id="cf-email"
              required
              type="email"
              className={inputClass}
              placeholder="ejemplo@correo.com"
              value={fields.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="cf-phone" className={labelClass}>
              Teléfono / Celular
            </label>
            <Input
              id="cf-phone"
              type="tel"
              className={inputClass}
              placeholder="+57 300 000 0000"
              value={fields.phone}
              onChange={(event) => updateField("phone", event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="cf-cadastral-code" className={labelClass}>
              Código Catastral (Si aplica)
            </label>
            <Input
              id="cf-cadastral-code"
              type="text"
              className={inputClass}
              placeholder="Ej: 050001000001"
              value={fields.cadastral_code}
              onChange={(event) =>
                updateField("cadastral_code", event.target.value)
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="cf-message" className={labelClass}>
            Descripción <span className="text-brand-primary">*</span>
          </label>
          <textarea
            id="cf-message"
            required
            className="min-h-[120px] w-full resize-none rounded-[5px] border border-brand-input p-4 text-[15px] outline-none transition-[border-color,box-shadow] focus:border-brand-primary focus:shadow-[0_4px_0_0_var(--brand-accent)]"
            placeholder="Escriba aquí los detalles de su consulta..."
            value={fields.message}
            onChange={(event) => updateField("message", event.target.value)}
          />
        </div>

        <div className="flex items-start gap-3">
          <Input
            ref={consentRef}
            type="checkbox"
            id="terms"
            required
            className="mt-1 size-4 rounded border-brand-input accent-brand-primary"
            checked={fields.accepted}
            onChange={(event) => updateField("accepted", event.target.checked)}
          />
          <label
            htmlFor="terms"
            className="text-xs leading-relaxed text-muted-foreground"
          >
            Acepto el tratamiento de mis datos personales de acuerdo con la{" "}
            <Link
              href={`/${manager}/politicas-privacidad`}
              rel="noopener noreferrer"
              className="font-bold text-brand-primary hover:underline"
            >
              Política de Privacidad
            </Link>{" "}
            de la entidad.
          </label>
        </div>

        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
          <Button
            type="submit"
            disabled={contactMutation.isPending}
            className="flex h-[42px] items-center justify-center gap-2 rounded-full bg-brand-primary px-10 font-medium text-brand-primary-foreground shadow-md transition-opacity hover:opacity-90 disabled:opacity-60 active:opacity-80"
          >
            {contactMutation.isPending && (
              <Loader2 className="size-4 animate-spin" />
            )}
            ENVIAR MENSAJE
          </Button>
          <Button
            type="button"
            onClick={() => {
              setFields(EMPTY);
              consentRef.current?.setCustomValidity("");
              contactMutation.reset();
            }}
            className="h-[42px] rounded-full border-[1.5px] border-brand-primary bg-transparent px-10 font-medium text-brand-primary transition-colors hover:bg-brand-accent"
          >
            LIMPIAR FORMULARIO
          </Button>
        </div>
      </form>
    </div>
  );
}
