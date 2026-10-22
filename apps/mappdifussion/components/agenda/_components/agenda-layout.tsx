"use client";

import type { LucideIcon } from "lucide-react";
import {
  CalendarClock,
  CalendarDays,
  Clock,
  Info,
  MapPin,
  Video,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { AgendaEvent } from "@/services/agenda.service";
import { EVENT_TYPE_META } from "@/services/agenda.service";
import { CalendarSkeleton } from "../skeleton";

const AgendaCalendar = dynamic(
  () => import("./agenda-calendar").then((m) => m.AgendaCalendar),
  { ssr: false, loading: () => <CalendarSkeleton /> },
);

// ── Helpers ───────────────────────────────────────────────────────────────────

const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const MONTHS_ES_SHORT = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// ── Featured Event ─────────────────────────────────────────────────────────────

function FeaturedEvent({
  event,
  manager,
}: {
  event: AgendaEvent;
  manager: string;
}) {
  const date = parseLocalDate(event.date);
  const day = date.getDate();
  const month = MONTHS_ES[date.getMonth()];

  return (
    <section className="card-hero relative overflow-hidden p-8 text-white">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br from-white/20 to-transparent" />
      <div className="relative z-10 grid md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2">
          <span className="inline-block bg-brand-primary text-brand-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
            Evento Destacado
          </span>
          <h2 className="font-montserrat text-2xl md:text-3xl font-semibold mb-3 leading-tight">
            {event.title}
          </h2>
          {event.description && (
            <p className="text-white/80 mb-6 text-sm leading-relaxed line-clamp-3">
              {event.description}
            </p>
          )}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg border border-white/20">
              <CalendarDays className="size-4" />
              <span className="text-xs font-medium">
                {day} de {month}, {date.getFullYear()}
              </span>
            </div>
            {event.start_time && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg border border-white/20">
                <Clock className="size-4" />
                <span className="text-xs font-medium">
                  {event.start_time}
                  {event.end_time ? ` - ${event.end_time}` : ""}
                </span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg border border-white/20">
                <MapPin className="size-4" />
                <span className="text-xs font-medium">{event.location}</span>
              </div>
            )}
          </div>
          <Link
            href={
              event.registration_url || `/${manager}/agenda/${event.documentId}`
            }
            className="bg-brand-card text-brand-primary font-bold px-8 py-3 rounded-full hover:bg-brand-accent transition-colors text-sm tracking-wide inline-block"
          >
            PARTICIPAR
          </Link>
        </div>
        <div className="hidden md:flex justify-end">
          <div className="size-32 rounded-2xl bg-white/10 backdrop-blur-md flex flex-col items-center justify-center border border-white/30">
            <span className="text-5xl font-bold">{day}</span>
            <span className="text-xs uppercase tracking-widest mt-1">
              {MONTHS_ES_SHORT[date.getMonth()]}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Upcoming Events Sidebar ────────────────────────────────────────────────────

function locationIcon(location?: string): LucideIcon {
  if (!location) return MapPin;
  const lower = location.toLowerCase();
  const virtualKeywords = ["virtual", "online", "microsoft teams", "zoom"];
  if (virtualKeywords.some((k) => lower.includes(k))) return Video;
  return MapPin;
}

function UpcomingEvents({
  events,
  manager,
}: {
  events: AgendaEvent[];
  manager: string;
}) {
  const upcoming = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events.filter((e) => parseLocalDate(e.date) >= today).slice(0, 6);
  }, [events]);

  return (
    <Card className="glass-card gap-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-montserrat font-semibold text-brand-primary flex items-center gap-2">
          <CalendarClock className="size-5" />
          Próximos Eventos
        </h3>
        <span className="text-brand-primary text-xs font-semibold">
          Ver todos
        </span>
      </div>

      {upcoming.length === 0 ? (
        <div className="flex items-center gap-4 py-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 80 80"
            className="size-16 shrink-0 opacity-30"
            aria-hidden="true"
          >
            <rect
              x="8"
              y="16"
              width="64"
              height="56"
              rx="8"
              style={{ fill: "var(--accent)" }}
            />
            <rect
              x="8"
              y="16"
              width="64"
              height="18"
              rx="8"
              style={{ fill: "color-mix(in oklch, var(--primary) 55%, white)" }}
            />
            <rect
              x="8"
              y="26"
              width="64"
              height="8"
              style={{ fill: "color-mix(in oklch, var(--primary) 55%, white)" }}
            />
            <rect
              x="20"
              y="42"
              width="12"
              height="10"
              rx="2.5"
              style={{ fill: "color-mix(in oklch, var(--primary) 55%, white)" }}
            />
            <rect
              x="34"
              y="42"
              width="12"
              height="10"
              rx="2.5"
              style={{ fill: "color-mix(in oklch, var(--primary) 55%, white)" }}
            />
            <rect
              x="48"
              y="42"
              width="12"
              height="10"
              rx="2.5"
              style={{ fill: "color-mix(in oklch, var(--primary) 55%, white)" }}
            />
            <rect
              x="20"
              y="55"
              width="12"
              height="10"
              rx="2.5"
              style={{ fill: "color-mix(in oklch, var(--primary) 55%, white)" }}
            />
            <rect
              x="34"
              y="55"
              width="12"
              height="10"
              rx="2.5"
              style={{ fill: "color-mix(in oklch, var(--primary) 55%, white)" }}
            />
            <circle
              cx="26"
              cy="13"
              r="5"
              style={{ fill: "var(--brand-primary)" }}
            />
            <circle
              cx="54"
              cy="13"
              r="5"
              style={{ fill: "var(--brand-primary)" }}
            />
            <rect
              x="24"
              y="8"
              width="4"
              height="10"
              rx="2"
              style={{ fill: "var(--brand-primary)" }}
            />
            <rect
              x="52"
              y="8"
              width="4"
              height="10"
              rx="2"
              style={{ fill: "var(--brand-primary)" }}
            />
          </svg>
          <p className="text-sm text-brand-muted-foreground">
            Sin próximos eventos.
          </p>
        </div>
      ) : (
        <CardContent className="px-0 pt-0 space-y-6">
          {upcoming.map((ev) => {
            const date = parseLocalDate(ev.date);
            const meta = ev.event_type ? EVENT_TYPE_META[ev.event_type] : null;
            const LocIcon = locationIcon(ev.location);
            return (
              <Link
                key={ev.id}
                href={`/${manager}/agenda/${ev.documentId}`}
                className="flex gap-4 group cursor-pointer"
              >
                <div className="flex-shrink-0 w-12 h-14 bg-brand-muted rounded-lg flex flex-col items-center justify-center border border-brand-border group-hover:border-brand-primary transition-colors">
                  <span className="text-xs font-bold text-brand-primary uppercase">
                    {MONTHS_ES_SHORT[date.getMonth()]}
                  </span>
                  <span className="text-xl font-bold text-brand-foreground">
                    {String(date.getDate()).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex-grow min-w-0">
                  {meta && (
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${meta.color}`}
                    >
                      {meta.label}
                    </span>
                  )}
                  <h4 className="text-sm font-semibold text-brand-foreground line-clamp-1 group-hover:text-brand-primary transition-colors">
                    {ev.title}
                  </h4>
                  {ev.location && (
                    <p className="text-xs text-brand-foreground flex items-center gap-1 mt-1">
                      <LocIcon className="size-3 shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
}

// ── Main Layout ────────────────────────────────────────────────────────────────

interface AgendaLayoutProps {
  events: AgendaEvent[];
  featured: AgendaEvent | null;
  manager: string;
}

export function AgendaLayout({ events, featured, manager }: AgendaLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left: Featured + Calendar */}
      <div className="lg:col-span-8 space-y-8">
        {featured && <FeaturedEvent event={featured} manager={manager} />}
        <AgendaCalendar events={events} manager={manager} />
      </div>

      {/* Right: Sidebar */}
      <aside className="lg:col-span-4 space-y-6">
        <UpcomingEvents events={events} manager={manager} />
        <Card className="glass-card gap-0">
          <Info className="size-5 text-brand-primary mb-2" />
          <h5 className="font-montserrat font-semibold text-brand-primary mb-2 text-sm">
            ¿Necesitas ayuda con un trámite?
          </h5>
          <p className="text-xs text-brand-primary/80 leading-relaxed mb-4">
            Recuerda que puedes presentarte en nuestras oficinas o asistir a las
            jornadas móviles territoriales.
          </p>
        </Card>
      </aside>
    </div>
  );
}
