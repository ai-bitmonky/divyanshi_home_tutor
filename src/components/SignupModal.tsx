"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef } from "react";
import { USER } from "@/lib/data";
import { useApp } from "@/lib/store";
import { Flag } from "./Illustration";
import { Icon } from "./Icons";
import { OtpBoxes, ResendTimer } from "./Otp";
import { Avatar } from "./Portrait";
import { Sheet } from "./Sheet";
import { useToast } from "./Toast";
import { Desktop, Mobile } from "./Variant";

/** Close the optional sign-in modal and carry on — to `auth.next` when the modal gated a navigation. */
function useSkipAuth() {
  const { s, update } = useApp();
  const router = useRouter();
  const next = s.auth.next;
  return () => {
    update((st) => ({ ...st, auth: { ...st.auth, open: false, step: "signup", next: undefined } }));
    if (next) router.push(next);
  };
}

/** "Skip for now" — sign-in is never required */
function SkipAuth() {
  const skip = useSkipAuth();
  return (
    <button type="button" className="skip" onClick={skip}>
      Skip for now
    </button>
  );
}

/** Optional sign-in card (inside the modal): mobile number (+91) or email → code. Nothing is verified. */
export function SignupCard() {
  const { s, update } = useApp();
  const toast = useToast();
  const uid = useId();
  const a = s.auth;
  const login = a.kind === "login";
  const title = login ? "Log in to TutorForMe" : "Create a free account";
  const sub = login ? "Optional — you can browse and book without an account." : "Optional · Takes 30 seconds · ₹0 · No card needed";
  const setAuth = (patch: Partial<typeof a>) => update((st) => ({ ...st, auth: { ...st.auth, ...patch } }));
  const send = () => setAuth({ open: true, step: "otp" });
  const opt = (
    <span className="muted" style={{ fontWeight: 500 }}>
      · Optional for now
    </span>
  );

  return (
    <div className="su-card" style={{ padding: 0 }}>
      <h2 className="su-t" id="suT">
        {title}
      </h2>
      <p className="su-s">{sub}</p>
      {a.email ? (
        <>
          <label className="lbl" htmlFor={`${uid}-em`}>
            Email address {opt}
          </label>
          <div className="iw">
            <Icon name="mail" size={18} />
            <input id={`${uid}-em`} className="inp" type="email" placeholder="you@example.com" autoComplete="email" onKeyDown={(e) => e.key === "Enter" && send()} />
          </div>
        </>
      ) : (
        <>
          <label className="lbl" htmlFor={`${uid}-mob`}>
            Mobile number {opt}
          </label>
          <div className="ph-inp">
            <span className="cc">
              <Flag /> +91
            </span>
            <input
              id={`${uid}-mob`}
              className="inp"
              type="tel"
              inputMode="numeric"
              maxLength={11}
              placeholder="98723 46350"
              value={a.mob}
              autoComplete="tel-national"
              onChange={(e) => setAuth({ mob: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  send();
                }
              }}
            />
          </div>
        </>
      )}
      <button type="button" className="btn btn-p btn-block" onClick={send}>
        {a.email ? "Send login code" : "Send code"}
      </button>
      <p className="hint">
        <Icon name="shield" size={15} /> {a.email ? "We will email you a code" : "We will text you a code"} · any code works for now
      </p>
      <div className="su-alt">
        <button type="button" className="link" onClick={() => setAuth({ email: !a.email })}>
          {a.email ? "Use mobile number instead" : "Use email instead"} <Icon name="chevR" size={15} stroke={2.2} />
        </button>
      </div>
      <SkipAuth />
      <Desktop>
        <p className="fine">
          By continuing, you agree to our{" "}
          <button type="button" onClick={() => toast("Terms of Service opened")}>
            Terms
          </button>{" "}
          &amp;{" "}
          <button type="button" onClick={() => toast("Privacy Policy opened")}>
            Privacy Policy
          </button>
        </p>
      </Desktop>
    </div>
  );
}

