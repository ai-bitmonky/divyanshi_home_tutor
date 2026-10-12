"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef } from "react";
import { USER } from "@/lib/data";
import { useApp } from "@/lib/store";
import { Flag } from "./Illustration";
import { Icon } from "./Icons";
import { OtpBoxes, ResendTimer } from "./Otp";
import { Avatar } from "./Portrait";
import { useToast } from "./Toast";

/** Sign-up card: mobile number (+91) or email → Send OTP. Used inline on the mobile welcome and inside the modal. */
export function SignupCard({ inline = false, inModal = false }: { inline?: boolean; inModal?: boolean }) {
  const { s, update } = useApp();
  const toast = useToast();
  const uid = useId();
  const a = s.auth;
  const login = a.kind === "login" && !inline;
  const title = inline ? "Sign up to book a free demo" : login ? "Log in to TutorForMe" : "Book your free demo";
  const sub = login ? "We will text you a 6-digit code." : "Takes 30 seconds · ₹0 · No card needed";
  const setAuth = (patch: Partial<typeof a>) => update((st) => ({ ...st, auth: { ...st.auth, ...patch } }));
  const send = () => setAuth({ open: true, step: "otp", kind: inline ? "demo" : a.kind });

  return (
    <div className={inModal ? "su-card" : "card su-card"} style={inModal ? { padding: 0 } : undefined}>
      <h2 className="su-t" id={inModal ? "suT" : undefined}>
        {title}
      </h2>
      <p className="su-s">{sub}</p>
      {a.email ? (
        <>
          <label className="lbl" htmlFor={`${uid}-em`}>
            Email address
          </label>
          <div className="iw">
            <Icon name="mail" size={18} />
            <input id={`${uid}-em`} className="inp" type="email" placeholder="you@example.com" autoComplete="email" onKeyDown={(e) => e.key === "Enter" && send()} />
          </div>
        </>
      ) : (
        <>
          <label className="lbl" htmlFor={`${uid}-mob`}>
            Mobile number
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
        {a.email ? "Send login code" : "Send OTP"}
      </button>
      <p className="hint">
        <Icon name="shield" size={15} /> {a.email ? "We will email you a 6-digit code" : "OTP is read automatically for faster login"}
      </p>
      <div className="su-alt">
        <button type="button" className="link" onClick={() => setAuth({ email: !a.email })}>
          {a.email ? "Use mobile number instead" : "Use email instead"} <Icon name="chevR" size={15} stroke={2.2} />
        </button>
      </div>
      {!inline && (
        <p className="fine d-only">
          By continuing, you agree to our{" "}
          <button type="button" onClick={() => toast("Terms of Service opened")}>
            Terms
          </button>{" "}
          &amp;{" "}
          <button type="button" onClick={() => toast("Privacy Policy opened")}>
            Privacy Policy
          </button>
        </p>
      )}
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
      <h2 id="otpT2">Verify your {a.email ? "email" : "number"}</h2>
      <p className="muted">
        Enter the 6-digit code sent to <b style={{ color: "var(--navy)" }}>{a.email ? "your email" : `+91 ${a.mob || USER.phoneLocal}`}</b> ·{" "}
        <button type="button" className="link" onClick={() => go("signup")}>
          Edit
        </button>
      </p>
      <OtpBoxes onEnter={() => go("login")} />
      <button type="button" className="btn btn-p btn-block" onClick={() => go("login")}>
        Verify &amp; continue
      </button>
      <ResendTimer />
    </div>
  );
}

function LoginStep() {
  const { update } = useApp();
  const router = useRouter();
  const toast = useToast();
  const done = () => {
    update((st) => ({ ...st, loggedIn: true, auth: { ...st.auth, open: false, step: "signup" } }));
    router.push("/location");
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
      <button type="button" className="skip" onClick={done}>
        Skip
      </button>
    </>
  );
}

/** Sign-up → OTP → login confirm. Desktop: centred modal. Mobile: bottom sheet. */
export function SignupModal() {
  const { s, update } = useApp();
  const a = s.auth;
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!a.open) return;
    const close = () => update((st) => ({ ...st, auth: { ...st.auth, open: false } }));
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
  const close = () => update((st) => ({ ...st, auth: { ...st.auth, open: false } }));
  const label = a.step === "signup" ? "suT" : a.step === "otp" ? "otpT2" : "lsT";
  return (
    <div className="ov">
      <div className="scrim" onClick={close} aria-hidden="true" />
      <div className="modal sheet-m" role="dialog" aria-modal="true" aria-labelledby={label} ref={box}>
        <div className="grab m-only" aria-hidden="true" />
        <button type="button" className="icbtn flat x" aria-label="Close" onClick={close}>
          <Icon name="x" size={18} />
        </button>
        {a.step === "signup" && <SignupCard inModal />}
        {a.step === "otp" && <OtpStep />}
        {a.step === "login" && <LoginStep />}
      </div>
    </div>
  );
}
