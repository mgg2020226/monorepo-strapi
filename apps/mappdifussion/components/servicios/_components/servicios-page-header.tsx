import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface ServiciosPageHeaderProps {
  manager: string;
  title: string;
  description: string;
}

export function ServiciosPageHeader({
  manager,
  title,
  description,
}: ServiciosPageHeaderProps) {
  return (
    <div className="mb-12">
      <Breadcrumb className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${manager}`}>Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium">
              {title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-4xl font-semibold text-brand-primary mb-4">
        {title}
      </h1>
      <p className="text-lg text-foreground max-w-3xl leading-relaxed">
        {description}
      </p>
    </div>
  );
}
