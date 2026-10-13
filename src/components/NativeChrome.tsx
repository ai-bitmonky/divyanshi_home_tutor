"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useViewportMode } from "@/lib/hooks";
import { haptic, isStandalone } from "@/lib/native";
import { Icon } from "./Icons";

/**
 * App-wide native behaviour (no UI): keeps <html data-mode> in sync with the 900px breakpoint,
 * fades the standalone splash out, registers the service worker, adds haptic ticks to primary
 * actions and keeps outside links out of the standalone window.
 */
export function NativeChrome() {
  const mode = useViewportMode();

  useEffect(() => {
    if (mode) document.documentElement.dataset.mode = mode;
  }, [mode]);

  useEffect(() => {
    const d = document.documentElement;
    /* splash: at least 400ms from navigation start, then fade */
    let t1 = 0;
    let t2 = 0;
    if (d.dataset.splash === "1") {
      t1 = window.setTimeout(
        () => {
          d.dataset.splash = "out";
          t2 = window.setTimeout(() => d.removeAttribute("data-splash"), 280);
        },
        Math.max(0, 400 - performance.now()),
      );
    }
    /* standalone feels like an app: no pinch-zoom (the website keeps it for accessibility) */
    if (isStandalone()) {
      const vp = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
      if (vp && !vp.content.includes("user-scalable")) vp.content += ", maximum-scale=1, user-scalable=no";
    }
    /* offline support — production only (dev assets change on every edit) */
    const mobile = window.matchMedia("(max-width: 899px)").matches;
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production" && (isStandalone() || mobile)) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }
    const onClick = (e: MouseEvent) => {
      const el = e.target as Element | null;
      if (!el?.closest) return;
      if (el.closest(".btn-p, .msearch-go")) haptic();
      const a = el.closest<HTMLAnchorElement>("a[href]");
      if (a && isStandalone() && a.origin !== window.location.origin && !e.defaultPrevented) {
        e.preventDefault();
        window.open(a.href, "_blank", "noopener,noreferrer");
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}

/* ---------- "Add to Home Screen" nudge ---------- */
const NUDGE_KEY = "tfm-install-nudge";
const WEEK = 7 * 24 * 60 * 60 * 1000;
const NUDGE_ROUTES = ["/", "/tutors", "/classes", "/chat", "/profile"];

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferred: BIPEvent | null = null;
const listeners = new Set<() => void>();
function subscribeBip(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as BIPEvent;
    listeners.forEach((f) => f());
  });
}

function nudgeDue(): boolean {
  try {
    const last = Number(window.localStorage.getItem(NUDGE_KEY) || 0);
    return Date.now() - last > WEEK;
  } catch {
    return false;
  }
}
function nudgeSeen() {
  try {
    window.localStorage.setItem(NUDGE_KEY, String(Date.now()));
  } catch {
    /* storage blocked */
  }
}

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

/** Small dismissible bottom banner (mobile browser only, never in standalone), once per 7 days */
export function InstallBanner() {
  const pathname = usePathname();
  const mode = useViewportMode();
  const canPrompt = useSyncExternalStore(
    subscribeBip,
    () => deferred !== null,
    () => false,
  );
  const [show, setShow] = useState(false);
  const [hint, setHint] = useState<"ios" | "menu" | null>(null);
  const eligible = mode === "mobile" && NUDGE_ROUTES.includes(pathname);

  useEffect(() => {
    if (!eligible || show) return;
    const id = window.setTimeout(() => {
      if (isStandalone() || !nudgeDue()) return;
      nudgeSeen();
      setShow(true);
    }, 1500);
    return () => window.clearTimeout(id);
  }, [eligible, show]);

  if (!show || !eligible) return null;
  const add = async () => {
    if (deferred) {
      const ev = deferred;
      deferred = null;
      await ev.prompt().catch(() => {});
      setShow(false);
      return;
    }
    setHint(isIOS() ? "ios" : "menu");
  };
  return (
    <div className={`m-install${pathname === "/" ? " low" : ""}`} role="region" aria-label="Install TutorForMe">
      <svg className="m-install-ic" viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#1D3557" />
        <path d="M18 17h28v8H36.5v24h-9V25H18z" fill="#0A9A8A" />
      </svg>
      <div className="m-install-t">
        <b>Install TutorForMe</b>
        {hint === "ios" ? (
          <span>
            Tap <Icon name="share" size={13} /> Share, then
            <br />
            &ldquo;Add to Home Screen&rdquo;
          </span>
        ) : hint === "menu" ? (
          <span>
            Open the browser menu ⋮, then
            <br />
            &ldquo;Install app&rdquo;
          </span>
        ) : (
          <span>{canPrompt ? "One tap · works offline" : "Add it to your home screen"}</span>
        )}
      </div>
      {!hint && (
        <button type="button" className="btn btn-p btn-sm m-install-add" onClick={add}>
          Add
        </button>
      )}
      <button type="button" className="m-install-x" aria-label="Dismiss" onClick={() => setShow(false)}>
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}
