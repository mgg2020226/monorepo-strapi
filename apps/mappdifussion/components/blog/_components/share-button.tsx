"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
}

export function ShareButton({ title }: Props) {
  return (
    <Button
      type="button"
      onClick={() => navigator.share?.({ title, url: window.location.href })}
      className="p-2 border border-brand-border rounded-full hover:bg-brand-accent transition-colors"
      aria-label="Compartir"
    >
      <Share2 className="size-4" />
    </Button>
  );
}
