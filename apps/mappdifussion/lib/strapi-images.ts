// Utilidades para procesar imágenes de Strapi v5

import { toStrapiUrl } from "@/lib/strapi-base-url";
import type { Image } from "@/types/strapi.types";

export const getStrapiMediaUrl = (
  url: string | null | undefined,
): string | null => {
  return toStrapiUrl(url);
};

/**
 * Tipo para los formatos de imagen disponibles
 */
type StrapiImageFormat =
  | "thumbnail"
  | "small"
  | "medium"
  | "large"
  | "original";

/**
 * Interfaz para los datos procesados de una imagen (resultado de getStrapiImageData)
 */
interface StrapiImageData {
  id: number;
  documentId: string;
  name: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  mime: string;
  size: number;
  url: string;
  formats: {
    original: string | null;
    thumbnail: string | null;
    small: string | null;
    medium: string | null;
    large: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Obtiene la URL de una imagen en un formato específico
 * @param image - Objeto de imagen de Strapi (tipo Image de strapi.types.ts)
 * @param format - Formato deseado: 'thumbnail' | 'small' | 'medium' | 'large' | 'original'
 * @returns URL completa de la imagen o null
 */
export const getStrapiImageUrl = (
  image: Image | null | undefined,
  format: StrapiImageFormat = "medium",
): string | null => {
  if (!image) return null;

  // Si se solicita el formato original o no existe el formato
  if (format === "original" || !image.formats) {
    return getStrapiMediaUrl(image.url);
  }

  // Buscar el formato solicitado
  const formatData = image.formats[format];
  if (formatData?.url) {
    const formatUrl = formatData.url.trim();
    const isStaleLocalFormat =
      image.provider === "aws-s3" &&
      formatUrl.startsWith("/uploads/");

    // The S3 migration moved original files but kept Strapi's local format
    // paths. Use the verified S3 original until those variants are migrated.
    if (isStaleLocalFormat) {
      return getStrapiMediaUrl(image.url);
    }

    return getStrapiMediaUrl(formatData.url);
  }

  // Fallback al formato original
  return getStrapiMediaUrl(image.url);
};

/**
 * Mapea un array de imágenes a sus URLs
 * @param images - Array de objetos de imagen de Strapi (tipo Image[])
 * @param format - Formato deseado
 * @returns Array de URLs
 */
const mapStrapiImages = (
  images: Image[] | null | undefined,
  format: StrapiImageFormat = "medium",
): string[] => {
  if (!Array.isArray(images)) return [];

  return images
    .map((img) => getStrapiImageUrl(img, format))
    .filter((url): url is string => url !== null);
};

/**
 * Obtiene todos los formatos disponibles de una imagen
 * @param image - Objeto de imagen de Strapi (tipo Image de strapi.types.ts)
 * @returns Objeto con todas las URLs por formato o null
 */
const getStrapiImageFormats = (
  image: Image | null | undefined,
): {
  original: string | null;
  thumbnail: string | null;
  small: string | null;
  medium: string | null;
  large: string | null;
} | null => {
  if (!image) return null;

  return {
    original: getStrapiMediaUrl(image.url),
    thumbnail: getStrapiMediaUrl(image.formats?.thumbnail?.url),
    small: getStrapiMediaUrl(image.formats?.small?.url),
    medium: getStrapiMediaUrl(image.formats?.medium?.url),
    large: getStrapiMediaUrl(image.formats?.large?.url),
  };
};

/**
 * Obtiene información completa de una imagen
 * @param image - Objeto de imagen de Strapi (tipo Image de strapi.types.ts)
 * @returns Información completa de la imagen o null
 */
const getStrapiImageData = (
  image: Image | null | undefined,
): StrapiImageData | null => {
  if (!image) return null;

  return {
    id: image.id,
    documentId: image.documentId,
    name: image.name,
    alt: image.alternativeText || "",
    caption: image.caption || "",
    width: image.width,
    height: image.height,
    mime: image.mime,
    size: image.size,
    url: getStrapiMediaUrl(image.url) || "",
    formats: getStrapiImageFormats(image) || {
      original: null,
      thumbnail: null,
      small: null,
      medium: null,
      large: null,
    },
    createdAt: image.createdAt,
    updatedAt: image.updatedAt,
  };
};

/**
 * Obtiene el mejor formato disponible según el ancho deseado
 * @param image - Objeto de imagen de Strapi (tipo Image de strapi.types.ts)
 * @param targetWidth - Ancho objetivo en pixels
 * @returns URL del formato más apropiado o null
 */
const getStrapiImageByWidth = (
  image: Image | null | undefined,
  targetWidth: number,
): string | null => {
  if (!image) return null;

  // Determinar el formato según el ancho
  if (targetWidth <= 156) return getStrapiImageUrl(image, "thumbnail");
  if (targetWidth <= 500) return getStrapiImageUrl(image, "small");
  if (targetWidth <= 750) return getStrapiImageUrl(image, "medium");
  if (targetWidth <= 1000) return getStrapiImageUrl(image, "large");

  return getStrapiImageUrl(image, "original");
};

/**
 * Genera un srcSet para imágenes responsive
 * @param image - Objeto de imagen de Strapi (tipo Image de strapi.types.ts)
 * @returns String de srcSet para usar en <img>
 */
const getStrapiImageSrcSet = (image: Image | null | undefined): string => {
  if (!image?.formats) return "";

  const formats: string[] = [];

  if (image.formats.thumbnail) {
    formats.push(
      `${getStrapiMediaUrl(image.formats.thumbnail.url)} ${image.formats.thumbnail.width}w`,
    );
  }
  if (image.formats.small) {
    formats.push(
      `${getStrapiMediaUrl(image.formats.small.url)} ${image.formats.small.width}w`,
    );
  }
  if (image.formats.medium) {
    formats.push(
      `${getStrapiMediaUrl(image.formats.medium.url)} ${image.formats.medium.width}w`,
    );
  }
  if (image.formats.large) {
    formats.push(
      `${getStrapiMediaUrl(image.formats.large.url)} ${image.formats.large.width}w`,
    );
  }
  if (image.url) {
    formats.push(`${getStrapiMediaUrl(image.url)} ${image.width}w`);
  }

  return formats.join(", ");
};
