"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { DASHBOARD, USER, dateLabel, inr, planPrice, tutorById } from "@/lib/data";
import { useActions } from "@/lib/actions";
import { useApp } from "@/lib/store";
import { Icon } from "../Icons";
import { BigStar, Portrait, Star1, Stars } from "../Portrait";
import { ProgressRing } from "../ProgressRing";
import { TabHead, Tog } from "../ui";
import { Desktop } from "../Variant";

function W({ cls = "", span, label, children }: { cls?: string; span: number; label: string; children: ReactNode }) {
  return (
    <section className={`w ${cls}`.trim()} style={{ gridColumn: `span ${span}` }} aria-label={label}>
      {children}
    </section>
  );
}

function LastClass() {
  const { s, set } = useApp();
  const { toast } = useActions();
  const aman = tutorById(DASHBOARD.lastClass.tutorId);
  return (
    <>
      <div className="row">
        <Portrait name={aman.name} ini={aman.initials} g={aman.g} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <b style={{ display: "block" }}>{DASHBOARD.lastClass.title}</b>
          <span className="muted" style={{ fontSize: 13 }}>
            {DASHBOARD.lastClass.when}
          </span>
        </div>
        <span className="badge badge-c">Done</span>
      </div>
      {s.rated ? (
        <div className="row" style={{ marginTop: 12, gap: 8 }}>
          <Stars r={s.rating} size={16} />
          <span className="muted" style={{ fontSize: 13 }}>
            Thanks — you rated this class.
          </span>
        </div>
      ) : s.rateOpen ? (
        <div style={{ marginTop: 14, textAlign: "center", background: "var(--light-2)", borderRadius: 12, padding: 12 }}>
          <div className="muted" style={{ fontSize: 13 }}>
            How was the class with Aman?
          </div>
          <div className="rate-pick" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} type="button" role="radio" aria-checked={s.rating === i} className={i <= s.rating ? "on" : ""} aria-label={`${i} star${i > 1 ? "s" : ""}`} onClick={() => set({ rating: i })}>
                <BigStar size={30} />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-p btn-sm btn-block"
            disabled={!s.rating}
            onClick={() => {
              set({ rated: true });
              toast("Thanks for rating Aman!", "star");
            }}
          >
            Submit rating
          </button>
        </div>
      ) : (
        <div className="row between" style={{ marginTop: 12 }}>
          <span className="muted" style={{ fontSize: 13 }}>
            How was the class?
          </span>
          <button type="button" className="btn btn-s btn-sm" onClick={() => set({ rateOpen: true })}>
            <Star1 size={14} /> Rate
          </button>
        </div>
      )}
    </>
  );
}

