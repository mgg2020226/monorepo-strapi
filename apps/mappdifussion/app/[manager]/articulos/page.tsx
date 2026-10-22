import BlogPage from "@/components/blog";

export const metadata = {
  title: "Artículos | Gestor Catastral",
  description:
    "Infórmese sobre los procesos de actualización catastral, normatividad vigente y trámites ciudadanos.",
};

interface PageProps {
  params: Promise<{ manager: string }>;
}

export default async function ArticlesPage({ params }: PageProps) {
  const { manager } = await params;
  return <BlogPage manager={manager} />;
}
