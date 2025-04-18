import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class strings together with Tailwind priorities handled correctly
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
