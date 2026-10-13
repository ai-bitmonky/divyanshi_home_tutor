"use client";

import type { ReactNode } from "react";
import { useViewportMode, type ViewportMode } from "@/lib/hooks";

/* The wrapper element is kept once the mode is known (rather than unwrapping to bare
   children) so the hydrated tree has the same shape as the server HTML: the active
   variant is never remounted after hydration, only the inactive one is dropped. */
function Variant({ mode, cls, children }: { mode: ViewportMode; cls: string; children: ReactNode }) {
  const now = useViewportMode();
  if (now !== null && now !== mode) return null;
  return (
    <div className={cls} style={{ display: "contents" }}>
      {children}
    </div>
  );
}

/** Rendered only below 900px. Before hydration both variants are in the HTML and CSS (.m-only) hides this one on desktop. */
export function Mobile({ children }: { children: ReactNode }) {
  return (
    <Variant mode="mobile" cls="m-only">
      {children}
    </Variant>
  );
}

/** Rendered only at 900px and up. Before hydration both variants are in the HTML and CSS (.d-only) hides this one on mobile. */
export function Desktop({ children }: { children: ReactNode }) {
  return (
    <Variant mode="desktop" cls="d-only">
      {children}
    </Variant>
  );
}
