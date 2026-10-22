"use client";

import { Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TeamMember } from "@/services/about.service";

function MemberCard({ member }: { member: TeamMember }) {
  const hasPhoto = member.image && member.image !== "/placeholder.svg";

  return (
    <Card className="p-0 group overflow-hidden rounded-xl border shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative w-full h-40 sm:h-44 md:h-48 bg-brand-accent">
        {hasPhoto ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="size-14 text-brand-primary/20" />
          </div>
        )}
      </div>

      <CardContent className="flex flex-col gap-1.5 p-4 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">
          {member.position}
        </p>

        <h3 className="font-semibold text-brand-primary text-sm leading-snug line-clamp-2">
          {member.name}
        </h3>

        {member.department && (
          <p className="text-[12px] text-brand-muted-foreground line-clamp-1">
            {member.department}
          </p>
        )}

        {member.email && (
          <div className="mt-auto pt-2 border-t border-brand-accent">
            <Link
              href={`mailto:${member.email}`}
              className="flex items-center gap-1.5 text-[11px] text-brand-foreground hover:text-brand-primary hover:bg-brand-accent/60 rounded-md px-2 py-1 -mx-2 -my-1 transition-colors duration-200"
            >
              <Mail className="size-3.5 shrink-0 text-brand-primary" />
              <span className="truncate">{member.email}</span>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Teams({ member }: { member: TeamMember[] }) {
  return (
    <div>
      <CardHeader className="text-center p-0 mb-10">
        <h1 className="text-2xl font-semibold font-montserrat text-brand-primary mb-2">
          Nuestro Equipo Profesional
        </h1>
        <p className="text-sm text-brand-muted-foreground">
          Expertos comprometidos con la excelencia
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {member.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      </CardContent>
    </div>
  );
}
