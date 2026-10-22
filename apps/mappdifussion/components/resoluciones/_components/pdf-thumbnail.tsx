"use client";

import { FileText } from "lucide-react";
import type {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  RenderTask,
} from "pdfjs-dist";
import { useEffect, useRef, useState } from "react";

interface PdfThumbnailProps {
  previewUrl: string;
  className?: string;
}

export function PdfThumbnail({ previewUrl, className }: PdfThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderState, setRenderState] = useState<{
    status: "done" | "error";
    url: string;
  } | null>(null);

  useEffect(() => {
    if (!previewUrl) return;

    let cancelled = false;
    let loadingTask: PDFDocumentLoadingTask | null = null;
    let renderTask: RenderTask | null = null;

    async function render() {
      let result: "done" | "error" = "error";
      try {
        const pdfjsLib = await import("pdfjs-dist");
        if (cancelled) return;

        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        loadingTask = pdfjsLib.getDocument({ url: previewUrl });
        const pdf = (await loadingTask.promise) as PDFDocumentProxy;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const containerWidth = canvas.parentElement?.clientWidth || 400;
        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.max(containerWidth / viewport.width, 0.5);
        const scaled = page.getViewport({ scale });

        canvas.width = scaled.width;
        canvas.height = scaled.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        renderTask = page.render({
          canvasContext: ctx,
          viewport: scaled,
          canvas,
        });
        await renderTask.promise;

        result = "done";
      } catch {
        if (cancelled) return;
        console.error("[PdfThumbnail] Failed to render PDF preview");
      }

      if (!cancelled) {
        setRenderState({ status: result, url: previewUrl });
      }
    }

    void render();

    return () => {
      cancelled = true;
      renderTask?.cancel();
      void loadingTask?.destroy();
    };
  }, [previewUrl]);

  const status = !previewUrl
    ? "error"
    : renderState?.url === previewUrl
      ? renderState.status
      : "loading";

  if (status === "error") {
    return (
      <div
        className={`flex items-center justify-center bg-muted ${className ?? ""}`}
      >
        <FileText className="size-16 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <div className={`relative bg-muted w-full h-full ${className ?? ""}`}>
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <FileText className="size-12 text-muted-foreground/30" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-contain"
        style={{ display: status === "done" ? "block" : "none" }}
      />
    </div>
  );
}
