import { Eye, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  title: string;
  description?: string;
  mission?: string;
  vision?: string;
}

export function Identity(data: Readonly<Props>) {
  const { title, description, mission, vision } = data;
  return (
    <>
      <section className="mb-16 text-center max-w-3xl mx-auto">
        <span className="inline-block bg-brand-accent text-brand-accent-foreground font-montserrat text-[11px] font-bold tracking-[1.5px] uppercase px-4 py-1 rounded-full mb-4">
          Institución
        </span>

        <h1 className="text-4xl md:text-5xl font-semibold font-montserrat text-brand-primary mb-6">
          {title || "Nuestra Identidad"}
        </h1>

        <p className="text-lg text-brand-foreground leading-relaxed">
          {description}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {mission && (
          <Card className="glass-card hover:shadow-lg transition-shadow group border-0">
            <CardContent className="p-8">
              <div className="size-12 bg-brand-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-primary transition-colors">
                <Target className="size-6 text-brand-primary group-hover:text-white" />
              </div>
              <h2 className="text-2xl font-semibold font-montserrat text-brand-primary mb-4">
                Misión
              </h2>
              <p className="text-brand-foreground leading-relaxed">{mission}</p>
            </CardContent>
          </Card>
        )}
        {vision && (
          <Card className="glass-card hover:shadow-lg transition-shadow group border-0">
            <CardContent className="p-8">
              <div className="size-12 bg-brand-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-primary transition-colors">
                <Eye className="size-6 text-brand-primary group-hover:text-white" />
              </div>
              <h2 className="text-2xl font-semibold font-montserrat text-brand-primary mb-4">
                Visión
              </h2>
              <p className="text-brand-foreground leading-relaxed">{vision}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
