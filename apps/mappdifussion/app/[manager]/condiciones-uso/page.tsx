import CondicionesUsoComponent from "@/components/condiciones-uso";

export const metadata = {
  title: "Condiciones de Uso | Gestor Catastral",
  description:
    "Lea los términos y condiciones de uso del portal de difusión catastral antes de utilizar nuestros servicios.",
};

interface PageProps {
  params: Promise<{
    manager: string;
  }>;
}

export default async function CondicionesUsoPage({ params }: PageProps) {
  const { manager } = await params;
  return <CondicionesUsoComponent manager={manager} />;
}
