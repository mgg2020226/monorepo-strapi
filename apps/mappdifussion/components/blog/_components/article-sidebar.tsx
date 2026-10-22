"use client";

import { AlertCircle, CheckCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNewsletterSubscription } from "@/hooks/use-newsletter-subscription";

interface PopularCategory {
  title: string;
  count: number;
  href: string;
}

interface RelatedArticle {
  slug: string;
  title: string;
}

interface Props {
  manager: string;
  popularCategories?: PopularCategory[];
  relatedArticles?: RelatedArticle[];
}

const EMPTY_CATEGORIES: PopularCategory[] = [];
const EMPTY_RELATED: RelatedArticle[] = [];

export function ArticleSidebar({
  manager,
  popularCategories = EMPTY_CATEGORIES,
  relatedArticles = EMPTY_RELATED,
}: Props) {
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
    <aside className="space-y-10 lg:sticky lg:top-20 lg:col-span-4 lg:self-start">
      <Card className="glass-card">
        <div className="flex size-12 items-center justify-center rounded-full bg-brand-accent">
          <Mail className="size-5 text-brand-primary" />
        </div>
        <h3 className="text-xl font-semibold text-brand-primary">
          Boletín Informativo
        </h3>
        <p className="text-sm leading-relaxed text-brand-foreground">
          Suscríbete para recibir notificaciones de artículos, resoluciones,
          edictos y eventos de agenda.
        </p>

        {isSubmitted && (
          <p
            aria-live="polite"
            className="flex items-center gap-2 text-sm font-semibold text-brand-success"
          >
            <CheckCircle className="size-4" />
            ¡Suscripción registrada!
          </p>
        )}

        {errorMessage && (
          <p
            aria-live="polite"
            className="flex items-center gap-2 text-xs text-brand-destructive"
          >
            <AlertCircle className="size-4" />
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            required
            value={email}
            onChange={(event) => handleEmailChange(event.target.value)}
            disabled={subscribeMutation.isPending}
            placeholder="tu@correo.com"
            className="w-full rounded-md border border-brand-input px-4 py-2 text-sm outline-none focus:border-brand-primary focus:ring-brand-primary"
          />
          <Button
            type="submit"
            disabled={subscribeMutation.isPending || !email}
            className="w-full rounded-full bg-brand-primary py-2.5 text-xs font-bold text-brand-primary-foreground shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {subscribeMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                SUSCRIBIENDO&hellip;
              </>
            ) : (
              "SUSCRIBIRME"
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-[10px] text-brand-muted-foreground">
          Al registrarte aceptas nuestras{" "}
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
      </Card>

      {relatedArticles.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-brand-primary">
            <span className="h-6 w-1 rounded-full bg-brand-primary" />
            Artículos recomendados
          </h3>
          <ul className="space-y-1">
            {relatedArticles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/${manager}/articulos/${article.slug}`}
                  className="block rounded-lg px-3 py-2.5 text-sm leading-snug text-brand-foreground transition-colors hover:bg-brand-accent hover:text-brand-primary"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {popularCategories.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-brand-primary">
            <span className="h-6 w-1 rounded-full bg-brand-primary" />
            Categorías Populares
          </h3>
          <div className="space-y-2">
            {popularCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-brand-accent"
              >
                <span className="text-sm font-medium text-brand-foreground group-hover:text-brand-primary">
                  {category.title}
                </span>
                <span className="rounded-full bg-brand-muted px-2 py-0.5 text-xs text-brand-muted-foreground transition-colors group-hover:bg-brand-primary group-hover:text-white">
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