/** Classes = parent dashboard; each widget does one job */
function Dashboard() {
  const { s, set } = useApp();
  const { chatWith, addToCalendar, toast } = useActions();
  const t = tutorById(s.tutor);
  const parent = s.role === "parent";
  const p = planPrice(t.pricePerClass, s.plan);
  const modeLabel = s.bk.mode === "Home" ? `Home visit · ${USER.city.split(",")[0]}` : "Online class";

  const next = (
    <W key="next" cls="w-next" span={8} label="Next class">
      <div className="w-h">
        <span className="t-cap">Next class</span>
        <span className="badge badge-t" style={{ background: "rgba(142,227,216,.16)", color: "#8EE3D8" }}>
          {s.paid ? `Class 1 of ${s.plan}` : "Free demo · ₹0"}
        </span>
      </div>
      <div className="nx-when">{dateLabel(s.pick)}</div>
      <div className="nx-what">
        {s.bk.subject} with {t.name} · {modeLabel}
      </div>
      <div className="nx-row">
        <Portrait name={t.name} ini={t.initials} g={t.g} size={40} />
        <button type="button" className="btn btn-w btn-sm" onClick={() => chatWith(t)}>
          <Icon name="chat" size={16} /> Message
        </button>
        <button type="button" className="btn btn-g btn-sm" onClick={() => toast(`Reschedule request sent to ${t.first}`, "calendar")}>
          Reschedule
        </button>
        <button type="button" className="btn btn-g btn-sm" onClick={addToCalendar}>
          <Icon name="calPlus" size={16} /> Calendar
        </button>
      </div>
    </W>
  );
  const pay = s.paid ? (
    <W key="pay" cls="w-paid" span={4} label="Payments">
      <div className="w-h">
        <span className="t-cap" style={{ color: "var(--teal-d)" }}>
          Payments
        </span>
      </div>
      <div className="pay-amt" style={{ color: "var(--teal-d)" }}>
        All paid
      </div>
      <p className="muted" style={{ margin: "4px 0 0" }}>
        {s.plan} classes with {t.first} · next bill 20 Nov
      </p>
    </W>
  ) : (
    <W key="pay" cls="w-pay" span={4} label="Pay due">
      <div className="w-h">
        <span className="t-cap">Pay due</span>
        <span className="badge badge-a">Due 20 Oct</span>
      </div>
      <div className="pay-amt">{inr(p)}</div>
      <p>
        {t.first} · {s.plan} classes after the demo
      </p>
      <Link href="/checkout" className="btn btn-amber btn-block">
        Pay {inr(p)}
      </Link>
    </W>
  );
  const prog = (
    <W key="prog" span={5} label="Progress by subject">
      <div className="w-h">
        <span className="t-cap">Progress by subject</span>
        <button type="button" className="link" style={{ fontSize: 13 }} onClick={() => toast(`Weekly report sent to ${USER.parent}`, "doc")}>
          Weekly report
        </button>
      </div>
      <div className="rings">
        {DASHBOARD.progress.map(([sub, v, d]) => (
          <ProgressRing key={sub} value={v} label={sub} delta={d} />
        ))}
      </div>
    </W>
  );
  const streak = (
    <W key="streak" span={3} label="Attendance streak">
      <div className="w-h">
        <span className="t-cap">Attendance</span>
        <Icon name="fire" size={18} />
      </div>
      <div className="streak-n">{DASHBOARD.streak}</div>
      <div className="muted" style={{ fontSize: 14 }}>
        classes in a row
      </div>
      <div className="streak" role="img" aria-label="Last 14 classes: 13 attended">
        {DASHBOARD.attendance.map((a, i) => (
          <i key={i} className={`${a ? "y" : ""}${i === 13 ? " t" : ""}`} />
        ))}
      </div>
    </W>
  );
  const done = DASHBOARD.homework.filter(([k]) => s.hw[k]).length;
  const hw = (
    <W key="hw" span={4} label="Homework due">
      <div className="w-h">
        <span className="t-cap">Homework due</span>
        <span className="t-sm muted tnum">
          {done}/{DASHBOARD.homework.length} done
        </span>
      </div>
      {DASHBOARD.homework.map(([k, a, b]) => (
        <button key={k} type="button" className={`hw${s.hw[k] ? " done" : ""}`} role="checkbox" aria-checked={!!s.hw[k]} onClick={() => set({ hw: { ...s.hw, [k]: !s.hw[k] } })}>
          <span className="cb">{s.hw[k] && <Icon name="check" size={14} stroke={3} />}</span>
          <span className="ht">
            {a}
            <small>{b}</small>
          </span>
        </button>
      ))}
    </W>
  );
  const cont = s.paid ? null : (
    <W key="cont" cls="w-cont" span={7} label="Continue with tutor">
      <Portrait name={t.name} ini={t.initials} g={t.g} size={64} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="t-cap" style={{ color: "var(--teal-d)" }}>
          After the demo
        </div>
        <div style={{ fontSize: 20, lineHeight: "28px", fontWeight: 700 }}>Continue with {t.first}</div>
        <p className="muted" style={{ fontSize: 14 }}>
          Choose 4, 8 or 12 classes a month. Pay by UPI.
        </p>
      </div>
      <Link href="/plans" className="btn btn-p">
        Choose plan <Icon name="arrowR" size={16} />
      </Link>
    </W>
  );
  const past = (
    <W key="past" span={parent ? (s.paid ? 12 : 5) : 4} label="Last class">
      <div className="w-h">
        <span className="t-cap">Last class</span>
      </div>
      <LastClass />
    </W>
  );
  const order = parent ? [next, pay, prog, streak, hw, cont, past] : [next, hw, prog, streak, past];
  return <div className="dash stag run">{order}</div>;
}

function RoleTog() {
  const { s, set } = useApp();
  return (
    <Tog
      items={[
        ["parent", "", "Parent"],
        ["student", "", "Student"],
      ]}
      value={s.role}
      onChange={(v) => set({ role: v })}
      className="mini"
      ariaLabel="View as"
    />
  );
}

/** Mobile: Parent ↔ Student as an iOS switch beside the large title */
function RoleSwitch() {
  const { s, set } = useApp();
  const on = s.role === "student";
  return (
    <label className="m-swrow">
      <span>Student view</span>
      <button type="button" className={`switch${on ? " on" : ""}`} role="switch" aria-checked={on} aria-label="Student view" onClick={() => set({ role: on ? "parent" : "student" })} />
    </label>
  );
}

export function ClassesScreen() {
  const { s } = useApp();
  return (
    <>
      <TabHead title="Classes" right={<RoleSwitch />} />
      <div className="wrap">
        <Desktop>
          <div className="row between" style={{ marginBottom: 24, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div>
              <div className="t-cap">{s.role === "parent" ? `Parent view · ${USER.parent}` : `Student view · ${USER.first}`}</div>
              <h1 className="d-h1" style={{ marginTop: 4 }}>
                Classes
              </h1>
            </div>
            <RoleTog />
          </div>
        </Desktop>
        <Dashboard />
      </div>
    </>
  );
}
