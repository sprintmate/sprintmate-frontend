import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class name strings and tailwind classes efficiently
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
