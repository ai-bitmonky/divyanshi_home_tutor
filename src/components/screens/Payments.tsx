"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { PLANS, dateLabel, inr, planPrice, tutorById, type PlanSize } from "@/lib/data";
import { useActions } from "@/lib/actions";
import { useApp } from "@/lib/store";
import { OkCheck } from "../Illustration";
import { Icon, type IconName } from "../Icons";
import { Portrait } from "../Portrait";
import { AppBar, Crumb, Guar, Spinner } from "../ui";
import { Desktop, Mobile } from "../Variant";

/* ---------------- Plans ---------------- */
function PlanCards() {
  const { s, set } = useApp();
  const t = tutorById(s.tutor);
  return (
    <div className="plans" role="radiogroup" aria-label="Classes per month">
      {PLANS.map((n) => {
        const p = planPrice(t.pricePerClass, n);
        const on = s.plan === n;
        const save = t.pricePerClass * n - p;
        return (
          <button key={n} type="button" className={`plan${on ? " on" : ""}`} role="radio" aria-checked={on} onClick={() => set({ plan: n as PlanSize })}>
            {n === 8 && (
              <span className="ribbon">
                <Icon name="star" size={11} stroke={2.6} />
                Most chosen
              </span>
            )}
            <span className="radio" />
            <span className="pn">{n} classes / month</span>
            <span className="pf">{n / 4 === 1 ? "1 class" : `${n / 4} classes`} a week · 60 min</span>
            <span className="pp">
              {inr(p)}
              <small> / month</small>
            </span>
            <span className="pc">{inr(p / n)} per class</span>
            {save ? <span className="badge badge-t psave">Save {inr(save)}</span> : <span className="badge badge-c psave">Pay as you go</span>}
            <ul>
              <li>
                <Icon name="check" size={15} stroke={2.4} />
                {s.bk.mode === "Home" ? "Home visits" : "Live online classes"}
              </li>
              <li>
                <Icon name="check" size={15} stroke={2.4} />
                Weekly progress report
              </li>
              <li>
                <Icon name="check" size={15} stroke={2.4} />
                Switch tutor free
              </li>
            </ul>
          </button>
        );
      })}
    </div>
  );
}

