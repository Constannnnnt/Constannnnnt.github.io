import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolves a URL by prepending the base path if it's an absolute path (starts with /).
 * This is useful for subdirectory hosting like GitHub Pages.
 */
export function resolveUrl(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith('http') || url.startsWith('https') || url.startsWith('mailto:') || url.startsWith('tel:')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${import.meta.env.BASE_URL}${url.slice(1)}`;
  }
  return url;
}
