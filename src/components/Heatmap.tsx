"use client";

import { DAYS, PERIODS, PTIMES, dateLabel, nextSlots } from "@/lib/data";
import { useApp } from "@/lib/store";
import { Icon } from "./Icons";
import { useToast } from "./Toast";

/** Availability heat-map — 7 days × 4 slots, teal intensity = open slots */
export function Heatmap({ heat }: { heat: number[][] }) {
  const { s, set } = useApp();
  const p = s.pick;
  return (
    <>
      <div className="hm" role="group" aria-label="Open demo slots for the next 7 days">
        <span />
        {DAYS.map((d) => (
          <span key={d.dd} className="hm-d">
            {d.wd}
            <b>{d.dd}</b>
          </span>
        ))}
        {PERIODS.map(([n, r], pi) => [
          <span key={`p${pi}`} className="hm-p">
            {n}
            <small>{r}</small>
          </span>,
          ...DAYS.map((d, di) => {
            const v = heat[di][pi];
            const sel = p.d === di && p.p === pi;
            return (
              <button
                key={`${di}-${pi}`}
                type="button"
                className={`hm-c l${v}${sel ? " sel" : ""}`}
                disabled={!v}
                aria-pressed={sel}
                aria-label={`${d.wd} ${d.dd} Oct, ${n}: ${v ? `${v} open slot${v > 1 ? "s" : ""}` : "no open slots"}`}
                onClick={() => set({ pick: { d: di, p: pi, t: 0 } })}
              >
                {v || ""}
              </button>
            );
          }),
        ])}
      </div>
      <div className="hm-leg" aria-hidden="true">
        <i className="l0" />
        <span>None</span>
        <i className="l1" />
        <i className="l2" />
        <i className="l3" />
        <span>More open slots</span>
      </div>
    </>
  );
}

export function TimeChips({ heat }: { heat: number[][] }) {
  const { s, set } = useApp();
  const p = s.pick;
  const n = heat[p.d][p.p];
  return (
    <>
      <div className="lbl" style={{ marginTop: 18 }}>
        {DAYS[p.d].wd} {DAYS[p.d].dd} Oct · {PERIODS[p.p][0]} — pick a time
      </div>
      <div className="chips" role="group" aria-label="Start time">
        {PTIMES[p.p].slice(0, n).map((tm, i) => (
          <button key={tm} type="button" className={`chip${p.t === i ? " on" : ""}`} aria-pressed={p.t === i} onClick={() => set({ pick: { ...p, t: i } })}>
            <Icon name="clock" size={15} />
            {tm}
          </button>
        ))}
      </div>
    </>
  );
}

/** Next 3 open slots as chips */
export function NextSlotChips({ heat }: { heat: number[][] }) {
  const { s, set } = useApp();
  const toast = useToast();
  return (
    <div className="nslots">
      {nextSlots(heat).map((x) => {
        const on = s.pick.d === x.d && s.pick.p === x.p && s.pick.t === x.t;
        return (
          <button
            key={`${x.d}-${x.p}`}
            type="button"
            className={`nslot${on ? " on" : ""}`}
            aria-pressed={on}
            onClick={() => {
              set({ pick: x });
              toast(`Slot picked: ${dateLabel(x)}`, "calendar");
            }}
          >
            <span>
              {DAYS[x.d].wd} {DAYS[x.d].dd} Oct
            </span>
            <b>{PTIMES[x.p][x.t]}</b>
          </button>
        );
      })}
    </div>
  );
}

export function Picked() {
  const { s } = useApp();
  return (
    <div className="picked">
      <Icon name="calendar" size={18} />
      <span>
        Demo slot: <b>{dateLabel(s.pick)}</b> · 60 min
      </span>
    </div>
  );
}
