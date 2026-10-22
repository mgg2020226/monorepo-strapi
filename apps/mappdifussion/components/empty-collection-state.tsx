import { FileSearch } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyCollectionStateProps {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function EmptyCollectionState({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: EmptyCollectionStateProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-3xl border border-brand-accent bg-brand-card/80 px-8 py-12 text-center shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-accent text-brand-primary">
          <FileSearch className="size-8" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-brand-primary">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-brand-muted-foreground">
          {description}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={primaryHref}>
            <Button className="rounded-full bg-brand-primary px-6 text-brand-primary-foreground hover:opacity-90">
              {primaryLabel}
            </Button>
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link href={secondaryHref}>
              <Button
                variant="outline"
                className="rounded-full border-brand-primary px-6 text-brand-primary hover:bg-brand-accent"
              >
                {secondaryLabel}
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
