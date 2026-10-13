"use client";

import { useCallback, useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { lockScroll, reducedMotion } from "@/lib/native";

type Slot = ReactNode | ((close: () => void) => ReactNode);
/** renders a slot that may be a function of `close` (a component, so `close` stays an event-time value) */
function SlotView({ s, close }: { s: Slot; close: () => void }) {
  return <>{typeof s === "function" ? s(close) : s}</>;
}

const DISMISS_PX = 120;
const DISMISS_V = 0.6; // px per ms, downward flick
const OUT_MS = 220;

/**
 * Mobile bottom sheet — one component for filters, search, sign-in, share and action sheets.
 * Drag the handle/header down to dismiss (120px or a flick), tap the backdrop, or press Escape.
 * The content behind is scroll-locked; release short of the threshold springs back.
 */
export function Sheet({
  open,
  onClose,
  title,
  titleId,
  left,
  right,
  footer,
  children,
  full = false,
  variant = "sheet",
  className = "",
  label,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  /** id of an element inside the sheet that names it (when `title` is not used) */
  titleId?: string;
  left?: Slot;
  right?: Slot;
  footer?: Slot;
  children?: Slot;
  /** near full-height sheet (filters, search) */
  full?: boolean;
  /** "action" = iOS action sheet: floating groups, no white panel */
  variant?: "sheet" | "action";
  className?: string;
  label?: string;
}) {
  const uid = useId();
  const hid = titleId ?? (title ? `${uid}-t` : undefined);
  const panel = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const drag = useRef<{ id: number; y0: number; dy: number; lastY: number; lastT: number; v: number } | null>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  /** animate out, then tell the owner */
  const close = useCallback(() => {
    const p = panel.current;
    if (closing.current) return;
    closing.current = true;
    if (!p || reducedMotion()) {
      onCloseRef.current();
      return;
    }
    p.style.transition = `transform ${OUT_MS}ms cubic-bezier(.4,0,1,1)`;
    p.style.transform = "translateY(100%)";
    if (scrim.current) {
      scrim.current.style.transition = `opacity ${OUT_MS}ms ease`;
      scrim.current.style.opacity = "0";
    }
    window.setTimeout(() => onCloseRef.current(), OUT_MS);
  }, []);

  useEffect(() => {
    if (!open) return;
    closing.current = false;
    const unlock = lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prevFocus = document.activeElement as HTMLElement | null;
    panel.current?.focus({ preventScroll: true });
    return () => {
      unlock();
      window.removeEventListener("keydown", onKey);
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [open, close]);

  /* sheets only ever open after a user action, so there is no server render to match */
  if (!open || typeof document === "undefined") return null;

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest("button, a, input, select, textarea")) return;
    drag.current = { id: e.pointerId, y0: e.clientY, dy: 0, lastY: e.clientY, lastT: e.timeStamp, v: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    if (panel.current) panel.current.style.transition = "none";
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const p = panel.current;
    if (!d || !p || e.pointerId !== d.id) return;
    const dy = e.clientY - d.y0;
    const dt = Math.max(1, e.timeStamp - d.lastT);
    d.v = 0.8 * ((e.clientY - d.lastY) / dt) + 0.2 * d.v;
    d.lastY = e.clientY;
    d.lastT = e.timeStamp;
    d.dy = dy;
    /* rubber-band upwards, follow the finger downwards */
    const y = dy < 0 ? -Math.sqrt(-dy) * 2 : dy;
    p.style.transform = `translateY(${y}px)`;
    if (scrim.current) scrim.current.style.opacity = String(Math.max(0.2, 1 - Math.max(0, dy) / p.offsetHeight));
  };
  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const p = panel.current;
    drag.current = null;
    if (!d || !p || e.pointerId !== d.id) return;
    if (d.dy > DISMISS_PX || (d.dy > 24 && d.v > DISMISS_V)) {
      close();
      return;
    }
    /* spring back with a little overshoot */
    p.style.transition = "transform 420ms cubic-bezier(.25,1.4,.45,1)";
    p.style.transform = "";
    if (scrim.current) {
      scrim.current.style.transition = "opacity 200ms ease";
      scrim.current.style.opacity = "";
    }
  };
  const grab = { onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: onUp };

  const hasHead = title || left || right;
  return createPortal(
    <div className={`msh-ov${variant === "action" ? " act" : ""}`}>
      <div className="msh-scrim" ref={scrim} onClick={close} aria-hidden="true" />
      <div
        className={`msh${full ? " full" : ""}${variant === "action" ? " msh-action" : ""} ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={hid}
        aria-label={hid ? undefined : label}
        tabIndex={-1}
        ref={panel}
      >
        <div className="msh-grab" {...grab}>
          <span className="grab" aria-hidden="true" />
          {hasHead && (
            <div className="msh-head">
              <span className="msh-side"><SlotView s={left} close={close} /></span>
              {title ? <h2 id={hid}>{title}</h2> : <span />}
              <span className="msh-side r"><SlotView s={right} close={close} /></span>
            </div>
          )}
        </div>
        <div className="msh-body"><SlotView s={children} close={close} /></div>
        {footer && <div className="msh-foot"><SlotView s={footer} close={close} /></div>}
      </div>
    </div>,
    document.body,
  );
}

export interface SheetAction {
  label: string;
  onClick: () => void;
  destructive?: boolean;
  icon?: ReactNode;
}

/** iOS-style action sheet (e.g. "Sign out?") built on the same Sheet */
export function ActionSheet({
  open,
  onClose,
  title,
  message,
  actions,
  cancel = "Cancel",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actions: SheetAction[];
  cancel?: string;
}) {
  const uid = useId();
  return (
    <Sheet open={open} onClose={onClose} variant="action" titleId={title ? `${uid}-at` : undefined} label={title ? undefined : "Actions"}>
      {(close) => (
        <>
          <div className="as-group">
            {(title || message) && (
              <div className="as-head">
                {title && <b id={`${uid}-at`}>{title}</b>}
                {message && <span>{message}</span>}
              </div>
            )}
            {actions.map((a) => (
              <button
                key={a.label}
                type="button"
                className={`as-btn${a.destructive ? " danger" : ""}`}
                onClick={() => {
                  close();
                  window.setTimeout(a.onClick, OUT_MS);
                }}
              >
                {a.icon}
                {a.label}
              </button>
            ))}
          </div>
          <button type="button" className="as-btn as-cancel" onClick={close}>
            {cancel}
          </button>
        </>
      )}
    </Sheet>
  );
}
