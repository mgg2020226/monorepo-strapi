import { CheckCircle2, ClipboardCheck, ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ServicioItem } from "@/types/strapi.types";

const BADGE_STYLES: Record<string, string> = {
  green: "bg-brand-success/10 text-brand-success",
  blue: "bg-brand-accent text-brand-primary",
  orange: "bg-brand-warning/10 text-brand-warning",
  gray: "bg-brand-muted text-brand-muted-foreground",
};

const ACCENT_BORDER: Record<string, string> = {
  green: "border-brand-success",
  blue: "border-brand-primary",
  orange: "border-brand-warning",
  gray: "border-brand-muted-foreground",
};

interface Props {
  selected: ServicioItem;
}

export function ServicioDetailCard({ selected }: Props) {
  return (
    <Card className="glass-card p-5 sm:p-8">
      {selected.badge_label && (
        <div className="mb-4">
          <span
            className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${BADGE_STYLES[selected.badge_color ?? "green"]}`}
          >
            {selected.badge_label}
          </span>
        </div>
      )}
      <h1 className="text-2xl sm:text-3xl font-semibold text-brand-primary mb-4 leading-tight">
        {selected.title}
      </h1>
      <p className="text-base text-brand-foreground leading-relaxed ">
        {selected.full_description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {selected.requirements && selected.requirements.length > 0 && (
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-brand-primary uppercase tracking-wide">
              <ClipboardList className="size-5" />
              Requisitos
            </h4>
            <ul className="space-y-3">
              {selected.requirements.map((req) => (
                <li key={req.id} className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-brand-success mt-0.5 shrink-0 fill-brand-success stroke-white" />
                  <span className="text-sm text-brand-foreground">
                    {req.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selected.deliverables && selected.deliverables.length > 0 && (
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-brand-primary uppercase tracking-wide">
              <ClipboardCheck className="size-5" />
              Entregables
            </h4>
            <div className="space-y-4">
              {selected.deliverables.map((del) => (
                <div
                  key={del.id}
                  className={`p-3 bg-brand-muted rounded-lg border-l-4 ${ACCENT_BORDER[del.accent ?? "blue"]}`}
                >
                  <p className="text-[13px] font-semibold text-brand-primary">
                    {del.title}
                  </p>
                  {del.description && (
                    <p className="text-[11px] text-brand-muted-foreground">
                      {del.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
