import type { LucideIcon } from "lucide-react";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import type {
  ContactChannel,
  ContactChannelIcon,
  ContactPageData,
} from "@/types/strapi.types";

const ICON_MAP: Record<ContactChannelIcon, LucideIcon> = {
  "map-pin": MapPin,
  phone: Phone,
  mail: Mail,
};

function ContactChannels({ channels }: { channels: ContactChannel[] }) {
  if (!channels?.length) return null;

  return (
    <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/60 shadow-md space-y-4">
      <h2 className="font-montserrat text-2xl font-semibold text-brand-primary">
        Canales de Atención
      </h2>

      {channels.map((ch) => {
        const Icon = ICON_MAP[ch.icon] ?? MapPin;
        return (
          <div
            key={ch.id}
            className="flex gap-4 items-start p-4 rounded-xl hover:shadow-md transition"
          >
            <div className="size-10 flex items-center justify-center bg-brand-accent rounded-lg">
              <Icon className="size-5 text-brand-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-brand-primary uppercase">
                {ch.label}
              </h3>
              {ch.value && (
                <p className="text-sm text-brand-foreground break-words">
                  {ch.value}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ContactMap({ data }: { data?: ContactPageData | null }) {
  const hasMap = data?.map_address || data?.map_city;
  if (!hasMap) return null;

  const address = [data.map_address, data.map_city].filter(Boolean).join(", ");

  return (
    <div className="glass-panel overflow-hidden">
      <iframe
        title="Ubicación"
        width="100%"
        height="320"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts"
        src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
      />
      {data.map_url && (
        <Link
          href={data.map_url}
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 bg-brand-card border-t border-brand-border hover:bg-brand-accent transition-colors"
        >
          <MapPin className="size-4 text-brand-primary shrink-0" />
          <span className="text-xs font-bold text-brand-primary">
            {address}
          </span>
        </Link>
      )}
    </div>
  );
}

interface ContactLayoutProps {
  channels: ContactChannel[];
  mapData?: ContactPageData | null;
  children: React.ReactNode;
}

export default function ContactLayout({
  channels,
  mapData,
  children,
}: ContactLayoutProps) {
  const hasMap = Boolean(mapData?.map_address || mapData?.map_city);
  const showLeft = channels.length > 0 || hasMap;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {showLeft && (
          <div className="lg:col-span-5 space-y-8">
            <ContactChannels channels={channels} />
            <ContactMap data={mapData} />
          </div>
        )}
        <div className={showLeft ? "lg:col-span-7" : "lg:col-span-12"}>
          {children}
        </div>
      </div>
    </section>
  );
}
