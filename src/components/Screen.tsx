"use client";

import { usePathname } from "next/navigation";
import { Component, type ReactNode } from "react";
import { TAB_ROUTES, isMobileMode, reducedMotion, routeDepth } from "@/lib/native";

/* =========================================================
   Native screen stack for the mobile version.
   <MobileScreen> is static markup (display:contents on desktop):
     .m-screen (fixed, the layer that slides) > .m-scroll (the only thing that scrolls)
   <ScreenNav> watches the pathname and, in the same commit as the route swap,
   snapshots the outgoing screen (getSnapshotBeforeUpdate) so it can slide/fade it out
   as a "ghost" while the new screen comes in. It also owns per-route scroll memory and
   the left-edge swipe-back gesture.
   ========================================================= */

export function MobileScreen({ children }: { children: ReactNode }) {
  return (
    <div className="m-screen">
      <div className="m-scroll">
        {/* left-edge grab strip for swipe-back (only active on screens with a back button) */}
        <div className="m-edge" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}

type Dir = "push" | "pop" | "fade" | "swipe";
interface Snap {
  node: HTMLElement;
  top: number;
  tab: Node | null;
}
interface NavSnap extends Snap {
  dir: Dir;
  from: string;
  to: string;
}

/** module-level navigation memory (survives re-renders, never persisted) */
const nav = {
  stack: [] as string[],
  mem: new Map<string, number>(), // scrollTop per route
  snaps: new Map<string, Snap>(), // last look of each route (swipe-back preview)
  popAt: 0, // time of the last popstate (browser / router.back)
  swipe: false, // a swipe-back gesture committed this navigation
};

const DUR = 260;
const EASE = "cubic-bezier(.2,.8,.2,1)";
const EDGE_TRIGGER = 60; // px dragged before release counts as "back"

function decide(from: string, to: string): Dir {
  if (nav.swipe) return "swipe";
  const df = routeDepth(from);
  const dt = routeDepth(to);
  const popped = performance.now() - nav.popAt < 1500;
  nav.popAt = 0;
  if (df === 1 && dt === 1) return "fade"; // tab ↔ tab: siblings
  if (popped) return dt > df ? "push" : "pop";
  if (nav.stack.length >= 2 && nav.stack[nav.stack.length - 2] === to) return "pop";
  return dt < df ? "pop" : "push";
}

function updateStack(dir: Dir, to: string) {
  const st = nav.stack;
  if (dir === "push") st.push(to);
  else if (dir === "fade") {
    if (st.length) st[st.length - 1] = to;
    else st.push(to);
  } else {
    const i = st.lastIndexOf(to);
    if (i >= 0) st.length = i + 1;
    else {
      st.pop();
      st.pop();
      st.push(to);
    }
  }
  if (st.length > 30) st.splice(0, st.length - 30);
}

const liveScroll = () => document.querySelector<HTMLElement>(".m-screen > .m-scroll");
const liveTabbar = () => document.querySelector<HTMLElement>("nav.tabbar:not(.m-ghost *):not(.m-under *)");

class ScreenNavInner extends Component<{ pathname: string }> {
  private finishFn: (() => void) | null = null;
  private timer = 0;
  private drag: { id: number; x0: number; y0: number; dx: number; on: boolean; lastX: number; lastT: number; v: number } | null = null;
  private under: HTMLElement | null = null;
  private swipeTimer = 0;

  componentDidMount() {
    nav.stack = [this.props.pathname];
    this.mark();
    window.addEventListener("popstate", this.onPop);
    document.addEventListener("pointerdown", this.onDown, { passive: true });
    document.addEventListener("pointermove", this.onMove, { passive: true });
    document.addEventListener("pointerup", this.onUp, { passive: true });
    document.addEventListener("pointercancel", this.onUp, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.onPop);
    document.removeEventListener("pointerdown", this.onDown);
    document.removeEventListener("pointermove", this.onMove);
    document.removeEventListener("pointerup", this.onUp);
    document.removeEventListener("pointercancel", this.onUp);
    this.finish();
  }

  onPop = () => {
    nav.popAt = performance.now();
  };

  /** route facts the CSS needs on the live scroller: tab bar padding, edge strip */
  mark() {
    const live = liveScroll();
    if (!live) return;
    live.toggleAttribute("data-tabs", TAB_ROUTES.includes(this.props.pathname));
  }

  /** end a running transition immediately */
  finish = () => {
    window.clearTimeout(this.timer);
    const f = this.finishFn;
    this.finishFn = null;
    f?.();
  };

  getSnapshotBeforeUpdate(prev: { pathname: string }): NavSnap | null {
    const from = prev.pathname;
    const to = this.props.pathname;
    if (from === to || !isMobileMode()) return null;
    this.finish();
    const live = liveScroll();
    if (!live) return null;
    nav.mem.set(from, live.scrollTop);
    const tab = liveTabbar();
    return {
      dir: decide(from, to),
      from,
      to,
      node: live.cloneNode(true) as HTMLElement,
      top: live.scrollTop,
      tab: tab ? tab.cloneNode(true) : null,
    };
  }

  componentDidUpdate(_p: unknown, _s: unknown, snap: NavSnap | null) {
    this.mark();
    if (!snap) return;
    const { dir, from, to, node, top, tab } = snap;
    const live = liveScroll();
    const screen = live?.parentElement;
    if (!live || !screen) return;
    /* runs after Next's own scroll handling, so this wins: push = top, back/tab = where you left it */
    live.scrollTop = dir === "push" ? (live.querySelector(".m-chat") ? live.scrollHeight : 0) : (nav.mem.get(to) ?? 0);
    nav.snaps.set(from, { node, top, tab });
    if (nav.snaps.size > 8) nav.snaps.delete(nav.snaps.keys().next().value as string);
    updateStack(dir, to);

    if (dir === "swipe") {
      nav.swipe = false;
      this.endSwipe();
      return;
    }
    if (reducedMotion()) return;

    const realTab = dir !== "fade" && !snap.tab ? liveTabbar() : null;
    const ghost = document.createElement("div");
    ghost.className = `m-ghost m-ghost-${dir}`;
    ghost.setAttribute("aria-hidden", "true");
    ghost.inert = true;
    ghost.appendChild(node);
    if (tab && dir === "push") ghost.appendChild(tab);
    screen.parentElement?.appendChild(ghost);
    node.scrollTop = top;

    const cls = `m-in-${dir}`;
    screen.classList.add("m-anim", cls);
    screen.dataset.anim = dir;
    realTab?.classList.add(cls);
    this.finishFn = () => {
      ghost.remove();
      screen.classList.remove("m-anim", cls);
      delete screen.dataset.anim;
      realTab?.classList.remove(cls);
    };
    this.timer = window.setTimeout(this.finish, (dir === "fade" ? 180 : DUR) + 40);
  }

  /* ---------------- left-edge swipe back ---------------- */
  onDown = (e: PointerEvent) => {
    if (!isMobileMode() || e.button > 0 || this.drag) return;
    const t = e.target as Element | null;
    if (!t?.closest?.(".m-screen .m-edge")) return;
    if (!document.querySelector(".m-screen [data-back]")) return;
    this.finish();
    this.drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, on: false, lastX: e.clientX, lastT: e.timeStamp, v: 0 };
    try {
      (t as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* capture is best-effort */
    }
  };

  onMove = (e: PointerEvent) => {
    const d = this.drag;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (!d.on) {
      if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
        this.drag = null; // a vertical scroll, not ours
        return;
      }
      if (dx < 8) return;
      d.on = true;
      this.beginSwipe();
    }
    const dt = Math.max(1, e.timeStamp - d.lastT);
    d.v = 0.8 * ((e.clientX - d.lastX) / dt) + 0.2 * d.v;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    d.dx = Math.max(0, dx);
    this.setSwipe(d.dx, false);
  };

  onUp = (e: PointerEvent) => {
    const d = this.drag;
    if (!d || e.pointerId !== d.id) return;
    this.drag = null;
    if (!d.on) return;
    if (e.type !== "pointercancel" && (d.dx > EDGE_TRIGGER || d.v > 0.5)) this.commitSwipe();
    else this.cancelSwipe();
  };

  beginSwipe() {
    const screen = document.querySelector<HTMLElement>(".m-screen");
    if (!screen) return;
    const under = document.createElement("div");
    under.className = "m-under";
    under.setAttribute("aria-hidden", "true");
    under.inert = true;
    const prev = nav.stack[nav.stack.length - 2];
    const snap = prev ? nav.snaps.get(prev) : undefined;
    if (snap) {
      under.appendChild(snap.node);
      if (snap.tab) under.appendChild(snap.tab);
    }
    screen.parentElement?.insertBefore(under, screen);
    if (snap) snap.node.scrollTop = snap.top;
    this.under = under;
    screen.classList.add("m-drag");
    this.setSwipe(0, false);
  }

  setSwipe(x: number, animate: boolean) {
    const screen = document.querySelector<HTMLElement>(".m-screen");
    const under = this.under;
    if (!screen) return;
    const w = window.innerWidth;
    const tr = animate ? `transform 220ms ${EASE}` : "none";
    screen.style.transition = tr;
    screen.style.transform = `translate3d(${x}px,0,0)`;
    if (under) {
      under.style.transition = animate ? `transform 220ms ${EASE}, --dim 220ms` : "none";
      under.style.transform = `translate3d(${-30 + (30 * x) / w}%,0,0)`;
      under.style.setProperty("--dim", String(0.14 * (1 - x / w)));
    }
  }

  commitSwipe() {
    this.setSwipe(window.innerWidth, true);
    window.setTimeout(() => {
      nav.swipe = true;
      document.querySelector<HTMLElement>(".m-screen [data-back]")?.click();
      /* safety: if nothing navigated, put the screen back */
      this.swipeTimer = window.setTimeout(() => {
        if (nav.swipe) {
          nav.swipe = false;
          this.endSwipe();
        }
      }, 1500);
    }, 220);
  }

  cancelSwipe() {
    this.setSwipe(0, true);
    window.setTimeout(() => this.endSwipe(), 230);
  }

  endSwipe() {
    window.clearTimeout(this.swipeTimer);
    const screen = document.querySelector<HTMLElement>(".m-screen");
    if (screen) {
      screen.style.transition = "";
      screen.style.transform = "";
      screen.classList.remove("m-drag");
    }
    this.under?.remove();
    this.under = null;
  }

  render() {
    return null;
  }
}

/** Mount once, after <main> (so its commit-phase work runs after the page's own). Needs a Suspense boundary (reads the URL). */
export function ScreenNav() {
  const pathname = usePathname();
  return <ScreenNavInner pathname={pathname} />;
}
