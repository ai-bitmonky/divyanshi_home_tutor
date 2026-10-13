"use client";

/* =========================================================
   Native-app helpers for the mobile version (< 900px).
   The <head> boot script (layout.tsx) sets on <html>, before first paint:
     data-mode="mobile|desktop"   — same 900px breakpoint as useViewportMode
     data-standalone="1"          — installed PWA (or the ?standalone=1 dev override)
     data-splash="1"              — cold start in standalone → branded splash
   ========================================================= */

import { SA_KEY, SPLASH_KEY } from "./boot";

export { SA_KEY, SPLASH_KEY };

export function isMobileMode(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.mode === "mobile";
}

export function isStandalone(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.standalone === "1";
}

export function reducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/** The live screen's scroll container on mobile (null on desktop) */
export function scroller(): HTMLElement | null {
  if (!isMobileMode()) return null;
  return document.querySelector<HTMLElement>(".m-screen > .m-scroll");
}

/** Scroll the app content — .m-scroll on mobile, the window on desktop */
export function appScrollTo(top: number, smooth = false) {
  const behavior: ScrollBehavior = smooth && !reducedMotion() ? "smooth" : "auto";
  const el = scroller();
  if (el) el.scrollTo({ top, behavior });
  else window.scrollTo({ top, behavior });
}

export function appScrollToEnd() {
  const el = scroller();
  if (el) el.scrollTop = el.scrollHeight;
  else window.scrollTo({ top: document.body.scrollHeight });
}

/** Scroll so `el` sits `offset` px below the top of the visible area */
export function appScrollToEl(el: HTMLElement, offset: number) {
  const sc = scroller();
  if (sc) {
    const top = el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - offset;
    appScrollTo(top, true);
  } else appScrollTo(el.getBoundingClientRect().top + window.scrollY - offset, true);
}

/** Light haptic tick (Android; silently ignored elsewhere) */
export function haptic(ms = 8) {
  try {
    if (isMobileMode()) navigator.vibrate?.(ms);
  } catch {
    /* not supported */
  }
}

/* body scroll lock for sheets (the page itself never scrolls on mobile; this freezes .m-scroll) */
let locks = 0;
export function lockScroll(): () => void {
  locks += 1;
  document.documentElement.classList.add("m-lock");
  return () => {
    locks = Math.max(0, locks - 1);
    if (!locks) document.documentElement.classList.remove("m-lock");
  };
}

/* ---------- routes: depth map for transition direction ---------- */
export const TAB_ROUTES = ["/tutors", "/location", "/classes", "/profile", "/ai", "/chat"];

export function routeDepth(p: string): number {
  if (p === "/") return 0;
  if (TAB_ROUTES.includes(p)) return 1;
  if (p.startsWith("/book/") || p === "/checkout") return 3;
  if (p === "/paid") return 4;
  return 2; // /tutors/[slug], /chat/[id], /plans, /offline …
}
