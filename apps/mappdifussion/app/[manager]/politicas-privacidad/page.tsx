import PoliticasPrivacidadComponent from "@/components/politicas-privacidad";

export const metadata = {
  title: "Políticas de Privacidad | Gestor Catastral",
  description:
    "Conozca las políticas de privacidad y tratamiento de datos personales del portal de difusión catastral.",
};
interface PageProps {
  params: Promise<{
    manager: string;
  }>;
}

export default async function PoliticasPrivacidadPage({ params }: PageProps) {
  const { manager } = await params;
  return <PoliticasPrivacidadComponent manager={manager} />;
}
