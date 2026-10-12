"use client";

import { useId, useState } from "react";
import { HOW_ILLUS, WELCOME_ILLUS } from "@/lib/illustrations";

/** Mobile welcome: student at a desk in an Indian home (toran over the window) */
export function WelcomeIllustration() {
  return (
    <svg
      className="illus"
      viewBox="0 0 320 220"
      role="img"
      aria-label="A student studying at a desk at home"
      dangerouslySetInnerHTML={{ __html: WELCOME_ILLUS }}
    />
  );
}

const HOTS = [
  { x: 33, y: 17, t: "1 · Search", d: "Pick subject, class and locality. See ID-verified tutors near you." },
  { x: 54, y: 68, t: "2 · Free demo", d: "The tutor comes home for the first class. ₹0, no card needed." },
  { x: 87, y: 61, t: "3 · Pay after", d: "Happy with the tutor? Pay by UPI for 4, 8 or 12 classes a month." },
  { x: 53, y: 20, t: "4 · Track", d: "Weekly report, attendance and homework — all in one place." },
];

/** "How it works" scene with 4 hotspots (search → demo → pay → track) */
export function HowIllustration() {
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId();
  return (
    <div className="how-ill">
      <svg
        viewBox="0 0 560 380"
        role="img"
        aria-label="A tutor teaching a child at home while a parent pays on a phone and a progress chart hangs on the wall"
        dangerouslySetInnerHTML={{ __html: HOW_ILLUS }}
      />
      {HOTS.map((h, i) => (
        <button
          key={h.t}
          type="button"
          className={`hs${open === i ? " open" : ""}`}
          style={{ left: `${h.x}%`, top: `${h.y}%` }}
          aria-label={h.t}
          aria-describedby={`${uid}-hs${i}`}
          aria-expanded={open === i}
          onClick={() => setOpen(open === i ? null : i)}
        >
          {i + 1}
          <span className="hs-tip" role="tooltip" id={`${uid}-hs${i}`}>
            <b>{h.t}</b>
            {h.d}
          </span>
        </button>
      ))}
    </div>
  );
}

/** Empty state: pin + widening radius */
export function EmptyIllustration() {
  return (
    <svg width="120" height="88" viewBox="0 0 120 88" aria-hidden="true" style={{ display: "block", margin: "0 auto 12px" }}>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <ellipse cx="60" cy="66" rx="52" ry="16" stroke="#0A9A8A" strokeDasharray="4 6" />
        <ellipse cx="60" cy="66" rx="28" ry="8" stroke="#1D3557" />
        <path d="M60 64s-16-14-16-27a16 16 0 0 1 32 0c0 13-16 27-16 27z" fill="#fff" stroke="#1D3557" />
        <circle cx="60" cy="37" r="5" fill="#0A9A8A" stroke="none" />
      </g>
    </svg>
  );
}

/** Small India flag for the +91 prefix */
export function Flag() {
  return (
    <svg className="flag" viewBox="0 0 30 20" aria-hidden="true">
      <rect width="30" height="20" fill="#fff" />
      <rect width="30" height="6.67" fill="#F29C38" />
      <rect y="13.33" width="30" height="6.67" fill="#2E8B57" />
      <circle cx="15" cy="10" r="2.6" fill="none" stroke="#1D3557" strokeWidth=".9" />
    </svg>
  );
}

/** Location permission thumbnails */
export function MapApprox() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg width="104" height="104" viewBox="0 0 104 104" aria-hidden="true">
      <defs>
        <clipPath id={`mc${id}`}>
          <circle cx="52" cy="52" r="52" />
        </clipPath>
        <filter id={`mf${id}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>
      <g clipPath={`url(#mc${id})`}>
        <g filter={`url(#mf${id})`}>
          <rect width="104" height="104" fill="#E4ECE8" />
          <path d="M-5 30C30 40 60 20 110 34M18-5c12 40-3 75 17 115M72-5l10 115M-5 78l115-12" stroke="#fff" strokeWidth="6" fill="none" />
          <rect x="44" y="40" width="22" height="18" rx="4" fill="#CBE5D3" />
          <path d="M80 80c10 0 20 6 30 4v24H74z" fill="#CFE2EC" />
        </g>
        <circle cx="52" cy="52" r="34" fill="#0A9A8A" opacity=".24" />
        <circle cx="52" cy="52" r="34" fill="none" stroke="#0A9A8A" strokeOpacity=".55" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function MapPrecise() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg width="104" height="104" viewBox="0 0 104 104" aria-hidden="true">
      <defs>
        <clipPath id={`mp${id}`}>
          <circle cx="52" cy="52" r="52" />
        </clipPath>
      </defs>
      <g clipPath={`url(#mp${id})`}>
        <rect width="104" height="104" fill="#EAEFF1" />
        <g fill="#DCE4E9">
          <rect x="4" y="6" width="22" height="16" rx="2" />
          <rect x="36" y="6" width="22" height="16" rx="2" />
          <rect x="68" y="6" width="30" height="16" rx="2" />
          <rect x="4" y="32" width="22" height="22" rx="2" />
          <rect x="68" y="32" width="30" height="22" rx="2" />
          <rect x="4" y="64" width="22" height="18" rx="2" />
          <rect x="36" y="64" width="22" height="18" rx="2" />
          <rect x="4" y="92" width="54" height="12" rx="2" />
        </g>
        <rect x="36" y="32" width="22" height="22" rx="2" fill="#CBE5D3" />
        <rect x="68" y="64" width="30" height="40" rx="2" fill="#CFE2EC" />
        <path d="M0 27h104M0 59h104M0 87h104M31 0v104M63 0v104" stroke="#fff" strokeWidth="5" />
        <path d="M0 104 104 0" stroke="#fff" strokeWidth="3" opacity=".8" />
        <ellipse cx="52" cy="62" rx="7" ry="2.5" fill="#1D3557" opacity=".25" />
        <path d="M52 61s-11-10-11-18a11 11 0 0 1 22 0c0 8-11 18-11 18z" fill="#457B9D" />
        <circle cx="52" cy="43" r="4.2" fill="#fff" />
      </g>
    </svg>
  );
}

/** Success check — stroke draw + emphasised pop */
export function OkCheck() {
  return (
    <svg className="okc" width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
      <circle className="halo" cx="60" cy="60" r="48" fill="#0A9A8A" opacity=".2" />
      <circle cx="60" cy="60" r="48" fill="#DDF1ED" />
      <circle className="c1" cx="60" cy="60" r="48" fill="none" stroke="#087C70" strokeWidth="5" strokeLinecap="round" transform="rotate(-90 60 60)" />
      <path className="c2" d="M40 61l14 14 27-29" fill="none" stroke="#087C70" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
