import { redirect } from "next/navigation";

export const metadata = {
  title: "Gestor Catastral",
  description: "Portal de difusión catastral.",
};

interface PageProps {
  params: Promise<{
    manager: string;
  }>;
}

export default async function Home({ params }: PageProps) {
  const { manager } = await params;
  redirect(`/${manager}/home-page`);
}
