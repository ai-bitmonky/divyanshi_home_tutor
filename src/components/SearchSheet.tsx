"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { LOCALITIES, SUBJECTS, filterTutors } from "@/lib/data";
import { useApp } from "@/lib/store";
import { FILTER_RESET } from "./Filters";
import { Icon } from "./Icons";
import { Sheet } from "./Sheet";
import { useToast } from "./Toast";
import { Button, ChipGroup, Tog } from "./ui";
import { Mobile } from "./Variant";

const SUBJ_ALL = ["", ...SUBJECTS];
const CLASSES = ["Any", "6–8", "9–10", "11–12"] as const;
const BOARDS = ["Any", "CBSE", "ICSE", "State"] as const;
const LOCS = LOCALITIES.slice(0, 5);

/** Mobile full-screen search sheet (opened from the welcome search field) */
export function SearchSheet() {
  const { s, set, setF } = useApp();
  const router = useRouter();
  const toast = useToast();
  const q = useRef<HTMLInputElement>(null);
  const open = s.searchSheet;

  useEffect(() => {
    if (open) q.current?.focus({ preventScroll: true });
  }, [open]);

  const f = s.f;
  const n = filterTutors(f).length;
  return (
    <Mobile>
      <Sheet
        open={open}
        onClose={() => set({ searchSheet: false })}
        full
        title="Find a tutor"
        left={
          <button
            type="button"
            className="msh-link"
            onClick={() => {
              set({ f: { ...f, ...FILTER_RESET } });
              toast("Filters reset", "refresh");
            }}
          >
            Reset
          </button>
        }
        right={(close) => (
          <button type="button" className="msh-x" aria-label="Close search" onClick={close}>
            <Icon name="x" size={18} stroke={2.2} />
          </button>
        )}
        footer={(close) => (
          <Button
            block
            onClick={() => {
              close();
              router.push("/tutors");
            }}
          >
            {n ? `Show ${n} tutor${n === 1 ? "" : "s"}` : "No tutors — widen search"}
          </Button>
        )}
      >
        <div className="pb">
            <div className="f-sec">
              <div className="iw">
                <Icon name="search" size={18} />
                <input ref={q} className="inp w" type="search" placeholder="Tutor, subject or locality" value={f.q} aria-label="Search" onChange={(e) => setF("q", e.target.value)} />
              </div>
            </div>
            <div className="f-sec">
              <span className="lbl">Subject</span>
              <ChipGroup items={SUBJ_ALL} value={f.subject} onChange={(v) => setF("subject", v)} label={(v) => v || "All"} ariaLabel="Subject" />
            </div>
            <div className="f-sec">
              <span className="lbl">Class</span>
              <ChipGroup items={CLASSES} value={f.cls as (typeof CLASSES)[number]} onChange={(v) => setF("cls", v)} ariaLabel="Class" />
            </div>
            <div className="f-sec">
              <span className="lbl">Board</span>
              <ChipGroup items={BOARDS} value={f.board as (typeof BOARDS)[number]} onChange={(v) => setF("board", v)} ariaLabel="Board" />
            </div>
            <div className="f-sec">
              <span className="lbl">Locality</span>
              <ChipGroup items={LOCS} value={f.locality} onChange={(v) => setF("locality", v)} ariaLabel="Locality" />
            </div>
            <div className="f-sec">
              <span className="lbl">Classes at</span>
              <Tog
                items={[
                  ["Home", "home"],
                  ["Online", "video"],
                  ["Both", ""],
                ]}
                value={f.mode}
                onChange={(v) => setF("mode", v)}
                className="full"
                ariaLabel="Classes at"
              />
            </div>
          </div>
      </Sheet>
    </Mobile>
  );
}
