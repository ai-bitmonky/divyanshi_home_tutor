"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Icon, type IconName } from "./Icons";

/* ---------- Button: teal is the only action fill ---------- */
type Variant = "p" | "s" | "g" | "n" | "w" | "amber";
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "lg";
  block?: boolean;
}
export function Button({ variant = "p", size, block, className = "", type = "button", ...rest }: BtnProps) {
  const cls = ["btn", `btn-${variant}`, size ? `btn-${size}` : "", block ? "btn-block" : "", className].filter(Boolean).join(" ");
  return <button type={type} className={cls} {...rest} />;
}

/* ---------- Chips ---------- */
export function ChipGroup<T extends string>({
  items,
  value,
  onChange,
  label = (v: T) => v,
  suffix = "",
  className = "",
  ariaLabel,
}: {
  items: readonly T[];
  value: T;
  onChange: (v: T) => void;
  label?: (v: T) => string;
  suffix?: string;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div className={`chips ${className}`.trim()} role="group" aria-label={ariaLabel}>
      {items.map((v) => (
        <button key={v} type="button" className={`chip${value === v ? " on" : ""}`} aria-pressed={value === v} onClick={() => onChange(v)}>
          {label(v)}
          {suffix ? ` ${suffix}` : ""}
        </button>
      ))}
    </div>
  );
}

/** Multi-select chips bound to an array */
export function ChipMulti({ items, value, onToggle, ariaLabel }: { items: string[]; value: string[]; onToggle: (v: string) => void; ariaLabel?: string }) {
  return (
    <div className="chips" role="group" aria-label={ariaLabel}>
      {items.map((v) => {
        const on = value.includes(v);
        return (
          <button key={v} type="button" className={`chip${on ? " on" : ""}`} aria-pressed={on} onClick={() => onToggle(v)}>
            {on && <Icon name="check" size={14} stroke={2.6} />}
            {v}
          </button>
        );
      })}
    </div>
  );
}

/** Segmented toggle (Home / Online …) */
export function Tog<T extends string>({
  items,
  value,
  onChange,
  className = "",
  ariaLabel,
}: {
  items: readonly (readonly [T, IconName | "", string?])[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div className={`tog ${className}`.trim()} role="radiogroup" aria-label={ariaLabel}>
      {items.map(([v, ic, label]) => (
        <button key={v} type="button" className={value === v ? "on" : ""} role="radio" aria-checked={value === v} onClick={() => onChange(v)}>
          {ic ? <Icon name={ic} size={16} /> : null}
          {label ?? v}
        </button>
      ))}
    </div>
  );
}

/** Right-Fit Promise line (shown beside every Pay button) */
export function Guar({ children = "switch tutor free, any time." }: { children?: ReactNode }) {
  return (
    <div className="guar">
      <Icon name="shield" size={20} stroke={2} />
      <span>
        <b>Right-Fit Promise:</b> {children}
      </span>
    </div>
  );
}

/** Back that falls back to a route when there is no in-app history */
export function useBack(fallback: string) {
  const router = useRouter();
  return () => {
    if (typeof window !== "undefined" && window.history.length > 1) router.back();
    else router.push(fallback);
  };
}

/** Mobile app bar: back + title + optional right slot */
export function AppBar({ title, back = "/tutors", right }: { title: ReactNode; back?: string; right?: ReactNode }) {
  const goBack = useBack(back);
  return (
    <div className="appbar m-only">
      <button type="button" className="icbtn" aria-label="Go back" onClick={goBack}>
        <Icon name="back" size={20} />
      </button>
      <h1>{title}</h1>
      {right}
    </div>
  );
}

/** Mobile tab-page header (large title) */
export function TabHead({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="appbar tabhead m-only">
      <h1>{title}</h1>
      {right}
    </div>
  );
}

/** Desktop breadcrumb with Back */
export function Crumb({ items, back = "/tutors" }: { items: [string, string?][]; back?: string }) {
  const goBack = useBack(back);
  return (
    <nav className="crumb d-only" aria-label="Breadcrumb">
      <button type="button" className="back" onClick={goBack}>
        <Icon name="back" size={16} /> Back
      </button>
      {items.map(([label, href], i) =>
        i < items.length - 1 && href ? (
          <Fragment key={label}>
            <Link href={href}>{label}</Link>
            <Icon name="chevR" size={14} />
          </Fragment>
        ) : (
          <span key={label} style={{ color: "var(--navy)", fontWeight: 600 }} aria-current="page">
            {label}
          </span>
        ),
      )}
    </nav>
  );
}

export function Spinner() {
  return <span className="spin" aria-hidden="true" />;
}
