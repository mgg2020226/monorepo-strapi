"use client";

import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import type { AgendaEvent } from "@/services/agenda.service";
import "./agenda-calendar.css";

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function buildFcColors(): Record<
  string,
  { background: string; border: string; text: string }
> {
  const brandPrimary = cssVar("--brand-primary");
  const primary = cssVar("--primary");
  const accent = cssVar("--accent");
  const primaryForeground = cssVar("--primary-foreground");
  const brandWarning = cssVar("--brand-warning");
  const brandSuccess = cssVar("--brand-success");
  return {
    tecnico: { background: accent, border: primary, text: primary },
    academico: {
      background: `color-mix(in oklch, ${brandWarning} 12%, white)`,
      border: brandWarning,
      text: brandWarning,
    },
    internacional: {
      background: brandPrimary,
      border: brandPrimary,
      text: primaryForeground,
    },
    operacional: { background: accent, border: primary, text: primary },
    civico: {
      background: `color-mix(in oklch, ${brandSuccess} 10%, white)`,
      border: brandSuccess,
      text: brandSuccess,
    },
    jornada: {
      background: `color-mix(in oklch, ${brandSuccess} 10%, white)`,
      border: brandSuccess,
      text: brandSuccess,
    },
    ciudadano: {
      background: `color-mix(in oklch, ${cssVar("--brand-info")} 10%, white)`,
      border: cssVar("--brand-info"),
      text: cssVar("--brand-info"),
    },
  };
}

function toFcEvents(
  events: AgendaEvent[],
  manager: string,
  fcColors: ReturnType<typeof buildFcColors>,
) {
  return events.map((ev) => {
    const colors = ev.event_type
      ? (fcColors[ev.event_type] ?? fcColors.tecnico)
      : fcColors.tecnico;
    return {
      id: String(ev.id),
      title: ev.title,
      date: ev.date.slice(0, 10),
      url: `/${manager}/agenda/${ev.documentId}`,
      backgroundColor: colors.background,
      borderColor: colors.border,
      textColor: colors.text,
      extendedProps: { event_type: ev.event_type },
    };
  });
}

interface AgendaCalendarProps {
  events: AgendaEvent[];
  manager: string;
}

export function AgendaCalendar({ events, manager }: AgendaCalendarProps) {
  const { push } = useRouter();
  const fcColors = useMemo(() => buildFcColors(), []);
  const fcEvents = toFcEvents(events, manager, fcColors);

  return (
    <section className="agenda-fullcalendar">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={esLocale}
        events={fcEvents}
        headerToolbar={{
          left: "title",
          center: "",
          right: "prev,today,next",
        }}
        buttonText={{ today: "Hoy" }}
        eventClick={(info) => {
          info.jsEvent.preventDefault();
          if (info.event.url) {
            push(info.event.url);
          }
        }}
        eventDisplay="block"
        dayMaxEvents={2}
        height="auto"
        fixedWeekCount={false}
        showNonCurrentDates={false}
      />
    </section>
  );
}
