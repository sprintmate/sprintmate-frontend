import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names or conditional class names
 * using clsx and merges them with Tailwind classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
