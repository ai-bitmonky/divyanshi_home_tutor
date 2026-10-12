/* Inline SVG line icons (24×24, 1.8 stroke) — ported verbatim from Prototype v2.0.
   The path strings are static constants (never user input), so they are injected as markup. */
import type { CSSProperties } from "react";

const IC = {
  home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-6h4v6"/>',
  calendar:'<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.8v3.4M16 2.8v3.4"/>',
  chat:'<path d="M20.5 14.5a2 2 0 0 1-2 2H8l-4.5 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z"/><path d="M8 8.5h8M8 12h5"/>',
  sparkle:'<path d="M12 3.5 13.9 9 19.5 11 13.9 13 12 18.5 10.1 13 4.5 11 10.1 9z"/><path d="M19 3v3M17.5 4.5h3"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.4-3.8 4.3-5.5 7.5-5.5s6.1 1.7 7.5 5.5"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  filter:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  pin:'<path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.6"/>',
  star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z"/>',
  shield:'<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>',
  play:'<path d="M7.5 5v14l11.5-7z" fill="currentColor"/>',
  lock:'<rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><path d="M12 14.5v2"/>',
  card:'<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h4"/>',
  bank:'<path d="M3 9.5 12 4l9 5.5"/><path d="M5 10v7.5M9.5 10v7.5M14.5 10v7.5M19 10v7.5M3 20.5h18"/>',
  wallet:'<path d="M19 7.5V5.5A1.5 1.5 0 0 0 17.5 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9.5a2 2 0 0 0-2-2H5"/><circle cx="16.5" cy="14" r="1.2" fill="currentColor"/>',
  chevR:'<path d="m9 6 6 6-6 6"/>', chevL:'<path d="m15 6-6 6 6 6"/>', chevD:'<path d="m6 9 6 6 6-6"/>',
  back:'<path d="M19 12H5M11 18l-6-6 6-6"/>', arrowR:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  phone:'<path d="M5 4h3.5l2 5-2.4 1.5a11 11 0 0 0 5.4 5.4L15 13.5l5 2V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  dots:'<circle cx="12" cy="5" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="19" r="1.4" fill="currentColor"/>',
  send:'<path d="M21 3 10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5z"/>',
  book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  books:'<path d="M5 4h4v16H5zM9 4h4v16H9z"/><path d="m14 5 3.8-1 3.2 15.5-3.8 1z"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  edit:'<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  logout:'<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5M5 12h11"/>',
  bell:'<path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  trend:'<path d="M3 17 9 11l4 4 8-8"/><path d="M15 7h6v6"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.4 3.6-5 6.5-5s5.5 1.6 6.5 5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 15.3c1.7.7 2.9 2.2 3.5 4.7"/>',
  award:'<circle cx="12" cy="9" r="6"/><path d="m8.5 14 -1.5 7 5-2.5 5 2.5-1.5-7"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>',
  heart:'<path d="M12 20s-7.5-4.6-9-9.4C1.9 7 4.3 4 7.5 4c2 0 3.5 1.2 4.5 2.6C13 5.2 14.5 4 16.5 4c3.2 0 5.6 3 4.5 6.6C19.5 15.4 12 20 12 20z"/>',
  share:'<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
  bolt:'<path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z"/>',
  history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7.5V12l3 2"/>',
  bag:'<path d="M5 8h14l-1 12.5H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  sliders:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1.5 14h5M9.5 8h5M17.5 16h5"/>',
  key:'<circle cx="8" cy="15" r="4.5"/><path d="m11.2 11.8 9-9M17 6l3 3M14.5 8.5l2 2"/>',
  family:'<circle cx="8" cy="6.5" r="2.8"/><circle cx="17" cy="8" r="2.2"/><path d="M3 20c.6-4 2.6-6.5 5-6.5s4.4 2.5 5 6.5M13.5 20c.4-3 1.7-5 3.5-5s3.1 2 3.5 5"/>',
  video:'<rect x="2.5" y="6" width="13.5" height="12" rx="2.5"/><path d="m16 10.5 5.5-3v9l-5.5-3"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',
  grad:'<path d="M2 9.5 12 5l10 4.5-10 4.5z"/><path d="M6 11.5v4.5c3.5 2.6 8.5 2.6 12 0v-4.5M22 9.5V15"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5v.5"/>',
  home2:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/>',
  refresh:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  upi:'<path d="M7 3.5 4 20.5M13 3.5l-3 17"/><path d="m15 6 5 6-5 6"/>',
  // v2.0 additions: filled tab icons + new glyphs
  homeF:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" fill="currentColor"/>',
  searchF:'<circle cx="11" cy="11" r="7" fill="currentColor" fill-opacity=".22"/><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  calF:'<rect x="3" y="4.5" width="18" height="16" rx="2.5" fill="currentColor"/><path d="M3 9.5h18" stroke="#fff"/><path d="M8 2.8v3.4M16 2.8v3.4"/><path d="M8 14h2M14 14h2M8 17h2" stroke="#fff"/>',
  chatF:'<path d="M20.5 14.5a2 2 0 0 1-2 2H8l-4.5 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" fill="currentColor"/><path d="M8 8.5h8M8 12h5" stroke="#fff"/>',
  userF:'<circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4.5 20.5c1.4-3.8 4.3-5.5 7.5-5.5s6.1 1.7 7.5 5.5z" fill="currentColor"/>',
  heartF:'<path d="M12 20s-7.5-4.6-9-9.4C1.9 7 4.3 4 7.5 4c2 0 3.5 1.2 4.5 2.6C13 5.2 14.5 4 16.5 4c3.2 0 5.6 3 4.5 6.6C19.5 15.4 12 20 12 20z" fill="currentColor"/>',
  calPlus:'<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.8v3.4M16 2.8v3.4M12 12.5v5M9.5 15h5"/>',
  idcard:'<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><circle cx="8.5" cy="11" r="2.2"/><path d="M5.5 16c.6-1.6 1.7-2.3 3-2.3s2.4.7 3 2.3M14 10h4.5M14 13.5h3"/>',
  fire:'<path d="M12 21c-4 0-6.5-2.7-6.5-6.2 0-4.3 4-6.3 4.5-10.3 3 1.8 4.5 4.2 4.8 6.6 1-.6 1.6-1.6 1.8-2.8 1.8 1.7 1.9 4 1.9 6.5 0 3.5-2.5 6.2-6.5 6.2z"/>',
  clip:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M8.5 10h7M8.5 14h7M8.5 18h4"/>',
  rupee:'<path d="M6 4h12M6 8.5h12M9.5 4c5.5 0 5.5 9-1.5 9H7l8 7.5"/>',
  route:'<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  swap:'<path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5"/>',
  doc:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>'
} as const;

export type IconName = keyof typeof IC;

interface Props {
  name: IconName;
  size?: number;
  stroke?: number;
  className?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 20, stroke = 1.8, className = "", style }: Props) {
  return (
    <svg
      className={`ic ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={style}
      dangerouslySetInnerHTML={{ __html: IC[name] }}
    />
  );
}
