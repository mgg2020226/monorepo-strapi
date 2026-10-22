"use client";

interface DynamicThemeProps {
  theme: {
    primary?: string | null;
    secondary?: string | null;
    accent?: string | null;
    background?: string | null;
    foreground?: string | null;
    muted?: string | null;
    mutedForeground?: string | null;
    card?: string | null;
    cardForeground?: string | null;
    border?: string | null;
    input?: string | null;
    ring?: string | null;
    destructive?: string | null;
    destructiveForeground?: string | null;
    success?: string | null;
    warning?: string | null;
    info?: string | null;
  } | null;
}

const defaultTheme = {
  primary: "0.546 0.233 264" /* primary.600 #2563EB */,
  secondary: "0.968 0.007 248" /* neutral.100 #F1F5F9 */,
  accent: "0.961 0.028 261" /* primary.50  #EAF3FF */,
  background: "1 0 0" /* neutral.0   #FFFFFF */,
  foreground: "0.208 0.042 265" /* neutral.900 #0F172A */,
  muted: "0.968 0.007 248" /* neutral.100         */,
  mutedForeground: "0.554 0.046 257" /* neutral.500 #64748B */,
  card: "1 0 0",
  cardForeground: "0.208 0.042 265",
  border: "0.929 0.013 255" /* neutral.200 #E2E8F0 */,
  input: "0.929 0.013 255",
  ring: "0.619 0.191 261" /* primary.500 #3B82F6 */,
  destructive: "0.577 0.245 27.325",
  success: "0.646 0.222 141",
  warning: "0.828 0.189 84",
  info: "0.619 0.191 261",
};

export function DynamicTheme({ theme }: DynamicThemeProps) {
  const convertHexToOKLCH = (hex: string): string => {
    hex = hex.replace("#", "");

    const r = Number.parseInt(hex.substring(0, 2), 16) / 255;
    const g = Number.parseInt(hex.substring(2, 4), 16) / 255;
    const b = Number.parseInt(hex.substring(4, 6), 16) / 255;

    const toLinear = (c: number) => {
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };

    const rLinear = toLinear(r);
    const gLinear = toLinear(g);
    const bLinear = toLinear(b);

    const x = rLinear * 0.4124564 + gLinear * 0.3575761 + bLinear * 0.1804375;
    const y = rLinear * 0.2126729 + gLinear * 0.7151522 + bLinear * 0.072175;
    const z = rLinear * 0.0193339 + gLinear * 0.119192 + bLinear * 0.9503041;

    const l_ = Math.cbrt(
      0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z,
    );
    const m_ = Math.cbrt(
      0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z,
    );
    const s_ = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z);

    const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
    const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

    const C = Math.sqrt(a * a + b_ * b_);
    let H = (Math.atan2(b_, a) * 180) / Math.PI;
    if (H < 0) H += 360;

    return `${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(3)}`;
  };

  const calculateForeground = (oklchColor: string): string => {
    const [l] = oklchColor.split(" ").map(Number);
    return l > 0.6 ? "0.145 0 0" : "0.985 0 0";
  };

  const processColor = (
    color: string | null | undefined,
    fallback: string,
  ): string => {
    if (!color) return fallback;
    if (color.startsWith("#")) {
      return convertHexToOKLCH(color);
    }
    return color;
  };

  // Procesar colores principales
  const primaryColor = processColor(theme?.primary, defaultTheme.primary);
  const secondaryColor = processColor(theme?.secondary, defaultTheme.secondary);
  const accentColor = processColor(theme?.accent, defaultTheme.accent);
  const backgroundColor = processColor(
    theme?.background,
    defaultTheme.background,
  );
  const foregroundColor = processColor(
    theme?.foreground,
    defaultTheme.foreground,
  );
  const cardColor = processColor(theme?.card, defaultTheme.card);
  const mutedColor = processColor(theme?.muted, defaultTheme.muted);
  const destructiveColor = processColor(
    theme?.destructive,
    defaultTheme.destructive,
  );
  const borderColor = processColor(theme?.border, defaultTheme.border);
  const inputColor = processColor(theme?.input, borderColor);
  const ringColor = processColor(theme?.ring, primaryColor);

  // Calcular foregrounds automáticamente
  const primaryForeground = calculateForeground(primaryColor);
  const secondaryForeground = calculateForeground(secondaryColor);
  const accentForeground = calculateForeground(accentColor);
  const cardForeground = processColor(
    theme?.cardForeground,
    calculateForeground(cardColor),
  );
  const mutedForeground = processColor(
    theme?.mutedForeground,
    defaultTheme.mutedForeground,
  );
  const destructiveForeground = calculateForeground(destructiveColor);

  return (
    <style>{`
      :root {
        /* Variables custom para tema dinámico - con prefijo brand */
        --brand-primary: oklch(${primaryColor});
        --brand-primary-foreground: oklch(${primaryForeground});
        --brand-secondary: oklch(${secondaryColor});
        --brand-secondary-foreground: oklch(${secondaryForeground});
        --brand-accent: oklch(${accentColor});
        --brand-accent-foreground: oklch(${accentForeground});
        --brand-background: oklch(${backgroundColor});
        --brand-foreground: oklch(${foregroundColor});
        --brand-card: oklch(${cardColor});
        --brand-card-foreground: oklch(${cardForeground});
        --brand-muted: oklch(${mutedColor});
        --brand-muted-foreground: oklch(${mutedForeground});
        --brand-border: oklch(${borderColor});
        --brand-input: oklch(${inputColor});
        --brand-ring: oklch(${ringColor});
        --brand-destructive: oklch(${destructiveColor});
        --brand-destructive-foreground: oklch(${destructiveForeground});
        --brand-success: oklch(${processColor(theme?.success, defaultTheme.success)});
        --brand-warning: oklch(${processColor(theme?.warning, defaultTheme.warning)});
        --brand-info: oklch(${processColor(theme?.info, defaultTheme.info)});
      }
    `}</style>
  );
}