function OtpStep() {
  const { s, update } = useApp();
  const a = s.auth;
  const go = (step: "signup" | "login") => update((st) => ({ ...st, auth: { ...st.auth, step } }));
  return (
    <div className="otp-card" style={{ padding: 0 }}>
      <div className="otp-ic">
        <Icon name="lock" size={26} />
      </div>
      <h2 id="otpT2">Enter your code</h2>
      <p className="muted">
        Any code works for now — or leave it blank. Sent to <b style={{ color: "var(--navy)" }}>{a.email ? "your email" : `+91 ${a.mob || USER.phoneLocal}`}</b> ·{" "}
        <button type="button" className="link" onClick={() => go("signup")}>
          Edit
        </button>
      </p>
      <OtpBoxes onEnter={() => go("login")} />
      <button type="button" className="btn btn-p btn-block" onClick={() => go("login")}>
        Continue
      </button>
      <ResendTimer label="Resend code in" again="Resend code" />
      <SkipAuth />
    </div>
  );
}

function LoginStep() {
  const { s, update } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const done = () => {
    const next = s.auth.next ?? (pathname === "/" ? "/tutors" : null);
    update((st) => ({ ...st, loggedIn: true, auth: { ...st.auth, open: false, step: "signup", next: undefined } }));
    toast("Logged in", "check");
    if (next) router.push(next);
  };
  return (
    <>
      <h2 className="sh-t" id="lsT">
        Log in to TutorForMe
      </h2>
      <p className="muted" style={{ marginTop: 4 }}>
        We found an account linked to this number. Continue as:
      </p>
      <button type="button" className="acct on" aria-pressed="true" onClick={() => toast("Account selected")}>
        <Avatar ini="DA" size={46} g={4} />
        <span className="at">
          <b>DIVYANSHI AGRAHARI</b>
          <span>Student · Class 12 · {USER.phone}</span>
        </span>
        <span className="radio" />
      </button>
      <button type="button" className="btn btn-p btn-block" onClick={done}>
        Continue
      </button>
      <SkipAuth />
    </>
  );
}

/** Optional sign-up → code (anything accepted) → login confirm; every step can be skipped. Desktop: centred modal. Mobile: bottom sheet. */
export function SignupModal() {
  const { s, update } = useApp();
  const a = s.auth;
  const box = useRef<HTMLDivElement>(null);
  const close = () => update((st) => ({ ...st, auth: { ...st.auth, open: false, next: undefined } }));

  /* desktop modal: Escape, focus, page scroll lock (the mobile Sheet does its own) */
  useEffect(() => {
    if (!a.open || !box.current) return;
    const close = () => update((st) => ({ ...st, auth: { ...st.auth, open: false, next: undefined } }));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const first = box.current?.querySelector<HTMLElement>("input, button.btn-p");
    first?.focus({ preventScroll: true });
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [a.open, a.step, update]);

  if (!a.open) return null;
  const label = a.step === "signup" ? "suT" : a.step === "otp" ? "otpT2" : "lsT";
  const steps = (
    <>
      {a.step === "signup" && <SignupCard />}
      {a.step === "otp" && <OtpStep />}
      {a.step === "login" && <LoginStep />}
    </>
  );
  return (
    <>
      <Desktop>
        <div className="ov">
          <div className="scrim" onClick={close} aria-hidden="true" />
          <div className="modal sheet-m" role="dialog" aria-modal="true" aria-labelledby={label} ref={box}>
            <button type="button" className="icbtn flat x" aria-label="Close" onClick={close}>
              <Icon name="x" size={18} />
            </button>
            {steps}
          </div>
        </div>
      </Desktop>
      <Mobile>
        <Sheet
          open
          onClose={close}
          titleId={label}
          className="msh-auth"
          right={(c) => (
            <button type="button" className="msh-x" aria-label="Close" onClick={c}>
              <Icon name="x" size={18} stroke={2.2} />
            </button>
          )}
        >
          {steps}
        </Sheet>
      </Mobile>
    </>
  );
}
