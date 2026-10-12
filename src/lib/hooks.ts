"use client";

import { useSyncExternalStore } from "react";

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const m = window.matchMedia(query);
    m.addEventListener("change", cb);
    return () => m.removeEventListener("change", cb);
  };
}

const RM = "(prefers-reduced-motion: reduce)";
const subRM = subscribeMedia(RM);

/** true when the user asked for reduced motion (false on the server) */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subRM,
    () => window.matchMedia(RM).matches,
    () => false,
  );
}

export function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia(RM).matches;
  } catch {
    return false;
  }
}

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

/** true once the page has scrolled past `y` px (false on the server) */
export function useScrolled(y = 8): boolean {
  return useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > y,
    () => false,
  );
}
