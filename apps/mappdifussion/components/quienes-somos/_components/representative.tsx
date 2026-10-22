import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { LiderInstitucional } from "@/services/about.service";

interface Props {
  lider: LiderInstitucional;
}

export function Representative({ lider }: Props) {
  const paragraphs = lider.biography?.split("\n").filter(Boolean) ?? [];

  const hasBio = paragraphs.length > 0;

  return (
    <Card className="card-hero overflow-hidden mb-20 border-0 bg-transparent">
      <div className="grid grid-cols-1 lg:grid-cols-5 items-stretch">
        <div className="lg:col-span-2 relative min-h-[400px] bg-brand-primary">
          {lider.photo?.url ? (
            <Image
              src={lider.photo.url}
              alt={lider.name}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="size-28 text-white/20" />
            </div>
          )}
        </div>

        <div className="lg:col-span-3 p-10 md:p-16 flex flex-col justify-center text-white">
          <span className="text-brand-primary-foreground/70 font-bold text-xs tracking-widest uppercase mb-2">
            Liderazgo Institucional
          </span>

          <h2 className="text-3xl md:text-4xl font-semibold font-montserrat mb-4">
            {lider.name}
          </h2>

          <h3 className="text-xl text-brand-primary-foreground/70 font-medium mb-8">
            {lider.position}
          </h3>

          {hasBio ? (
            <div className="space-y-4 text-white/90 leading-relaxed text-base">
              <p>{lider.biography}</p>
            </div>
          ) : (
            <p className="text-white/90 leading-relaxed">
              Líder institucional comprometido con la transparencia y
              modernización del catastro municipal.
            </p>
          )}

          {lider.buttons?.length ? (
            <div className="mt-10 flex gap-4 flex-wrap">
              {lider.buttons.map((btn) => (
                <Link
                  key={btn.id}
                  href={btn.href || "#"}
                  target={btn.isExternal ? "_blank" : undefined}
                  rel={btn.isExternal ? "noopener noreferrer" : undefined}
                >
                  <Button
                    variant={"outline"}
                    className={`rounded-full px-6 py-3 text-sm uppercase tracking-wider font-bold bg-white text-brand-primary hover:bg-neutral-100 hover:shadow-md`}
                  >
                    {btn.label}
                  </Button>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
