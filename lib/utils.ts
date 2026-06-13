/**
 * Shared utility functions for IMPROV.
 * Add helpers here as the app grows.
 */

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
