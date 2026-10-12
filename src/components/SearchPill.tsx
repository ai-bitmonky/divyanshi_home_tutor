"use client";

import { useRouter } from "next/navigation";
import { useId } from "react";
import { LOCALITIES, SUBJECTS, filterTutors, DEFAULT_FILTERS, CLS_MAP } from "@/lib/data";
import { useApp } from "@/lib/store";
import { Icon } from "./Icons";
import { useToast } from "./Toast";
import { Tog } from "./ui";

const CLASS_BOARD = ["9–10 · CBSE", "11–12 · CBSE", "6–8 · CBSE", "9–10 · ICSE", "6–8 · State"];

/** Build the /tutors deep link from the hero search pill */
export function tutorsHref(p: { subject?: string; cls?: string; board?: string; locality?: string; mode?: string }) {
  const sp = new URLSearchParams();
  Object.entries(p).forEach(([k, v]) => v && sp.set(k, v));
  const qs = sp.toString();
  return qs ? `/tutors?${qs}` : "/tutors";
}

/** Desktop hero search pill: [Subject | Class/Board | Locality | Home/Online | Find tutors] */
export function SearchPill() {
  const { s, set } = useApp();
  const router = useRouter();
  const toast = useToast();
  const uid = useId();
  const lp = s.lp;
  const setLp = (patch: Partial<typeof lp>) => set({ lp: { ...lp, ...patch } });

  const find = () => {
    const [c, b] = lp.cls.split(" · ");
    const cls = CLS_MAP[c] ? c : "Any";
    const n = filterTutors({ ...DEFAULT_FILTERS, subject: lp.subject, mode: lp.mode, board: b || "Any", cls, locality: lp.locality }).length;
    router.push(tutorsHref({ subject: lp.subject, cls, board: b, locality: lp.locality, mode: lp.mode }));
    toast(`${n} ${lp.subject} tutors near ${lp.locality}`, "search", "/tutors");
  };

  const sel = (k: "subject" | "cls" | "locality", label: string, arr: string[]) => (
    <label className="sf" htmlFor={`${uid}-${k}`}>
      <span className="t-cap">{label}</span>
      <select id={`${uid}-${k}`} value={lp[k]} onChange={(e) => setLp({ [k]: e.target.value })}>
        {arr.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="spill" role="search">
      {sel("subject", "Subject", SUBJECTS)}
      {sel("cls", "Class · Board", CLASS_BOARD)}
      {sel("locality", "Locality", LOCALITIES)}
      <div className="sf sf-t">
        <span className="t-cap">Mode</span>
        <Tog
          items={[
            ["Home", ""],
            ["Online", ""],
          ]}
          value={lp.mode}
          onChange={(v) => setLp({ mode: v })}
          className="mini"
          ariaLabel="Mode"
        />
      </div>
      <button type="button" className="btn btn-p btn-lg" onClick={find}>
        <Icon name="search" size={18} stroke={2.2} /> Find tutors
      </button>
    </div>
  );
}
