import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type React from "react";
import AccessibilityWidget from "@/components/accessibility-widget";
import FooterLegal from "@/components/footer-legal";
import Navbar from "@/components/navbar";
import { ManagerProvider } from "@/lib/context/manager-context";
import { managerExists } from "@/lib/strapi";
import { getStrapiImageUrl } from "@/lib/strapi-images";
import { getFooterData } from "@/services/footer.service";
import { getMetadata } from "@/services/metadata.service";

import "./globals.css";
import { DynamicTheme } from "@/components/dynamic-theme";
import { MissingDataAlert } from "@/components/missing-data-alert";
import { getNavigationData } from "@/services/navigation.service";
import { getThemeSettings } from "@/services/theme.service";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    manager: string;
  }>;
};

/* ============================
   METADATA (SERVER)
============================ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ manager: string }>;
}): Promise<Metadata> {
  const { manager } = await params;

  const metadata = await getMetadata(manager);

  if (!metadata) {
    return {
      title: "Sitio sin configurar",
      description: "Los metadatos del sitio no están disponibles.",
      icons: {
        icon: "/favicon.ico",
      },
    };
  }

  const iconUrl = getStrapiImageUrl(metadata.icon, "small") || "/favicon.ico";

  return {
    title: metadata.title,
    description: metadata.description,
    icons: {
      icon: iconUrl,
    },
  };
}

/* ============================
   LAYOUT
============================ */
export default async function ManagerLayout({ children, params }: LayoutProps) {
  const { manager } = await params;

  // Verificar si el manager existe
  const exists = await managerExists(manager);
  if (!exists) {
    notFound();
  }

  const [footerData, navigationData, themeSettings, metadataData] =
    await Promise.all([
      getFooterData(manager),
      getNavigationData(manager),
      getThemeSettings(manager),
      getMetadata(manager),
    ]);

  const hasNavigation = navigationData !== null;
  const hasFooter = footerData !== null;
  const hasMetadata = metadataData !== null;

  return (
    <ManagerProvider managerSlug={manager}>
      <DynamicTheme theme={themeSettings} />

      {!hasMetadata && (
        <MissingDataAlert
          title="Metadatos no configurados"
          description="Los metadatos del sitio no están disponibles. Por favor, crea el contenido de metadatos en el CMS para que el sitio tenga título, descripción e ícono configurados."
          itemType="metadatas"
        />
      )}

      {hasNavigation ? (
        <Navbar data={navigationData} />
      ) : (
        <MissingDataAlert
          title="Navegación no configurada"
          description="El menú de navegación no está disponible. Por favor, crea el contenido de navegación en el CMS para que se pueda visualizar correctamente."
          itemType="navigation-layouts"
        />
      )}

      <main className="flex-1">{children}</main>

      {hasFooter ? (
        <FooterLegal data={footerData} />
      ) : (
        <MissingDataAlert
          title="Footer no configurado"
          description="El pie de página no está disponible. Por favor, crea el contenido del footer en el CMS para que se pueda visualizar correctamente."
          itemType="footer-layouts"
        />
      )}

      <AccessibilityWidget />
    </ManagerProvider>
  );
}
