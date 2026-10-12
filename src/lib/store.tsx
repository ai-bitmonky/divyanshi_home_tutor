"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import {
  CONVO_ORDER,
  DEFAULT_FILTERS,
  initialConvos,
  type Convo,
  type Filters,
  type Msg,
  type Pick3,
  type PlanSize,
} from "./data";

/* =========================================================
   App state — one reducer, persisted to localStorage under one key.
   The server and the first client render always use the defaults;
   saved state is applied in an effect after mount (no hydration mismatch).
   ========================================================= */

export type AuthStep = "signup" | "otp" | "login";

export interface BookingDraft {
  student: string;
  cls: string;
  board: string;
  subject: string;
  mode: "Home" | "Online";
  goals: string[];
  info: string;
  phone: string;
}

export interface AppState {
  hydrated: boolean;
  loggedIn: boolean;
  auth: { open: boolean; step: AuthStep; kind: "demo" | "login"; email: boolean; mob: string };
  /* find tutors */
  f: Filters;
  /** bumps when a search/distance change should show the 400 ms skeleton */
  skSeq: number;
  /** bumps when a chip change should FLIP re-flow the grid */
  flipSeq: number;
  filtersOpen: boolean;
  searchSheet: boolean;
  details: boolean;
  lp: { subject: string; cls: string; locality: string; mode: "Home" | "Online" };
  loc: "approx" | "precise";
  /* tutor + booking */
  tutor: string;
  pick: Pick3;
  favs: Record<string, boolean>;
  rvf: string;
  bk: BookingDraft;
  bookTutor: string;
  bookStep: 1 | 2 | 3 | 4;
  booked: boolean;
  /* plans + payment */
  plan: PlanSize;
  pay: "upi" | "card" | "net";
  upiApp: "gpay" | "phonepe" | "paytm";
  paid: boolean;
  /* classes dashboard */
  role: "parent" | "student";
  hw: Record<string, boolean>;
  rateOpen: boolean;
  rating: number;
  rated: boolean;
  /* chat */
  convo: string;
  convos: Record<string, Convo>;
  corder: string[];
  typing: string | null;
  cannedI: number;
  /* AI */
  ai: { open: boolean; msgs: Msg[]; typing: boolean };
  /* my profile */
  pf: {
    tab: string;
    edit: boolean;
    grade: string;
    board: string;
    target: string;
    prefs: { sms: boolean; wa: boolean; mail: boolean; report: boolean };
  };
}

export const initialState = (): AppState => ({
  hydrated: false,
  loggedIn: false,
  auth: { open: false, step: "signup", kind: "demo", email: false, mob: "" },
  f: { ...DEFAULT_FILTERS },
  skSeq: 0,
  flipSeq: 0,
  filtersOpen: false,
  searchSheet: false,
  details: false,
  lp: { subject: "Maths", cls: "9–10 · CBSE", locality: "Sector 56", mode: "Home" },
  loc: "precise",
  tutor: "ashish",
  pick: { d: 0, p: 2, t: 1 },
  favs: {},
  rvf: "All",
  bk: { student: "Divyanshi Agrahari", cls: "Class 12", board: "CBSE", subject: "Physics", mode: "Home", goals: ["Board exam prep"], info: "", phone: "98723 46350" },
  bookTutor: "ashish",
  bookStep: 1,
  booked: false,
  plan: 8,
  pay: "upi",
  upiApp: "gpay",
  paid: false,
  role: "parent",
  hw: { a: false, b: true, c: false },
  rateOpen: false,
  rating: 0,
  rated: false,
  convo: "ashish",
  convos: initialConvos(),
  corder: [...CONVO_ORDER],
  typing: null,
  cannedI: 0,
  ai: { open: false, msgs: [], typing: false },
  pf: { tab: "edu", edit: false, grade: "Class 12", board: "CBSE", target: "Boards", prefs: { sms: true, wa: true, mail: false, report: true } },
});

type Action =
  | { type: "hydrate"; saved: Partial<AppState> | null }
  | { type: "set"; patch: Partial<AppState> }
  | { type: "update"; fn: (s: AppState) => AppState }
  | { type: "setF"; key: keyof Filters; value: Filters[keyof Filters]; how?: "sk" | "flip" | "" }
  | { type: "reset" };

function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case "hydrate": {
      if (!a.saved) return { ...s, hydrated: true };
      const d = initialState();
      const v = a.saved;
      return {
        ...d,
        ...v,
        auth: { ...d.auth, ...(v.auth ?? {}), open: false },
        f: { ...d.f, ...(v.f ?? {}) },
        lp: { ...d.lp, ...(v.lp ?? {}) },
        bk: { ...d.bk, ...(v.bk ?? {}) },
        pf: { ...d.pf, ...(v.pf ?? {}), prefs: { ...d.pf.prefs, ...(v.pf?.prefs ?? {}) } },
        ai: { ...d.ai, ...(v.ai ?? {}), typing: false },
        convos: { ...d.convos, ...(v.convos ?? {}) },
        hydrated: true,
        typing: null,
        skSeq: 0,
        flipSeq: 0,
        filtersOpen: false,
        searchSheet: false,
      };
    }
    case "set":
      return { ...s, ...a.patch };
    case "update":
      return a.fn(s);
    case "setF": {
      const f = { ...s.f, [a.key]: a.value } as Filters;
      return {
        ...s,
        f,
        skSeq: a.how === "sk" ? s.skSeq + 1 : s.skSeq,
        flipSeq: a.how === "flip" ? s.flipSeq + 1 : s.flipSeq,
      };
    }
    case "reset":
      return { ...initialState(), hydrated: true };
  }
}

const KEY = "tutorforme-state-v1";
const TRANSIENT: (keyof AppState)[] = ["hydrated", "skSeq", "flipSeq", "filtersOpen", "searchSheet", "typing"];

interface Ctx {
  s: AppState;
  set: (patch: Partial<AppState>) => void;
  update: (fn: (s: AppState) => AppState) => void;
  setF: <K extends keyof Filters>(key: K, value: Filters[K], how?: "sk" | "flip" | "") => void;
  reset: () => void;
}

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, dispatch] = useReducer(reducer, undefined, initialState);
  const first = useRef(true);

  useEffect(() => {
    let saved: Partial<AppState> | null = null;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) saved = JSON.parse(raw) as Partial<AppState>;
    } catch {
      saved = null;
    }
    dispatch({ type: "hydrate", saved });
  }, []);

  useEffect(() => {
    if (!s.hydrated) return;
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      const out: Partial<AppState> = { ...s };
      TRANSIENT.forEach((k) => delete out[k]);
      window.localStorage.setItem(KEY, JSON.stringify(out));
    } catch {
      /* storage blocked — app still works in memory */
    }
  }, [s]);

  const set = useCallback((patch: Partial<AppState>) => dispatch({ type: "set", patch }), []);
  const update = useCallback((fn: (s: AppState) => AppState) => dispatch({ type: "update", fn }), []);
  const setF = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K], how: "sk" | "flip" | "" = "") => dispatch({ type: "setF", key, value, how }),
    [],
  );
  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    dispatch({ type: "reset" });
  }, []);

  const value = useMemo(() => ({ s, set, update, setF, reset }), [s, set, update, setF, reset]);
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useApp(): Ctx {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useApp must be used inside <StoreProvider>");
  return c;
}
