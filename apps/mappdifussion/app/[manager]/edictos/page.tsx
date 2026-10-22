import EdictoPage from "@/components/edictos";

export const metadata = {
  title: "Edictos | Gestor Catastral",
  description:
    "Consulte las comunicaciones por edicto emitidas por la oficina del Gestor Catastral en cumplimiento de los procesos catastrales.",
};

interface PageProps {
  params: Promise<{ manager: string }>;
}

export default async function Page({ params }: PageProps) {
  const { manager } = await params;
  return <EdictoPage manager={manager} />;
}
