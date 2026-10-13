"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CLS_MAP, SUBJECTS, filterTutors, type Filters } from "@/lib/data";
import { useReducedMotion } from "@/lib/hooks";
import { useApp } from "@/lib/store";
import { FILTER_RESET, FiltersBody, FiltersSheet } from "../Filters";
import { EmptyIllustration } from "../Illustration";
import { Icon } from "../Icons";
import { Avatar } from "../Portrait";
import { Skeletons } from "../Skeleton";
import { useToast } from "../Toast";
import { TutorCard } from "../TutorCard";
import { TabHead } from "../ui";
import { Desktop, Mobile } from "../Variant";

/** Applies ?subject=&board=&cls=&locality=&mode= deep links (hero search pill) to the filters, once state is hydrated. */
export function SearchParamsSync() {
  const sp = useSearchParams();
  const { s, update } = useApp();
  const key = sp.toString();
  const hydrated = s.hydrated;
  useEffect(() => {
    if (!hydrated || !key) return;
    const p = new URLSearchParams(key);
    const patch: Partial<Filters> = {};
    const subject = p.get("subject");
    if (subject !== null) patch.subject = SUBJECTS.includes(subject) ? subject : "";
    const board = p.get("board");
    if (board) patch.board = ["CBSE", "ICSE", "State"].includes(board) ? board : "Any";
    const cls = p.get("cls");
    if (cls) patch.cls = CLS_MAP[cls] ? cls : "Any";
    const loc = p.get("locality");
    if (loc) patch.locality = loc;
    const mode = p.get("mode");
    if (mode === "Home" || mode === "Online" || mode === "Both") patch.mode = mode;
    update((st) => ({ ...st, f: { ...st.f, ...patch }, flipSeq: st.flipSeq + 1 }));
  }, [key, hydrated, update]);
  return null;
}

