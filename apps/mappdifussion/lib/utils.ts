import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const activeGlass =
  "bg-brand-primary-50/80 text-brand-primary font-semibold ring-1 ring-brand-primary-200/60 shadow-sm";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function resolveHref(href: string, managerSlug: string): string {
  if (!href) return `/${managerSlug}`;
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href.startsWith(`/${managerSlug}/`) || href === `/${managerSlug}`)
    return href;
  if (href.startsWith("/")) return `/${managerSlug}${href}`;
  return `/${managerSlug}/${href}`;
}

export interface SkeletonItem {
  id: string;
  index: number;
}

export function createSkeletonItems(
  prefix: string,
  count: number,
): SkeletonItem[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    index,
  }));
}
