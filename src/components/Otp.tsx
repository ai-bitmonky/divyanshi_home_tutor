"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { Icon } from "./Icons";
import { useToast } from "./Toast";

/** 6 OTP boxes with auto-advance, backspace-to-previous, arrows and paste */
export function OtpBoxes({ initial = "482913", onEnter }: { initial?: string; onEnter?: () => void }) {
  const [v, setV] = useState<string[]>(() => initial.padEnd(6, " ").slice(0, 6).split(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const put = (i: number, c: string) => setV((old) => old.map((x, j) => (j === i ? c || " " : x)));

  const onKey = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    const cur = v[i].trim();
    if (e.key === "Backspace" && !cur && i > 0) {
      e.preventDefault();
      put(i - 1, "");
      refs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
    if (e.key === "Enter") onEnter?.();
  };
  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const t = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
    if (!t) return;
    e.preventDefault();
    setV((old) => old.map((x, j) => t[j] ?? x));
    refs.current[Math.min(t.length, 5)]?.focus();
  };

  return (
    <>
      <div className="otp" role="group" aria-label="One-time password">
        {v.map((c, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={`otp-b${c.trim() ? " fill" : ""}`}
            maxLength={1}
            inputMode="numeric"
            autoComplete={i ? "off" : "one-time-code"}
            aria-label={`Digit ${i + 1}`}
            value={c.trim()}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              const d = e.target.value.replace(/\D/g, "").slice(-1);
              put(i, d);
              if (d && i < 5) refs.current[i + 1]?.focus();
            }}
            onKeyDown={onKey(i)}
            onPaste={onPaste}
          />
        ))}
      </div>
      <p className="demo-note">
        <Icon name="sparkle" size={14} /> Demo code auto-filled — any 6 digits work
      </p>
    </>
  );
}

/** "Resend OTP in 00:30" countdown → "Didn't get it? Resend OTP" */
export function ResendTimer({ label = "Resend OTP in", again = "Resend OTP" }: { label?: string; again?: string }) {
  const [n, setN] = useState(30);
  const toast = useToast();
  useEffect(() => {
    if (n <= 0) return;
    const id = setTimeout(() => setN((x) => x - 1), 1000);
    return () => clearTimeout(id);
  }, [n]);
  return (
    <p className="resend" aria-live="polite">
      {n > 0 ? (
        <>
          {label} <b className="tnum">00:{String(n).padStart(2, "0")}</b>
        </>
      ) : (
        <>
          Didn&apos;t get it?{" "}
          <button
            type="button"
            className="link"
            onClick={() => {
              setN(30);
              toast("New code sent", "check");
            }}
          >
            {again}
          </button>
        </>
      )}
    </p>
  );
}
