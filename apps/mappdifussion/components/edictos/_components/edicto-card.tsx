import { Bell, CalendarDays } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface EdictoCardProps {
  id: string;
  title: string;
  description: string;
  fecha_publicacion: string | Date;
  tramite: string;
  href: string;
}

const edictoDateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function formatDateLong(date: string | Date): string {
  return edictoDateFormatter.format(new Date(date));
}

export function EdictoCard({
  title,
  description,
  fecha_publicacion,
  tramite,
  href,
  id,
}: EdictoCardProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card
        id={id}
        className="overflow-hidden group hover:shadow-xl transition-shadow duration-300"
      >
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Bell className="size-4 text-brand-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
            <Badge className="text-xs font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary">
              {tramite}
            </Badge>
            <span className="text-brand-muted-foreground text-sm font-medium flex items-center gap-1">
              <CalendarDays className="size-4" />
              {formatDateLong(fecha_publicacion)}
            </span>
          </div>

          <h3 className="text-xl font-semibold text-brand-foreground mb-3 leading-tight group-hover:text-brand-primary transition-colors">
            {title}
          </h3>

          <p className="text-brand-foreground text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