export function PlansScreen() {
  const { s } = useApp();
  const t = tutorById(s.tutor);
  const p = planPrice(t.pricePerClass, s.plan);
  return (
    <>
      <AppBar title="Choose a plan" back="/classes" />
      <div className="wrap">
        <Crumb items={[["Classes", "/classes"], ["Choose a plan"]]} back="/classes" />
        <div style={{ maxWidth: 960 }}>
          <div className="row" style={{ gap: 14, marginBottom: 24 }}>
            <Portrait name={t.name} ini={t.initials} g={t.g} size={56} />
            <div>
              <div className="t-cap">After your free demo</div>
              <h1 className="d-h1 plan-h">Continue with {t.first}</h1>
              <p className="muted">
                {s.bk.subject} · {s.bk.mode === "Home" ? "Home visits" : "Online"} · {inr(t.pricePerClass)} per 60-min class
              </p>
            </div>
          </div>
          <PlanCards />
          <div className="row plan-foot" style={{ marginTop: 24, gap: 16, alignItems: "stretch", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <Guar>not happy after any class? Switch tutor free.</Guar>
            </div>
            <Desktop>
              <Link href="/checkout" className="btn btn-p btn-lg">
                Continue · {inr(p)} <Icon name="arrowR" size={18} />
              </Link>
            </Desktop>
          </div>
        </div>
      </div>
      <Mobile>
        <div className="mbot">
          <div className="pr">
            <small>{s.plan} classes</small>
            <b>
              {inr(p)}
              <span> / month</span>
            </b>
          </div>
          <Link href="/checkout" className="btn btn-p">
            Continue <Icon name="arrowR" size={18} />
          </Link>
        </div>
      </Mobile>
    </>
  );
}

/* ---------------- Checkout — UPI first; guarantee beside the Pay button ---------------- */
function PaySummary() {
  const { s } = useApp();
  const t = tutorById(s.tutor);
  const p = planPrice(t.pricePerClass, s.plan);
  const save = t.pricePerClass * s.plan - p;
  return (
    <div className="card card-c">
      <div className="t-cap" style={{ marginBottom: 12 }}>
        Order summary
      </div>
      <div className="row" style={{ marginBottom: 12, alignItems: "flex-start" }}>
        <Portrait name={t.name} ini={t.initials} g={t.g} size={44} />
        <div style={{ minWidth: 0 }}>
          <b style={{ display: "block" }}>
            {s.plan} classes / month · {s.bk.subject}
          </b>
          <span className="muted" style={{ fontSize: 13 }}>
            with {t.name} · {s.bk.mode === "Home" ? "Home visits" : "Online"}
          </span>
        </div>
      </div>
      <div className="sum-row">
        <span className="muted">
          {s.plan} × {inr(t.pricePerClass)}
        </span>
        <b>{inr(t.pricePerClass * s.plan)}</b>
      </div>
      {save > 0 && (
        <div className="sum-row">
          <span className="muted">Plan saving</span>
          <b style={{ color: "var(--teal-d)" }}>− {inr(save)}</b>
        </div>
      )}
      <div className="sum-row">
        <span className="muted">Free demo</span>
        <b style={{ color: "var(--teal-d)" }}>₹0</b>
      </div>
      <div className="sum-row total">
        <span>Total</span>
        <span>{inr(p)}</span>
      </div>
    </div>
  );
}

const APPS: ["gpay" | "phonepe" | "paytm", string, string, string][] = [
  ["gpay", "G", "Google Pay", "#1D3557"],
  ["phonepe", "Pe", "PhonePe", "#457B9D"],
  ["paytm", "P", "Paytm", "#087C70"],
];
const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Punjab National Bank"];

function PayMethods() {
  const { s, set } = useApp();
  const uid = useId();
  const p = s.pay;
  const row = (k: "card" | "net", icn: IconName, title: string, sub: string) => (
    <button type="button" className={`pay-opt${p === k ? " on" : ""}`} role="radio" aria-checked={p === k} onClick={() => set({ pay: k })}>
      <span className="pic">
        <Icon name={icn} size={20} />
      </span>
      <span className="pt2">
        {title}
        <small>{sub}</small>
      </span>
      <span className="radio" />
    </button>
  );
  return (
    <>
      <div role="radiogroup" aria-label="Payment method">
        <div className={`pay-opt${p === "upi" ? " on" : ""}`} style={{ display: "block", cursor: "default" }}>
          <button type="button" className="row" style={{ width: "100%", gap: 12, textAlign: "left" }} role="radio" aria-checked={p === "upi"} onClick={() => set({ pay: "upi" })}>
            <span className="pic" style={{ width: 42, height: 42, borderRadius: 12, display: "grid", placeItems: "center", background: "var(--light)" }}>
              <Icon name="upi" size={20} />
            </span>
            <span className="pt2" style={{ flex: 1, fontWeight: 600 }}>
              Pay by UPI{" "}
              <span className="badge badge-t" style={{ marginLeft: 6 }}>
                Fastest
              </span>
              <small style={{ display: "block", fontWeight: 500, color: "var(--muted)", fontSize: 13 }}>Approve in your UPI app — no card needed</small>
            </span>
            <span className="radio" />
          </button>
          {p === "upi" && (
            <>
              <div className="upis" role="radiogroup" aria-label="UPI app">
                {APPS.map(([k, l, n, c]) => (
                  <button key={k} type="button" className={`upi${s.upiApp === k ? " on" : ""}`} role="radio" aria-checked={s.upiApp === k} onClick={() => set({ upiApp: k })}>
                    <i style={{ background: c }}>{l}</i>
                    {n}
                  </button>
                ))}
              </div>
              <div className="iw" style={{ marginTop: 10 }}>
                <Icon name="upi" size={18} />
                <input className="inp" placeholder="Or enter UPI ID (name@okbank)" aria-label="UPI ID" />
              </div>
            </>
          )}
        </div>
        <div className="t-cap" style={{ margin: "20px 0 10px" }}>
          Other options
        </div>
        {row("card", "card", "Credit / debit card", "Visa, Mastercard, RuPay")}
        {row("net", "bank", "Net banking", "All major Indian banks")}
      </div>
      {p === "card" && (
        <div className="card" style={{ marginTop: 10, boxShadow: "none" }}>
          <div className="field">
            <label className="lbl" htmlFor={`${uid}-cn`}>
              Card number
            </label>
            <div className="iw">
              <Icon name="card" size={18} />
              <input id={`${uid}-cn`} className="inp" inputMode="numeric" placeholder="1234 5678 9012 3456" autoComplete="cc-number" />
            </div>
          </div>
          <div className="grid2">
            <div>
              <label className="lbl" htmlFor={`${uid}-ce`}>
                Expiry
              </label>
              <input id={`${uid}-ce`} className="inp" placeholder="MM / YY" autoComplete="cc-exp" />
            </div>
            <div>
              <label className="lbl" htmlFor={`${uid}-cv`}>
                CVV
              </label>
              <input id={`${uid}-cv`} className="inp" placeholder="•••" inputMode="numeric" autoComplete="cc-csc" />
            </div>
          </div>
        </div>
      )}
      {p === "net" && (
        <div className="card" style={{ marginTop: 10, boxShadow: "none" }}>
          <label className="lbl" htmlFor={`${uid}-bk`}>
            Choose your bank
          </label>
          <select id={`${uid}-bk`} className="inp" defaultValue={BANKS[0]}>
            {BANKS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
      )}
    </>
  );
}

function PayButton() {
  const { s, set } = useApp();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const p = planPrice(tutorById(s.tutor).pricePerClass, s.plan);
  const pay = () => {
    setBusy(true);
    timer.current = setTimeout(() => {
      set({ paid: true });
      router.push("/paid");
      setBusy(false);
    }, 1000);
  };
  return (
    <div className="paybox">
      <button type="button" className={`btn btn-p btn-block btn-lg${busy ? " loading" : ""}`} onClick={pay} aria-busy={busy}>
        {busy ? (
          <>
            <Spinner /> {s.pay === "upi" ? "Waiting for UPI approval…" : "Processing payment…"}
          </>
        ) : (
          <>
            <Icon name="lock" size={18} /> Pay {inr(p)}
            {s.pay === "upi" ? " by UPI" : ""}
          </>
        )}
      </button>
      <Guar>not happy? Switch tutor free — next first class on us.</Guar>
    </div>
  );
}

export function CheckoutScreen() {
  const { toast } = useActions();
  const terms = (
    <p className="fine">
      Secure payment · PCI-DSS compliant · By paying you agree to our{" "}
      <button type="button" onClick={() => toast("Terms of Service opened")}>
        Terms
      </button>
    </p>
  );
  return (
    <>
      <AppBar title="Checkout" back="/plans" />
      <div className="wrap">
        <Crumb items={[["Classes", "/classes"], ["Choose a plan", "/plans"], ["Checkout"]]} back="/plans" />
        <Desktop>
          <h1 className="d-h1" style={{ marginBottom: 20 }}>
            Checkout
          </h1>
        </Desktop>
        <div className="d-co">
          <Mobile>
            <div className="co-sum-m">
              <PaySummary />
            </div>
          </Mobile>
          <div className="panel co-methods">
            <h2 className="ph3">How do you want to pay?</h2>
            <PayMethods />
          </div>
          <Desktop>
            <aside className="d-co-r">
              <div className="panel">
                <PaySummary />
                <div style={{ marginTop: 16 }}>
                  <PayButton />
                </div>
                {terms}
              </div>
            </aside>
          </Desktop>
        </div>
      </div>
      <Mobile>
        <div className="mbot col">
          <PayButton />
        </div>
      </Mobile>
    </>
  );
}

/* ---------------- Paid ---------------- */
export function PaidScreen() {
  const { s } = useApp();
  const { toast } = useActions();
  const t = tutorById(s.tutor);
  const p = planPrice(t.pricePerClass, s.plan);
  const app = { gpay: "Google Pay", phonepe: "PhonePe", paytm: "Paytm" }[s.upiApp];
  const rows: [IconName, string, string][] = [
    ["wallet", "Paid", `${inr(p)} · ${s.pay === "upi" ? `${app} UPI` : s.pay === "card" ? "Card" : "Net banking"}`],
    ["book", "Plan", `${s.plan} classes / month`],
    ["user", "Tutor", t.name],
    ["calendar", "First class", dateLabel(s.pick)],
    ["doc", "Receipt", "#TFM-PAY-30418"],
  ];
  return (
    <>
      <Mobile>
        <div className="appbar" style={{ justifyContent: "flex-end" }}>
          <Link href="/classes" className="icbtn" aria-label="Close">
            <Icon name="x" size={20} />
          </Link>
        </div>
      </Mobile>
      <div className="wrap">
        <div className="d-cf">
          <div className="bstep succ" role="status">
            <OkCheck />
            <h1 className="succ-h">Payment done</h1>
            <p className="muted" style={{ marginTop: 6 }}>
              {t.first} is now your tutor. The receipt is in your email and WhatsApp.
            </p>
            <div className="cf-card">
              {rows.map(([i, l, v]) => (
                <div key={l} className="cf-row">
                  <Icon name={i} size={18} />
                  <span>{l}</span>
                  <b>{v}</b>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <Guar>switch tutor free, any time.</Guar>
            </div>
            <div className="grid2" style={{ marginTop: 16 }}>
              <Link href="/classes" className="btn btn-p">
                Go to Classes
              </Link>
              <button type="button" className="btn btn-s" onClick={() => toast("Receipt downloaded", "doc")}>
                Download receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
