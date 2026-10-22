"use client";

import { CheckCircle, SearchX } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNewsletterSubscription } from "@/hooks/use-newsletter-subscription";

function NewsletterIllustration() {
  return (
    <div className="pointer-events-none absolute right-2 top-0 hidden h-full select-none items-center pr-4 md:flex">
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="envBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.85" />
            <stop
              offset="100%"
              style={{ stopColor: "var(--brand-primary)" }}
              stopOpacity="0.5"
            />
          </linearGradient>
          <linearGradient id="docGrad" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.95" />
            <stop
              offset="100%"
              style={{ stopColor: "var(--brand-accent)" }}
              stopOpacity="0.7"
            />
          </linearGradient>
          <linearGradient id="flapL" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.7" />
            <stop
              offset="100%"
              style={{ stopColor: "var(--brand-primary)" }}
              stopOpacity="0.3"
            />
          </linearGradient>
          <linearGradient id="flapR" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.75" />
            <stop
              offset="100%"
              style={{ stopColor: "var(--brand-primary)" }}
              stopOpacity="0.25"
            />
          </linearGradient>
          <linearGradient id="flapTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop
              offset="100%"
              style={{ stopColor: "var(--brand-primary)" }}
              stopOpacity="0.4"
            />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="2"
              dy="6"
              stdDeviation="8"
              floodOpacity="0.25"
              style={{ floodColor: "var(--brand-primary)" }}
            />
          </filter>
          <filter id="docShadow" x="-20%" y="-30%" width="150%" height="160%">
            <feDropShadow
              dx="1"
              dy="-4"
              stdDeviation="6"
              floodOpacity="0.2"
              style={{ floodColor: "var(--brand-primary)" }}
            />
          </filter>
        </defs>

        <g transform="rotate(-8, 100, 100)">
          <rect
            x="28"
            y="90"
            width="144"
            height="90"
            rx="10"
            fill="url(#envBody)"
            stroke="white"
            strokeWidth="1.5"
            filter="url(#softShadow)"
          />
          <path
            d="M28 90 L100 148 L28 180"
            fill="url(#flapL)"
            stroke="white"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path
            d="M172 90 L100 148 L172 180"
            fill="url(#flapR)"
            stroke="white"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path
            d="M30 92 Q100 58 170 92 L100 136 Z"
            fill="url(#flapTop)"
            stroke="white"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <g filter="url(#docShadow)">
            <rect
              x="68"
              y="28"
              width="64"
              height="82"
              rx="8"
              fill="url(#docGrad)"
              stroke="white"
              strokeWidth="1.5"
            />
            <rect
              x="90"
              y="22"
              width="20"
              height="10"
              rx="5"
              fill="white"
              style={{ stroke: "var(--brand-primary)" }}
              strokeWidth="1.2"
            />
            <rect
              x="95"
              y="18"
              width="10"
              height="8"
              rx="3"
              style={{ fill: "var(--accent)", stroke: "var(--brand-primary)" }}
              strokeWidth="1"
            />
            <rect
              x="78"
              y="50"
              width="44"
              height="5"
              rx="2.5"
              style={{ fill: "var(--brand-primary)" }}
              opacity="0.4"
            />
            <rect
              x="78"
              y="62"
              width="44"
              height="5"
              rx="2.5"
              style={{ fill: "var(--brand-primary)" }}
              opacity="0.4"
            />
            <rect
              x="78"
              y="74"
              width="30"
              height="5"
              rx="2.5"
              style={{ fill: "var(--brand-primary)" }}
              opacity="0.4"
            />
            <rect
              x="68"
              y="28"
              width="20"
              height="82"
              rx="8"
              fill="white"
              opacity="0.15"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function NewsletterIntro() {
  return (
    <div className="flex items-start gap-5">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-accent/80 border border-brand-primary/30">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="text-brand-primary"
        >
          <rect
            x="3"
            y="7"
            width="22"
            height="15"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M3 9.5L14 17L25 9.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <h3 className="text-xl font-semibold leading-tight text-brand-primary md:text-2xl">
          Manténgase actualizado
        </h3>
        <p className="mt-1 max-w-md text-sm leading-relaxed text-brand-foreground">
          Reciba notificaciones de nuevos artículos, resoluciones, edictos y
          eventos de agenda directamente en su correo electrónico.
        </p>
      </div>
    </div>
  );
}

interface NewsletterSectionProps {
  manager: string;
}

export function NewsletterSection({ manager }: NewsletterSectionProps) {
  const subscribeMutation = useNewsletterSubscription();
  const isSubmitting = useRef(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const errorMessage =
    subscribeMutation.error instanceof Error
      ? subscribeMutation.error.message
      : "";

  function handleEmailChange(value: string) {
    if (isSubmitted) {
      setIsSubmitted(false);
    }
    if (subscribeMutation.isError || subscribeMutation.isSuccess) {
      subscribeMutation.reset();
    }
    setEmail(value);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      await subscribeMutation.mutateAsync({ email, managerSlug: manager });
      setIsSubmitted(true);
      setEmail("");
    } catch {
      setIsSubmitted(false);
    } finally {
      isSubmitting.current = false;
    }
  }

  return (
    <section className="relative mt-20 overflow-hidden rounded-2xl p-8 md:p-10 bg-gradient-to-br from-brand-accent via-brand-background/60 to-brand-accent/50">
      <NewsletterIllustration />

      <div className="relative z-10 flex max-w-2xl flex-col gap-5">
        <NewsletterIntro />

        {isSubmitted && (
          <p
            aria-live="polite"
            className="flex items-center gap-2 text-sm font-semibold text-brand-primary"
          >
            <CheckCircle className="size-4" />
            ¡Suscripción registrada!
          </p>
        )}

        {errorMessage && (
          <p
            aria-live="polite"
            className="flex items-center gap-2 text-sm text-brand-destructive"
          >
            <SearchX className="size-4" />
            {errorMessage}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Input
            type="email"
            required
            value={email}
            onChange={(event) => handleEmailChange(event.target.value)}
            disabled={subscribeMutation.isPending}
            placeholder="Su correo electrónico"
            className="flex-1 rounded-full border border-brand-accent bg-brand-background px-5 py-3 text-sm text-brand-foreground placeholder:text-brand-muted-foreground shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <Button
            type="submit"
            disabled={subscribeMutation.isPending || !email}
            className="whitespace-nowrap rounded-full bg-brand-primary px-7 py-3 text-xs font-bold tracking-widest text-brand-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {subscribeMutation.isPending ? "SUSCRIBIENDO..." : "SUSCRIBIRME"}
          </Button>
        </form>

        <p className="mt-1 text-[11px] text-muted-foreground">
          Al suscribirse acepta nuestras{" "}
          <Link
            href={`/${manager}/politicas-privacidad`}
            rel="noopener noreferrer"
            target="_blank"
            className="underline transition-colors hover:text-brand-primary"
          >
            políticas de privacidad
          </Link>{" "}
          y{" "}
          <Link
            href={`/${manager}/condiciones-uso`}
            rel="noopener noreferrer"
            target="_blank"
            className="underline transition-colors hover:text-brand-primary"
          >
            condiciones de uso
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