/** Card grid: FLIP re-flow on chip changes, 400 ms skeleton on search/distance changes, empty state. */
function TutorGrid({ className }: { className: string }) {
  const { s, set, setF } = useApp();
  const toast = useToast();
  const rm = useReducedMotion();
  const list = filterTutors(s.f);
  const [doneSeq, setDoneSeq] = useState(0);
  const loading = !rm && s.skSeq !== doneSeq;
  const ref = useRef<HTMLDivElement>(null);
  const prev = useRef<Map<string, { x: number; y: number }>>(new Map());
  const lastFlip = useRef(s.flipSeq);

  useEffect(() => {
    if (s.skSeq === doneSeq) return;
    const id = setTimeout(() => setDoneSeq(s.skSeq), 400);
    return () => clearTimeout(id);
  }, [s.skSeq, doneSeq]);

  const order = list.map((t) => t.id).join(",");
  useLayoutEffect(() => {
    const g = ref.current;
    if (!g) return;
    const now = new Map<string, { x: number; y: number }>();
    const els = Array.from(g.querySelectorAll<HTMLElement>("[data-tid]"));
    els.forEach((el) => now.set(el.dataset.tid as string, { x: el.offsetLeft, y: el.offsetTop }));
    if (lastFlip.current !== s.flipSeq && !rm) {
      els.forEach((el) => {
        const f = prev.current.get(el.dataset.tid as string);
        const l = now.get(el.dataset.tid as string)!;
        if (f) {
          const dx = f.x - l.x;
          const dy = f.y - l.y;
          if (dx || dy) el.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }], { duration: 320, easing: "cubic-bezier(.2,.8,.2,1)" });
        } else el.animate([{ opacity: 0, transform: "scale(.96)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: "cubic-bezier(.2,.8,.2,1)" });
      });
    }
    lastFlip.current = s.flipSeq;
    prev.current = now;
  }, [order, s.flipSeq, loading, rm]);

  const near = +s.f.dist < 10;
  return (
    <div className={`${className} stag run`} ref={ref} aria-busy={loading}>
      {loading ? (
        <Skeletons n={Math.max(2, Math.min(4, list.length || 2))} />
      ) : list.length ? (
        list.map((t, i) => <TutorCard key={t.id} t={t} style={{ ["--i" as string]: Math.min(i, 7) }} />)
      ) : (
        <div className="empty" style={{ gridColumn: "1/-1" }}>
          <EmptyIllustration />
          <b>No tutors match.</b>
          <p>{near ? `Nothing within ${s.f.dist} km. Widen to 10 km?` : "Try removing a filter."}</p>
          <div className="row" style={{ justifyContent: "center", marginTop: 16, gap: 8, flexWrap: "wrap" }}>
            {near && (
              <button
                type="button"
                className="btn btn-p btn-sm"
                onClick={() => {
                  setF("dist", "10", "sk");
                  toast("Showing tutors within 10 km", "route");
                }}
              >
                <Icon name="route" size={16} /> Widen to 10 km
              </button>
            )}
            <button
              type="button"
              className="btn btn-s btn-sm"
              onClick={() => {
                set({ f: { ...s.f, ...FILTER_RESET } });
                toast("Filters reset", "refresh");
              }}
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function QuickChips({ scroll }: { scroll?: boolean }) {
  const { s, setF } = useApp();
  return (
    <div className={`chips${scroll ? " scroll" : ""}`} role="group" aria-label="Subject">
      {["", ...SUBJECTS.slice(0, 5)].map((v) => (
        <button key={v || "all"} type="button" className={`chip${s.f.subject === v ? " on" : ""}`} aria-pressed={s.f.subject === v} onClick={() => setF("subject", v, "flip")}>
          {v || "All subjects"}
        </button>
      ))}
    </div>
  );
}

function DesktopTutors() {
  const { s, setF } = useApp();
  const n = filterTutors(s.f).length;
  return (
    <div className="wrap">
      <div className="d-home">
        <aside className="d-side" aria-label="Filters">
          <FiltersBody variant="desktop" />
        </aside>
        <section aria-labelledby="ft-h">
          <div className="d-top">
            <div>
              <div className="t-cap">Good morning, Divyanshi</div>
              <h1 className="d-h1" id="ft-h" style={{ marginTop: 4 }}>
                Find your tutor
              </h1>
              <p className="d-sub">Verified home tutors near {s.f.locality}, Gurgaon</p>
            </div>
            <span className="badge badge-t" style={{ height: 32, padding: "0 12px" }}>
              <Icon name="shield" size={15} /> Every tutor is ID-verified
            </span>
          </div>
          <div className="d-search">
            <div className="iw">
              <Icon name="search" size={20} />
              <input
                className="inp w"
                type="search"
                placeholder="Search by tutor, subject or locality…"
                value={s.f.q}
                aria-label="Search tutors"
                onChange={(e) => setF("q", e.target.value, "sk")}
              />
            </div>
          </div>
          <QuickChips />
          <div className="d-count">
            <span aria-live="polite">
              <b>
                {n} tutor{n === 1 ? "" : "s"}
              </b>{" "}
              within {s.f.dist} km of {s.f.locality}, Gurgaon
            </span>
            <span className="row" style={{ gap: 6 }}>
              <Icon name="clock" size={15} /> Free demo within 48 hours
            </span>
          </div>
          <TutorGrid className="tgrid" />
          <Link href="/ai" className="promo" style={{ marginTop: 24, padding: "20px 24px" }}>
            <span className="pic">
              <Icon name="sparkle" size={22} />
            </span>
            <span style={{ flex: 1 }}>
              <b>Not sure who to pick?</b>
              <span>Ask AI Assist to match you with a tutor in under a minute.</span>
            </span>
            <span className="btn btn-w btn-sm" style={{ position: "relative", zIndex: 1 }}>
              Try AI Assist <Icon name="arrowR" size={16} />
            </span>
          </Link>
        </section>
      </div>
    </div>
  );
}

function MobileTutors() {
  const { s, set, setF } = useApp();
  const toast = useToast();
  const n = filterTutors(s.f).length;
  return (
    <div className="m-wrap">
      <TabHead
        title="Find tutors"
        actions={
          <button type="button" className="icbtn" aria-label="Notifications" onClick={() => toast("No new notifications", "bell")}>
            <Icon name="bell" size={22} />
          </button>
        }
      />
      <div className="m-home-top">
        <button type="button" className="det-row" aria-expanded={s.details} onClick={() => set({ details: !s.details })}>
          <span className="pinb">
            <Icon name="pin" size={20} />
          </span>
          <span className="dt">
            <b>
              Your details{" "}
              <span style={{ display: "inline-block", transition: "transform .2s", transform: `rotate(${s.details ? 180 : 0}deg)` }}>
                <Icon name="chevD" size={16} stroke={2.2} />
              </span>
            </b>
            <span>Divyanshi · Class 12 · CBSE · {s.f.locality}, Gurgaon</span>
          </span>
          <Avatar ini="DA" size={40} g={4} label="Divyanshi Agrahari" />
        </button>
        {s.details && (
          <div className="det-panel">
            <div>
              Student<b>Divyanshi A.</b>
            </div>
            <div>
              Class<b>Class 12 · CBSE</b>
            </div>
            <div>
              Location<b>{s.f.locality}, Gurgaon</b>
            </div>
            <div>
              Looking for<b>Physics, Chemistry</b>
            </div>
          </div>
        )}
        <div className="search-row">
          <div className="iw">
            <Icon name="search" size={18} />
            <input className="inp w" type="search" placeholder="Tutor, subject or locality" value={s.f.q} aria-label="Search tutors" onChange={(e) => setF("q", e.target.value, "sk")} />
          </div>
          <button type="button" className="fbtn" aria-label="Open filters" onClick={() => set({ filtersOpen: true })}>
            <Icon name="sliders" size={20} />
            <span className="fdot" />
          </button>
        </div>
        <div className="qrow">
          <QuickChips scroll />
        </div>
        <Link href="/ai" className="promo">
          <span className="pic">
            <Icon name="sparkle" size={22} />
          </span>
          <span>
            <b>Free demo · ₹0 · No card needed</b>
            <span>Not sure who to pick? Ask AI Assist to match you.</span>
          </span>
        </Link>
        <h2 className="sec-t">
          Tutors near you <small aria-live="polite">{n} found</small>
        </h2>
      </div>
      <TutorGrid className="m-grid" />
      <FiltersSheet />
    </div>
  );
}

export function TutorsScreen() {
  return (
    <>
      <Desktop>
        <DesktopTutors />
      </Desktop>
      <Mobile>
        <MobileTutors />
      </Mobile>
    </>
  );
}

