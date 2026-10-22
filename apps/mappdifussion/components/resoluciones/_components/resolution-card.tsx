import { CalendarDays, Eye, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PdfThumbnail } from "./pdf-thumbnail";

interface ResolutionCardProps {
  id: string;
  title: string;
  date: string | Date;
  formattedDate: string;
  description: string;
  documentUrl?: string;
  imageUrl?: string;
  resolution_type?: "avaluos" | "geografica" | "catastral";
  year?: number;
}

const TYPE_CONFIG = {
  avaluos: {
    label: "Avaluos",
    className: "bg-primary/10 text-brand-primary",
  },
  geografica: {
    label: "Geográfica",
    className: "bg-brand-warning/10 text-brand-warning",
  },
  catastral: {
    label: "Catastral",
    className: "bg-brand-success/10 text-brand-success",
  },
};

export function ResolutionCard({
  title,
  formattedDate,
  description,
  documentUrl,
  imageUrl,
  resolution_type,
  id,
}: ResolutionCardProps) {
  const typeConfig = resolution_type ? TYPE_CONFIG[resolution_type] : null;

  return (
    <Card className="p-0 overflow-hidden group hover:shadow-xl transition-shadow duration-300 rounded-md">
      <div className="flex flex-col md:flex-row">
        {/* Document preview image */}
        <CardHeader
          id={id}
          className="w-full md:w-64 shrink-0 bg-muted flex items-center justify-center p-8 border-r border-border relative overflow-hidden self-stretch"
        >
          <div className="relative w-full h-full min-h-[200px] shadow-lg group-hover:scale-105 transition-transform duration-500 rounded-sm overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                sizes="256px"
                className="object-cover"
              />
            ) : documentUrl ? (
              <PdfThumbnail
                previewUrl={documentUrl}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-border flex items-center justify-center">
                <FileText className="size-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </CardHeader>

        {/* Details */}
        <CardContent className="flex-1 p-8">
          {/* Type badge + date */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {typeConfig && (
              <Badge
                className={`text-xs font-bold uppercase tracking-wider ${typeConfig.className}`}
              >
                {typeConfig.label}
              </Badge>
            )}
            <span className="text-muted-foreground text-sm font-medium flex items-center gap-1">
              <CalendarDays className="size-4" />
              {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-foreground mb-3 leading-tight group-hover:text-brand-primary transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-foreground text-sm leading-relaxed mb-6 line-clamp-3">
            {description}
          </p>

          {/* Footer: CTA */}
          {documentUrl && (
            <div className="border-t border-border pt-6">
              <Link
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-brand-primary text-brand-primary-foreground px-6 py-2.5 rounded-full font-bold text-sm hover:bg-brand-primary/90 transition-colors shadow-md w-fit"
              >
                <Eye className="size-4" />
                Ver PDF
              </Link>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
