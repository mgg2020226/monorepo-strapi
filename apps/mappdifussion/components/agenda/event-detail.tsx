import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  CalendarCheck,
  Clock,
  Coffee,
  ExternalLink,
  FileText,
  Flag,
  Info,
  Laptop,
  Lock,
  LogIn,
  MapPin,
  Mic,
  Radio,
  User,
  Users,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import {
  EVENT_TYPE_META,
  type EventModality,
  getAgendaEventByDocumentId,
} from "@/services/agenda.service";
import { EventDetailSkeleton } from "./skeleton";

interface Props {
  manager: string;
  documentId: string;
}

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

function parseLocalDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const MODALITY_META: Record<
  EventModality,
  { label: string; icon: LucideIcon; color: string }
> = {
  presential: {
    label: "Presencial",
    icon: Building2,
    color: "text-brand-primary bg-brand-card border border-brand-primary/30",
  },
  virtual: {
    label: "Virtual",
    icon: Video,
    color: "text-brand-primary bg-brand-card border border-brand-primary/30",
  },
  hybrid: {
    label: "Modalidad Híbrida",
    icon: Radio,
    color: "text-brand-success bg-card border border-brand-success/30",
  },
};

const TIMELINE_ICONS: LucideIcon[] = [LogIn, Mic, Coffee, Laptop, Users, Flag];

