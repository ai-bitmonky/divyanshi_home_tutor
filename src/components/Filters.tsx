"use client";

import { useId } from "react";
import { LOCALITIES, SORTS, SUBJECTS, filterTutors, inr, type Filters } from "@/lib/data";
import { useApp } from "@/lib/store";
import { appScrollTo } from "@/lib/native";
import { Icon } from "./Icons";
import { Sheet } from "./Sheet";
import { useToast } from "./Toast";
import { Button, ChipGroup, Tog } from "./ui";
import { Mobile } from "./Variant";

const DISTS = ["3", "5", "10"] as const;
const BOARDS = ["Any", "CBSE", "ICSE", "State"] as const;
const CLASSES = ["Any", "6–8", "9–10", "11–12"] as const;
const GENDERS = ["Any", "Male", "Female"] as const;
const LANGS = ["Any", "English", "Hindi"] as const;
const SUBJ_ALL = ["", ...SUBJECTS];
/** short labels for the mobile segmented control */
const SORT_SEG: readonly (readonly [Filters["sort"], "", string])[] = [
  ["rec", "", "Best"],
  ["near", "", "Nearest"],
  ["rating", "", "Rating"],
  ["low", "", "₹ Low"],
  ["high", "", "₹ High"],
];
const MODES = [
  ["Home", "home"],
  ["Online", "video"],
  ["Both", ""],
] as const;

/** Filters — desktop sidebar and mobile filter sheet share this body */
export function FiltersBody({ variant }: { variant: "desktop" | "mobile" }) {
  const { s, set, setF } = useApp();
  const toast = useToast();
  const f = s.f;
  const d = variant === "desktop";
  const uid = useId();
  const pct = (((f.price - 400) / 600) * 100).toFixed(1);
  return (
    <>
      {d ? (
        <div className="d-side-h">
          <b>
            <Icon name="sliders" size={18} /> Filters
          </b>
          <button
            type="button"
            className="link"
            onClick={() => {
              set({ f: { ...s.f, ...RESET } });
              toast("Filters reset", "refresh");
            }}
          >
            Reset
          </button>
        </div>
      ) : (
        <div className="f-sec">
          <div className="iw">
            <Icon name="search" size={18} />
            <input
              className="inp w"
              type="search"
              placeholder="Tutor, subject or locality"
              value={f.q}
              aria-label="Search tutors"
              onChange={(e) => setF("q", e.target.value, "sk")}
            />
          </div>
        </div>
      )}
      <div className="f-sec">
        <span className="lbl">Where should classes happen?</span>
        <Tog items={MODES} value={f.mode} onChange={(v) => setF("mode", v, "flip")} className="full" ariaLabel="Where should classes happen?" />
      </div>
      <div className="f-sec">
        <label className="lbl" htmlFor={`${uid}-loc`}>
          Locality
        </label>
        <div className="iw">
          <Icon name="pin" size={18} />
          <input
            id={`${uid}-loc`}
            className={`inp${d ? "" : " w"}`}
            value={f.locality}
            list={`${uid}-locs`}
            autoComplete="off"
            onChange={(e) => setF("locality", e.target.value, "sk")}
          />
          <datalist id={`${uid}-locs`}>
            {LOCALITIES.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
        </div>
        <div className="row between" style={{ marginTop: 10, flexWrap: "wrap" }}>
          <span className="t-sm muted">Within</span>
          <ChipGroup items={DISTS} value={f.dist} onChange={(v) => setF("dist", v, "sk")} suffix="km" ariaLabel="Distance" />
        </div>
      </div>
      <div className="f-sec">
        <span className="lbl">Board</span>
        <ChipGroup items={BOARDS} value={f.board as (typeof BOARDS)[number]} onChange={(v) => setF("board", v, "flip")} ariaLabel="Board" />
      </div>
      <div className="f-sec">
        <span className="lbl">Class</span>
        <ChipGroup items={CLASSES} value={f.cls as (typeof CLASSES)[number]} onChange={(v) => setF("cls", v, "flip")} ariaLabel="Class" />
      </div>
      {!d && (
        <div className="f-sec">
          <span className="lbl">Subject</span>
          <ChipGroup items={SUBJ_ALL} value={f.subject} onChange={(v) => setF("subject", v, "flip")} label={(v) => v || "All"} ariaLabel="Subject" />
        </div>
      )}
      <div className="f-sec">
        <div className="row between">
          <span className="lbl" style={{ margin: 0 }}>
            Max price per class
          </span>
          <span className="price-val">{inr(f.price)}</span>
        </div>
        <input
          type="range"
          className="range"
          min={400}
          max={1000}
          step={50}
          value={f.price}
          style={{ ["--p" as string]: `${pct}%` }}
          aria-label="Maximum price per 60-minute class"
          onChange={(e) => setF("price", Number(e.target.value), "")}
        />
        <div className="range-lbls">
          <span>₹400</span>
          <span>₹1,000</span>
        </div>
      </div>
      <div className="f-sec">
        <span className="lbl">Tutor preference</span>
        <ChipGroup items={GENDERS} value={f.gender as (typeof GENDERS)[number]} onChange={(v) => setF("gender", v, "flip")} ariaLabel="Tutor preference" />
      </div>
      <div className="f-sec">
        <span className="lbl">Teaches in</span>
        <ChipGroup items={LANGS} value={f.lang as (typeof LANGS)[number]} onChange={(v) => setF("lang", v, "flip")} ariaLabel="Teaches in" />
      </div>
      {d ? (
        <div className="f-sec" style={{ marginBottom: 0 }}>
          <label className="lbl" htmlFor={`${uid}-sort`}>
            Sort
          </label>
          <select id={`${uid}-sort`} className="inp" value={f.sort} onChange={(e) => setF("sort", e.target.value as Filters["sort"], "flip")}>
            {SORTS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="f-sec" style={{ marginBottom: 22 }}>
          <span className="lbl">Sort by</span>
          <Tog items={SORT_SEG} value={f.sort} onChange={(v) => setF("sort", v, "flip")} className="full seg5" ariaLabel="Sort by" />
        </div>
      )}
    </>
  );
}

const RESET: Partial<Filters> = { q: "", subject: "", price: 1000, mode: "Both", locality: "Sector 56", dist: "5", board: "Any", cls: "Any", gender: "Any", lang: "Any", sort: "rec" };

/** Mobile "Search" tab: tall bottom sheet over Find tutors */
export function FiltersSheet() {
  const { s, set } = useApp();
  const toast = useToast();
  const n = filterTutors(s.f).length;
  return (
    <Mobile>
      <Sheet
        open={s.filtersOpen}
        onClose={() => set({ filtersOpen: false })}
        full
        title="Search & filters"
        left={
          <button
            type="button"
            className="msh-link"
            onClick={() => {
              set({ f: { ...s.f, ...RESET } });
              toast("Filters reset", "refresh");
            }}
          >
            Reset
          </button>
        }
        right={(close) => (
          <button type="button" className="msh-x" aria-label="Close filters" onClick={close}>
            <Icon name="x" size={18} stroke={2.2} />
          </button>
        )}
        footer={(close) => (
          <Button
            block
            onClick={() => {
              close();
              toast(`${n} tutor${n === 1 ? "" : "s"} match your filters`, "search");
              appScrollTo(0, true);
            }}
          >
            {n ? `Show ${n} tutor${n === 1 ? "" : "s"}` : "No tutors — widen search"}
          </Button>
        )}
      >
        <FiltersBody variant="mobile" />
      </Sheet>
    </Mobile>
  );
}

export const FILTER_RESET = RESET;
