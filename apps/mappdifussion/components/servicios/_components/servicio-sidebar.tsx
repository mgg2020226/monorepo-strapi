import { CheckCircle2, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { ServicioItem } from "@/types/strapi.types";

interface Props {
  selected: ServicioItem;
}

export function ServicioSidebar({ selected }: Props) {
  const hasMap = selected.map_address || selected.map_city;

  return (
    <div className="space-y-6">
      {selected.estimated_days && (
        <Card className="card-hero overflow-hidden relative">
          <CardContent className="p-0 relative z-10">
            <div className="flex items-center gap-2 mb-5">
              <div className="size-7 rounded-full bg-white/20 flex items-center justify-center">
                <Clock className="size-4 text-white" />
              </div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/80">
                Tiempo Estimado
              </h4>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-5xl font-extrabold tabular-nums leading-none">
                {selected.estimated_days}
              </span>
              <span className="text-base font-semibold text-white/80">
                días hábiles
              </span>
            </div>

            {selected.estimated_note && (
              <p className="text-[11px] text-white/60 mt-2 mb-5 italic leading-relaxed">
                {selected.estimated_note}
              </p>
            )}

            {!selected.estimated_note && <div className="mb-5" />}

            {selected.action_label && (
              <Link
                href={selected.action_url ?? "#"}
                target={selected.action_url ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-white/95 text-brand-primary font-bold py-2.5 rounded-xl hover:bg-white transition-colors text-xs tracking-widest uppercase"
              >
                <CheckCircle2 className="size-4 shrink-0" />
                {selected.action_label}
              </Link>
            )}
          </CardContent>
          <Clock className="absolute -right-8 -bottom-8 size-40 opacity-[0.07]" />
        </Card>
      )}

      {hasMap && (
        <Card className="p-0 glass-panel overflow-hidden">
          <CardContent className="p-0">
            <iframe
              title="Ubicación"
              width="100%"
              height="220"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                [selected.map_address, selected.map_city]
                  .filter(Boolean)
                  .join(", "),
              )}&output=embed&z=16`}
            />
            {selected.map_url && (
              <Link
                href={selected.map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-white border-t border-brand-accent hover:bg-brand-accent transition-colors"
              >
                <MapPin className="size-4 text-brand-primary shrink-0" />
                <span className="text-xs font-bold font-montserrat text-brand-primary">
                  {[selected.map_address, selected.map_city]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
