import { useId } from "react";

/* Duotone SVG portraits with feTurbulence grain — every avatar/portrait uses
   viewBox 0 0 100 100, so one shared set of <defs> (rendered once in the layout) serves all sizes. */

const GRADS: [string, string][] = [
  ["#1D3557", "#3B8C99"],
  ["#0B7F74", "#1D3557"],
  ["#26496D", "#5D9DB0"],
  ["#1D3557", "#0A9A8A"],
  ["#2B4C70", "#6FB3A9"],
  ["#173049", "#457B9D"],
];

/** Shared defs — rendered once in the root layout. Not display:none (gradients would break). */
export function SvgDefs() {
  return (
    <svg className="svgdefs" aria-hidden="true" focusable="false">
      <defs>
        {GRADS.map(([a, b], i) => (
          <linearGradient key={i} id={`pg${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        ))}
        <radialGradient id="plt" cx=".28" cy=".18" r=".85">
          <stop offset="0" stopColor="#fff" stopOpacity=".42" />
          <stop offset=".55" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pvg" cx=".5" cy=".45" r=".75">
          <stop offset=".6" stopColor="#0E1C2E" stopOpacity="0" />
          <stop offset="1" stopColor="#0E1C2E" stopOpacity=".35" />
        </radialGradient>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".95" numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <clipPath id="cpC">
          <circle cx="50" cy="50" r="50" />
        </clipPath>
        <clipPath id="cpCr">
          <circle cx="50" cy="50" r="45" />
        </clipPath>
        <clipPath id="cpR17">
          <rect width="100" height="100" rx="17" />
        </clipPath>
        <clipPath id="cpR14">
          <rect width="100" height="100" rx="14" />
        </clipPath>
      </defs>
    </svg>
  );
}

function PortraitInner({ ini, g }: { ini: string; g: number }) {
  return (
    <>
      <g className="pz">
        <rect width="100" height="100" fill={`url(#pg${g % 6})`} />
        <circle cx="50" cy="41" r="18" fill="#fff" opacity=".12" />
        <path d="M13 106c3-26 18-39 37-39s34 13 37 39z" fill="#fff" opacity=".12" />
        <rect width="100" height="100" fill="url(#plt)" />
        <text
          x="50"
          y="50"
          dy=".35em"
          textAnchor="middle"
          fontFamily="Inter,system-ui,sans-serif"
          fontWeight="700"
          fontSize={ini.length > 2 ? 28 : 34}
          fill="#fff"
          letterSpacing="-.5"
        >
          {ini}
        </text>
      </g>
      <rect width="100" height="100" filter="url(#grain)" opacity=".28" style={{ mixBlendMode: "overlay" }} />
      <rect width="100" height="100" fill="url(#pvg)" />
    </>
  );
}

/** Tutor portrait: rounded square */
export function Portrait({ name, ini, g, size = 72, r = 17, className }: { name: string; ini: string; g: number; size?: number; r?: 14 | 17; className?: string }) {
  return (
    <svg className={`pt ${className ?? ""}`.trim()} width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`Photo of ${name}`}>
      <g clipPath={`url(#cpR${r})`}>
        <PortraitInner ini={ini} g={g} />
      </g>
    </svg>
  );
}

/** Round avatar (people other than tutors) — same duotone + grain */
export function Avatar({ ini, size = 44, g = 0, ring = false, label }: { ini: string; size?: number; g?: number; ring?: boolean; label?: string }) {
  return (
    <svg className="av" width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={label ?? ini}>
      {ring && <circle cx="50" cy="50" r="50" fill="#fff" />}
      <g clipPath={`url(#cpC${ring ? "r" : ""})`}>
        <PortraitInner ini={ini} g={g} />
      </g>
    </svg>
  );
}

const STAR_D = "M12 2.6l2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.17l-5.7 2.99 1.09-6.35-4.62-4.5 6.38-.93z";

/** Five stars with partial fill */
export function Stars({ r, size = 14 }: { r: number; size?: number }) {
  const uid = useId();
  return (
    <span className="stars" role="img" aria-label={`${r} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const f = Math.max(0, Math.min(1, r - (i - 1)));
        if (f >= 0.99)
          return (
            <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
              <path d={STAR_D} fill="#F4B740" />
            </svg>
          );
        if (f <= 0.01)
          return (
            <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
              <path d={STAR_D} fill="#D7DEE5" />
            </svg>
          );
        const id = `st${uid.replace(/[^a-zA-Z0-9_-]/g, "")}${i}`;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <clipPath id={id}>
                <rect width={(24 * f).toFixed(1)} height="24" />
              </clipPath>
            </defs>
            <path d={STAR_D} fill="#D7DEE5" />
            <path d={STAR_D} fill="#F4B740" clipPath={`url(#${id})`} />
          </svg>
        );
      })}
    </span>
  );
}

/** Single gold star */
export function Star1({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flex: "none", display: "inline-block", verticalAlign: "-2px" }}>
      <path d={STAR_D} fill="#F4B740" />
    </svg>
  );
}

/** Star that inherits currentColor (rating picker) */
export function BigStar({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={STAR_D} fill="currentColor" />
    </svg>
  );
}
