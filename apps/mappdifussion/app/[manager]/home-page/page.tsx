import HomePage from "@/components/home-page";

export const metadata = {
  title: "Inicio | Gestor Catastral",
  description:
    "Bienvenido al portal de difusión catastral. Consulte información actualizada sobre el catastro de su municipio.",
};

interface PageProps {
  params: Promise<{
    manager: string;
  }>;
}

export default async function HomePageComponent({ params }: PageProps) {
  const { manager } = await params;

  return <HomePage manager={manager} />;
}
