import ContactPage from "@/components/contacto";

export const metadata = {
  title: "Contacto | Gestor Catastral",
  description:
    "Comuníquese con la entidad catastral. Encuentre nuestros canales de atención, dirección y horarios de servicio.",
};

interface PageProps {
  params: Promise<{ manager: string }>;
}

export default async function Page({ params }: PageProps) {
  const { manager } = await params;
  return <ContactPage manager={manager} />;
}
