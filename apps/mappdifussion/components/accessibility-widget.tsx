"use client";

import {
  AccessibilityIcon,
  EyeIcon,
  LinkIcon,
  RotateCcwIcon,
  SpaceIcon,
  TypeIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";

// NTC 5854 - Norma Técnica Colombiana para Accesibilidad Web
// Cumple con WCAG 2.1 Nivel AA

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  grayscale: boolean;
  highlightLinks: boolean;
  lineHeight: number;
  readableFont: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  lineHeight: 1.5,
  readableFont: false,
};

const ACCESSIBILITY_SETTINGS_KEY = "accessibility-settings:v1";

function getInitialAccessibilitySettings(): AccessibilitySettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  const saved = window.localStorage.getItem(ACCESSIBILITY_SETTINGS_KEY);
  if (!saved) {
    return DEFAULT_SETTINGS;
  }

  try {
    return JSON.parse(saved) as AccessibilitySettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

interface PanelProps {
  settings: AccessibilitySettings;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K],
  ) => void;
  resetSettings: () => void;
  onClose: () => void;
}

function AccessibilityPanel({
  settings,
  dialogRef,
  updateSetting,
  resetSettings,
  onClose,
}: PanelProps) {
  return (
    <dialog
      ref={dialogRef}
      className="fixed bottom-20 right-4 z-50 m-0 w-80 max-w-[calc(100vw-2rem)] rounded-lg border bg-brand-card p-4 shadow-xl backdrop:bg-black/30"
      aria-label="Panel de accesibilidad"
    >
      {/* Encabezado */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Accesibilidad</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Cerrar panel de accesibilidad"
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      <p className="mb-4 text-sm text-brand-muted-foreground">
        Cumple con NTC 5854 y WCAG 2.1 AA
      </p>

      {/* Controles */}
      <div className="space-y-4">
        {/* Tamaño de texto */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TypeIcon className="size-4" />
            Tamaño de texto: {settings.fontSize}%
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                updateSetting("fontSize", Math.max(80, settings.fontSize - 10))
              }
              disabled={settings.fontSize <= 80}
              aria-label="Disminuir tamaño de texto"
            >
              A-
            </Button>
            <Input
              type="range"
              min="80"
              max="150"
              step="10"
              value={settings.fontSize}
              onChange={(e) =>
                updateSetting("fontSize", Number(e.target.value))
              }
              className="flex-1"
              aria-label="Ajustar tamaño de texto"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                updateSetting("fontSize", Math.min(150, settings.fontSize + 10))
              }
              disabled={settings.fontSize >= 150}
              aria-label="Aumentar tamaño de texto"
            >
              A+
            </Button>
          </div>
        </div>

        {/* Alto contraste */}
        <Button
          variant={settings.highContrast ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => updateSetting("highContrast", !settings.highContrast)}
          aria-pressed={settings.highContrast}
        >
          <EyeIcon className="mr-2 size-4" />
          Alto contraste
        </Button>

        {/* Escala de grises */}
        <Button
          variant={settings.grayscale ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => updateSetting("grayscale", !settings.grayscale)}
          aria-pressed={settings.grayscale}
        >
          <EyeIcon className="mr-2 size-4" />
          Escala de grises
        </Button>

        {/* Enlaces destacados */}
        <Button
          variant={settings.highlightLinks ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() =>
            updateSetting("highlightLinks", !settings.highlightLinks)
          }
          aria-pressed={settings.highlightLinks}
        >
          <LinkIcon className="mr-2 size-4" />
          Destacar enlaces
        </Button>

        {/* Espaciado de líneas */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <SpaceIcon className="size-4" />
            Espaciado: {settings.lineHeight.toFixed(1)}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                updateSetting(
                  "lineHeight",
                  Math.max(1.0, settings.lineHeight - 0.1),
                )
              }
              disabled={settings.lineHeight <= 1.0}
              aria-label="Disminuir espaciado de líneas"
            >
              -
            </Button>
            <Input
              type="range"
              min="1.0"
              max="2.5"
              step="0.1"
              value={settings.lineHeight}
              onChange={(e) =>
                updateSetting("lineHeight", Number(e.target.value))
              }
              className="flex-1"
              aria-label="Ajustar espaciado de líneas"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                updateSetting(
                  "lineHeight",
                  Math.min(2.5, settings.lineHeight + 0.1),
                )
              }
              disabled={settings.lineHeight >= 2.5}
              aria-label="Aumentar espaciado de líneas"
            >
              +
            </Button>
          </div>
        </div>

        {/* Fuente legible */}
        <Button
          variant={settings.readableFont ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => updateSetting("readableFont", !settings.readableFont)}
          aria-pressed={settings.readableFont}
        >
          <TypeIcon className="mr-2 size-4" />
          Fuente legible (sans-serif)
        </Button>

        {/* Restablecer */}
        <Button
          variant="secondary"
          className="w-full"
          onClick={resetSettings}
          aria-label="Restablecer todas las configuraciones de accesibilidad"
        >
          <RotateCcwIcon className="mr-2 size-4" />
          Restablecer
        </Button>
      </div>

      {/* Información legal */}
      <div className="mt-4 border-t pt-4">
        <p className="text-xs text-brand-muted-foreground">
          Este componente cumple con la Norma Técnica Colombiana NTC 5854 y los
          estándares WCAG 2.1 Nivel AA, según la Ley 1618 de 2013 y la
          Resolución 1519 de 2020 del MinTIC.
        </p>
      </div>
    </dialog>
  );
}

