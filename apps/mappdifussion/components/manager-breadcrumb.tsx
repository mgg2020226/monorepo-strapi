import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface ManagerBreadcrumbProps {
  manager: string;
  current: string;
  tone?: "brand" | "default";
}

export function ManagerBreadcrumb({
  manager,
  current,
  tone = "default",
}: ManagerBreadcrumbProps) {
  const breadcrumbClassName =
    tone === "brand"
      ? "flex items-center gap-2 text-sm text-brand-muted-foreground mb-4"
      : "mb-4 flex items-center gap-2 text-sm text-muted-foreground";
  const pageClassName =
    tone === "brand"
      ? "text-brand-foreground font-medium"
      : "font-medium text-foreground";

  return (
    <Breadcrumb className={breadcrumbClassName}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/${manager}`}>Inicio</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className={pageClassName}>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
