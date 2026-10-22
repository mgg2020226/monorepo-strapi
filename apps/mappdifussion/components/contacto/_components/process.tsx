import { CheckCircle, FileSearch, MessageSquare, Send } from "lucide-react";

export function Process() {
  return (
    <section className="bg-brand-card border-t border-brand-accent py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-montserrat text-2xl md:text-3xl font-semibold text-brand-primary mb-3">
            ¿Cómo se atienden las solicitudes?
          </h2>
          <p className="text-brand-foreground max-w-xl mx-auto text-sm">
            Su solicitud es gestionada por nuestro equipo en cuatro pasos
            simples.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Send,
              step: "01",
              title: "Envío de solicitud",
              desc: "Complete el formulario de contacto o comuníquese por cualquier canal disponible.",
            },
            {
              icon: FileSearch,
              step: "02",
              title: "Radicación y revisión",
              desc: "Su solicitud es registrada y asignada al área competente para su revisión.",
            },
            {
              icon: MessageSquare,
              step: "03",
              title: "Seguimiento",
              desc: "Recibirá notificaciones sobre el estado de su trámite en cada etapa del proceso.",
            },
            {
              icon: CheckCircle,
              step: "04",
              title: "Respuesta",
              desc: "La respuesta es entregada dentro de los tiempos establecidos por la normativa vigente.",
            },
          ].map(({ icon: Icon, step, title, desc }) => (
            <div
              key={step}
              className="relative flex flex-col items-center text-center glass-card hover:shadow-lg transition-colors group"
            >
              <span className="absolute top-4 right-4 text-xs font-black text-brand-primary/20 select-none">
                {step}
              </span>
              <div className="size-12 bg-brand-accent rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-primary transition-colors">
                <Icon className="size-6 text-brand-primary group-hover:text-brand-primary-foreground transition-colors" />
              </div>
              <h4 className="font-montserrat font-semibold text-brand-primary mb-2 text-sm">
                {title}
              </h4>
              <p className="text-xs text-brand-foreground leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