export default function AccessibilityWidget() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [settings, setSettings] = useState<AccessibilitySettings>(
    getInitialAccessibilitySettings,
  );

  useEffect(() => {
    const root = document.documentElement;

    root.style.fontSize = `${settings.fontSize}%`;

    if (settings.highContrast) {
      root.classList.add("accessibility-high-contrast");
    } else {
      root.classList.remove("accessibility-high-contrast");
    }

    if (settings.grayscale) {
      root.classList.add("accessibility-grayscale");
    } else {
      root.classList.remove("accessibility-grayscale");
    }

    if (settings.highlightLinks) {
      root.classList.add("accessibility-highlight-links");
    } else {
      root.classList.remove("accessibility-highlight-links");
    }

    root.style.setProperty(
      "--accessibility-line-height",
      settings.lineHeight.toString(),
    );
    if (settings.lineHeight !== 1.5) {
      root.classList.add("accessibility-line-height");
    } else {
      root.classList.remove("accessibility-line-height");
    }

    if (settings.readableFont) {
      root.classList.add("accessibility-readable-font");
    } else {
      root.classList.remove("accessibility-readable-font");
    }

    localStorage.setItem(ACCESSIBILITY_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(ACCESSIBILITY_SETTINGS_KEY);
  };

  return (
    <>
      <Button
        onClick={() => dialogRef.current?.showModal()}
        className="fixed bottom-4 right-4 z-50 size-14 rounded-full shadow-lg"
        size="icon"
        aria-label="Abrir panel de accesibilidad"
        title="Opciones de accesibilidad"
      >
        <AccessibilityIcon className="size-6" />
      </Button>

      <AccessibilityPanel
        settings={settings}
        dialogRef={dialogRef}
        updateSetting={updateSetting}
        resetSettings={resetSettings}
        onClose={() => dialogRef.current?.close()}
      />

      <style>{`
        /* Alto contraste */
        .accessibility-high-contrast {
          filter: contrast(1.5);
        }

        /* Escala de grises */
        .accessibility-grayscale {
          filter: grayscale(100%);
        }

        /* Enlaces destacados */
        .accessibility-highlight-links a {
          text-decoration: underline !important;
          text-decoration-thickness: 2px !important;
          text-underline-offset: 2px !important;
          font-weight: 600 !important;
        }

        /* Espaciado de líneas */
        .accessibility-line-height p,
        .accessibility-line-height li,
        .accessibility-line-height div {
          line-height: var(--accessibility-line-height) !important;
        }

        /* Fuente legible */
        .accessibility-readable-font {
          font-family: Arial, Helvetica, sans-serif !important;
        }

        /* Mejoras para navegación por teclado */
        *:focus-visible {
          outline: 3px solid var(--color-ring) !important;
          outline-offset: 2px !important;
        }

        /* Asegurar contraste en botones */
        button:focus-visible,
        a:focus-visible {
          outline: 3px solid var(--color-ring) !important;
          outline-offset: 2px !important;
        }
      `}</style>
    </>
  );
}
