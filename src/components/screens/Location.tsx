"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useApp } from "@/lib/store";
import { Icon } from "../Icons";
import { MapApprox, MapPrecise } from "../Illustration";
import { useToast } from "../Toast";
import { TutorsScreen } from "./Tutors";

/** Optional location permission dialog over Find tutors — reachable by URL only; every choice (incl. "Don't allow") continues to /tutors */
export function LocationScreen() {
  const { s, set } = useApp();
  const router = useRouter();
  const toast = useToast();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    box.current?.querySelector<HTMLButtonElement>(".perm-opts button")?.focus({ preventScroll: true });
    /* optional: Escape (like "Don't allow") skips straight to the tutor list */
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && router.replace("/tutors");
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  const allow = (msg: string) => {
    router.replace("/tutors");
    toast(msg, "pin", "/tutors");
  };
  const opts: [string, string][] = [
    ["WHILE USING THIS APP", "Showing tutors near Sector 56"],
    ["ONLY THIS TIME", "Location shared for this visit only"],
    ["DON'T ALLOW", "Showing tutors across Gurgaon"],
  ];
  return (
    <>
      <TutorsScreen />
      <div className="ov perm-ov">
        <div className="scrim" aria-hidden="true" />
        <div className="perm" role="dialog" aria-modal="true" aria-labelledby="permT" ref={box}>
          <div className="perm-pin">
            <Icon name="pin" size={26} />
          </div>
          <h2 id="permT">
            Allow <b>TutorForMe</b> to access this device&apos;s location?
          </h2>
          <div className="perm-maps">
            <button type="button" className={`pmap${s.loc === "approx" ? " on" : ""}`} aria-pressed={s.loc === "approx"} onClick={() => set({ loc: "approx" })}>
              <MapApprox />
              <span>Approximate</span>
            </button>
            <button type="button" className={`pmap${s.loc === "precise" ? " on" : ""}`} aria-pressed={s.loc === "precise"} onClick={() => set({ loc: "precise" })}>
              <MapPrecise />
              <span>Precise</span>
            </button>
          </div>
          <div className="perm-opts">
            {opts.map(([l, m]) => (
              <button key={l} type="button" onClick={() => allow(m)}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