function getEventDescriptionParagraphs(event: EventData) {
  const content = event.full_description || event.description || "";
  const paragraphs: string[] = [];

  for (const line of content.split("\n")) {
    const paragraph = line.trim();
    if (paragraph) {
      paragraphs.push(paragraph);
    }
  }

  return paragraphs;
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface EventData {
  title: string;
  imageUrl?: string;
  event_type?: string;
  category?: string;
  date: string;
  start_time?: string;
  end_time?: string;
  modality?: EventModality;
  full_description?: string;
  description?: string;
  registration_url?: string;
  agenda_items?: Array<{
    id: string | number;
    start_time?: string;
    end_time?: string;
    title: string;
    description?: string;
  }>;
  location?: string;
  conferencistas?: Array<{
    id: string | number;
    name: string;
    photoUrl?: string;
    position?: string;
    description?: string;
  }>;
  recursos?: Array<{
    id: string | number;
    title: string;
    url?: string;
    locked?: boolean;
  }>;
}

interface HeroProps {
  event: EventData;
  typeMeta: { label: string } | null;
  modalityMeta: { label: string; icon: LucideIcon; color: string } | null;
  day: number;
  month: string;
  year: number;
  manager: string;
}

function EventHero({
  event,
  typeMeta,
  modalityMeta,
  day,
  month,
  year,
  manager,
}: HeroProps) {
  return (
    <section className="relative bg-brand-primary text-white py-16 px-6 overflow-hidden">
      {event.imageUrl && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
      {!event.imageUrl && (
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br from-white/30 to-transparent" />
      )}
      <div className="max-w-7xl mx-auto relative z-10">
        <Breadcrumb className="flex items-center gap-2 text-sm text-brand-muted-foreground mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-bold text-white"
                href={`/${manager}/agenda`}
              >
                Eventos
              </BreadcrumbLink>
            </BreadcrumbItem>
            {(typeMeta || event.category) && (
              <>
                <BreadcrumbSeparator className="text-bold text-white" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-bold text-white">
                    {typeMeta ? typeMeta.label : event.category}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-4xl md:text-5xl font-semibold font-montserrat mb-8 leading-tight max-w-3xl">
          {event.title}
        </h1>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/20">
            <Calendar className="size-4" />
            <span className="text-sm font-medium">
              {day} de {month}, {year}
            </span>
          </div>
          {(event.start_time || event.end_time) && (
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/20">
              <Clock className="size-4" />
              <span className="text-sm font-medium">
                {event.start_time}
                {event.end_time ? ` - ${event.end_time}` : ""}
              </span>
            </div>
          )}
          {modalityMeta && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${modalityMeta.color}`}
            >
              <modalityMeta.icon className="size-4" />
              <span className="text-sm font-bold uppercase tracking-wider">
                {modalityMeta.label}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function AgendaTimeline({
  items,
}: {
  items: NonNullable<EventData["agenda_items"]>;
}) {
  return (
    <Card className="glass-card p-8 gap-0">
      <h2 className="text-2xl font-semibold font-montserrat text-brand-primary mb-8 flex items-center gap-3">
        <span className="size-8 rounded bg-brand-accent flex items-center justify-center shrink-0">
          <CalendarCheck className="size-5 text-brand-primary" />
        </span>
        Agenda del Día
      </h2>
      <CardContent className="px-0 pt-0 relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-accent">
        {items.map((item, i) => {
          const isFirst = i === 0;
          const IconComponent = TIMELINE_ICONS[i % TIMELINE_ICONS.length];
          return (
            <div
              key={item.id}
              className="relative pl-12 rounded-xl px-3 py-2 -mx-3 hover:bg-brand-accent transition-colors duration-200"
            >
              <div
                className={`absolute left-0 top-1 size-10 rounded-full flex items-center justify-center z-10 ${
                  isFirst
                    ? "bg-brand-primary text-brand-primary-foreground border-4 border-brand-card"
                    : "bg-brand-card border-2 border-brand-accent text-brand-primary"
                }`}
              >
                <IconComponent className="size-4" />
              </div>
              <div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${isFirst ? "text-brand-primary" : "text-brand-muted-foreground"}`}
                >
                  {item.start_time}
                  {item.end_time ? ` - ${item.end_time}` : ""}
                </span>
                <h3 className="text-lg font-semibold font-montserrat text-brand-primary mt-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-brand-foreground mt-2">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function EventLocation({ location }: { location: string }) {
  const isUrl = location.startsWith("http");
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed&z=16`;
  const linkHref = isUrl
    ? location
    : `https://maps.google.com/maps?q=${encodeURIComponent(location)}`;
  const label = isUrl ? "Ver en Google Maps" : location;

  return (
    <Card className="glass-panel overflow-hidden p-0 gap-0">
      <div className="px-8 pt-8 pb-4">
        <h2 className="text-2xl font-semibold font-montserrat text-brand-primary mb-2 flex items-center gap-3">
          <span className="size-8 rounded bg-brand-accent flex items-center justify-center shrink-0">
            <MapPin className="size-5 text-brand-primary" />
          </span>
          Ubicación del Evento
        </h2>
        {!isUrl && <p className="text-sm text-brand-foreground">{location}</p>}
      </div>
      <CardContent className="p-0">
        <iframe
          title="Ubicación del evento"
          src={embedSrc}
          width="100%"
          height="320"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts"
        />
        <Link
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-8 py-3 border-t border-brand-accent hover:bg-brand-accent transition-colors"
        >
          <MapPin className="size-4 text-brand-primary shrink-0" />
          <span className="text-sm font-medium text-brand-primary">
            {label}
          </span>
        </Link>
      </CardContent>
    </Card>
  );
}

interface SidebarProps {
  conferencistas?: EventData["conferencistas"];
  recursos?: EventData["recursos"];
}

function EventSidebar({ conferencistas, recursos }: SidebarProps) {
  return (
    <div className="lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-20 lg:self-start">
      {conferencistas && conferencistas.length > 0 && (
        <Card className="glass-card gap-0">
          <h2 className="text-xl font-semibold font-montserrat text-brand-primary mb-6">
            Conferencistas
          </h2>
          <CardContent className="px-0 pt-0 space-y-6">
            {conferencistas.map((speaker, i) => (
              <div key={speaker.id}>
                {i > 0 && <hr className="border-brand-accent mb-6" />}
                <div className="flex gap-4 items-center">
                  <div className="size-16 rounded-full overflow-hidden border-2 border-brand-accent shrink-0 bg-brand-accent flex items-center justify-center">
                    {speaker.photoUrl ? (
                      <Image
                        src={speaker.photoUrl}
                        alt={speaker.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="size-8 text-brand-primary/40" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-primary leading-tight">
                      {speaker.name}
                    </h4>
                    {speaker.position && (
                      <p className="text-xs text-brand-primary font-medium mb-1">
                        {speaker.position}
                      </p>
                    )}
                    {speaker.description && (
                      <p className="text-xs text-brand-foreground">
                        {speaker.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {recursos && recursos.length > 0 && (
        <Card className="glass-card gap-0">
          <h3 className="text-xl font-semibold font-montserrat text-brand-primary mb-6 flex items-center gap-2">
            <span className="size-8 rounded bg-brand-accent flex items-center justify-center shrink-0">
              <BookOpen className="size-5 text-brand-primary" />
            </span>
            Recursos del evento
          </h3>
          <ul className="space-y-2">
            {recursos.map((r) => (
              <li key={r.id}>
                {r.locked || !r.url ? (
                  <Card className="flex flex-row items-center gap-3 p-3 rounded-lg border border-brand-border bg-brand-muted opacity-60 cursor-not-allowed">
                    <div className="size-8 rounded bg-brand-accent/50 flex items-center justify-center shrink-0">
                      <FileText className="size-4 text-brand-primary/50" />
                    </div>
                    <span className="text-sm text-brand-foreground flex-1 line-clamp-1">
                      {r.title}
                    </span>
                    <Lock className="size-4 text-brand-muted-foreground shrink-0" />
                  </Card>
                ) : (
                  <Link
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-brand-border hover:border-brand-primary bg-brand-background hover:bg-brand-accent transition-colors group"
                  >
                    <div className="size-8 rounded bg-brand-accent group-hover:bg-brand-primary flex items-center justify-center shrink-0 transition-colors">
                      <FileText className="size-4 text-brand-primary group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-brand-foreground group-hover:text-brand-primary flex-1 line-clamp-1 transition-colors">
                      {r.title}
                    </span>
                    <ExternalLink className="size-4 text-brand-muted-foreground group-hover:text-brand-primary shrink-0 transition-colors" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

async function AgendaEventDetailContent({ manager, documentId }: Props) {
  const event = await getAgendaEventByDocumentId(documentId, manager);

  if (!event) notFound();

  const date = parseLocalDate(event.date);
  const day = date.getDate();
  const month = MONTHS_ES[date.getMonth()];
  const year = date.getFullYear();
  const descriptionParagraphs = getEventDescriptionParagraphs(event);
  const typeMeta = event.event_type ? EVENT_TYPE_META[event.event_type] : null;
  const modalityMeta = event.modality ? MODALITY_META[event.modality] : null;

  return (
    <main className="flex-grow">
      <EventHero
        event={event}
        typeMeta={typeMeta}
        modalityMeta={modalityMeta}
        day={day}
        month={month}
        year={year}
        manager={manager}
      />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <Link
          href={`/${manager}/agenda`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-primary transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          Volver a Agenda
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Descripción */}
            <Card className="glass-card p-8 gap-0">
              <h2 className="text-2xl font-semibold font-montserrat text-brand-primary mb-6 flex items-center gap-3">
                <span className="size-8 rounded bg-brand-accent flex items-center justify-center shrink-0">
                  <Info className="size-5 text-brand-primary" />
                </span>
                Sobre este Evento
              </h2>
              <div className="space-y-4 text-brand-foreground leading-relaxed">
                {descriptionParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
                {descriptionParagraphs.length === 0 && (
                  <p className="text-brand-muted-foreground italic">
                    Sin descripción disponible.
                  </p>
                )}
              </div>
              {event.registration_url && (
                <div className="mt-8">
                  <a
                    href={event.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-primary hover:opacity-90 text-brand-primary-foreground font-bold px-8 py-3 rounded-full text-sm tracking-wide transition-opacity inline-block"
                  >
                    Ver
                  </a>
                </div>
              )}
            </Card>

            {event.agenda_items && event.agenda_items.length > 0 && (
              <AgendaTimeline items={event.agenda_items} />
            )}

            {event.location && <EventLocation location={event.location} />}
          </div>

          <EventSidebar
            conferencistas={event.conferencistas}
            recursos={event.recursos}
          />
        </div>
      </section>
    </main>
  );
}
export default function AgendaEventDetailPage({ manager, documentId }: Props) {
  return (
    <Suspense fallback={<EventDetailSkeleton />}>
      <AgendaEventDetailContent manager={manager} documentId={documentId} />
    </Suspense>
  );
}
