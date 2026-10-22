import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MissingDataAlertProps {
  title: string;
  description: string;
  itemType: string;
}

export function MissingDataAlert({
  title,
  description,
  itemType,
}: MissingDataAlertProps) {
  return (
    <div className="container mx-auto py-12 px-4">
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="size-5" />
        <AlertTitle className="text-lg font-semibold">{title}</AlertTitle>
        <AlertDescription className="mt-2">
          {description}
          <span className="block mt-3 text-sm font-medium">
            Tipo de contenido requerido:{" "}
            <code className="bg-destructive/20 px-2 py-1 rounded">
              {itemType}
            </code>
          </span>
        </AlertDescription>
      </Alert>
    </div>
  );
}
