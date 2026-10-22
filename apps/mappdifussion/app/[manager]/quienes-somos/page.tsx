import QuienesSomosPage from "@/components/quienes-somos";

export const metadata = {
  title: "Quiénes Somos | Gestor Catastral",
  description:
    "Conozca la misión, visión y equipo de la entidad catastral responsable de la gestión predial en su municipio.",
};

interface PageProps {
  params: Promise<{ manager: string }>;
}

export default async function Page({ params }: PageProps) {
  const { manager } = await params;
  return <QuienesSomosPage manager={manager} />;
}
