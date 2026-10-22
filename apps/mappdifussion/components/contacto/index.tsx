import Link from "next/link";
import { Suspense } from "react";
import { getContactPage } from "@/services/contact.service";
import ContactLayout from "./_components/channels";
import { ContactForm } from "./_components/contact-form";
import { Process } from "./_components/process";
import { ContactoSkeleton } from "./skeleton";

interface ContactPageProps {
  manager: string;
}

function FAQ({ manager }: ContactPageProps) {
  return (
    <section className="bg-brand-accent py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-montserrat text-xl font-semibold text-brand-primary">
            ¿Tiene dudas frecuentes?
          </h3>
          <p className="text-sm text-brand-foreground">
            Consulte nuestra sección de preguntas frecuentes para obtener
            respuestas rápidas.
          </p>
        </div>
        <Link
          href={`/${manager}/home-page#faq`}
          className="bg-brand-card text-brand-primary border border-brand-primary px-8 py-2.5 rounded-full font-bold text-sm hover:bg-brand-primary hover:text-brand-primary-foreground transition-colors whitespace-nowrap"
        >
          VER PREGUNTAS FRECUENTES
        </Link>
      </div>
    </section>
  );
}

async function ContactContent({ manager }: ContactPageProps) {
  const pageData = await getContactPage(manager);
  const channels = pageData?.channels ?? [];

  return (
    <main id="contacto" className="flex-grow">
      {(pageData?.hero_title || pageData?.hero_description) && (
        <section className="bg-brand-card border-b border-brand-accent py-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            {pageData.hero_eyebrow && (
              <span className="inline-block bg-brand-accent text-brand-accent-foreground font-montserrat text-[11px] font-bold tracking-[1.5px] uppercase px-4 py-1 rounded-full mb-4">
                {pageData.hero_eyebrow}
              </span>
            )}
            {pageData.hero_title && (
              <h1 className="font-montserrat text-4xl md:text-5xl font-semibold text-brand-primary mb-4 leading-tight">
                {pageData.hero_title}
              </h1>
            )}
            {pageData.hero_description && (
              <p className="text-lg text-brand-foreground max-w-2xl mx-auto">
                {pageData.hero_description}
              </p>
            )}
          </div>
        </section>
      )}

      <ContactLayout channels={channels} mapData={pageData}>
        <ContactForm manager={manager} />
      </ContactLayout>

      <Process />

      <FAQ manager={manager} />
    </main>
  );
}

export default function ContactPage({ manager }: ContactPageProps) {
  return (
    <Suspense fallback={<ContactoSkeleton />}>
      <ContactContent manager={manager} />
    </Suspense>
  );
}
