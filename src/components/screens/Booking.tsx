"use client";

import Link from "next/link";
import { useId } from "react";
import { GOALS, USER, dateLabel, slotDay, slotTime, tutorBySlug, type Tutor } from "@/lib/data";
import { useActions } from "@/lib/actions";
import { useApp, type AppState } from "@/lib/store";
import { Heatmap, Picked, TimeChips } from "../Heatmap";
import { Flag, OkCheck } from "../Illustration";
import { Icon, type IconName } from "../Icons";
import { Portrait, Star1 } from "../Portrait";
import { appScrollTo } from "@/lib/native";
import { AppBar, ChipGroup, ChipMulti, Crumb, Guar, Tog } from "../ui";
import { Desktop } from "../Variant";

const BSTEPS = ["Pick a slot", "Student details", "Confirm", "Done"];
type Step = AppState["bookStep"];

function Progress({ n }: { n: Step }) {
  return (
    <div className="bprog">
      <div className="bprog-h">
        <span>
          <b>Step {n} of 4</b> · {BSTEPS[n - 1]}
        </span>
        <span>{n < 4 ? "Free demo · ₹0" : "All set"}</span>
      </div>
      <div className="bar4" role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={n} aria-label="Booking progress">
        {[1, 2, 3, 4].map((i) => (
          <i key={i} className={i < n ? "done" : i === n ? "on" : ""} />
        ))}
      </div>
    </div>
  );
}

/** Completed steps collapse into summary chips (editable until the booking is done) */
function SummaryChips({ n, setStep }: { n: Step; setStep: (n: Step) => void }) {
  const { s } = useApp();
  if (n < 2) return null;
  const b = s.bk;
  const items: [Step, string, string][] = [
    [1, "Slot", `${dateLabel(s.pick)} · ${b.mode === "Home" ? "Home visit" : "Online"}`],
    [2, "Student", `${b.student.split(" ")[0]} · ${b.cls} · ${b.board} · ${b.subject}`],
    [3, "Contact", [b.parent.trim(), b.phone.trim() && `+91 ${b.phone.trim()}`].filter(Boolean).join(" · ") || "Not shared (optional)"],
  ];
  return (
    <div className="sumchips">
      {items.slice(0, n - 1).map(([g, l, v]) =>
        n < 4 ? (
          <button key={l} type="button" className="sumchip" onClick={() => setStep(g)} aria-label={`Edit ${l}: ${v}`}>
            <span className="ck">
              <Icon name="check" size={14} stroke={3} />
            </span>
            <span>
              <b>{l}</b>
              {v}
            </span>
            <em>Edit</em>
          </button>
        ) : (
          <div key={l} className="sumchip">
            <span className="ck">
              <Icon name="check" size={14} stroke={3} />
            </span>
            <span>
              <b>{l}</b>
              {v}
            </span>
          </div>
        ),
      )}
    </div>
  );
}

function BookSide({ t }: { t: Tutor }) {
  const { s } = useApp();
  return (
    <div className="bcard">
      <div className="bc-mini">
        <Portrait name={t.name} ini={t.initials} g={t.g} size={56} />
        <div>
          <b>{t.name}</b>
          <span>
            <Star1 size={12} /> {t.rating} · {t.subjects.slice(0, 2).join(" & ")}
          </span>
        </div>
      </div>
      <span className="badge badge-t bc-zero">
        <Icon name="sparkle" size={13} /> Free demo · ₹0 · No card needed
      </span>
      <div className="bc-lines">
        <div>
          <span>When</span>
          <b>{dateLabel(s.pick)}</b>
        </div>
        <div>
          <span>Length</span>
          <b>60 min</b>
        </div>
        <div>
          <span>Where</span>
          <b>{s.bk.mode === "Home" ? "Your home" : "Online"}</b>
        </div>
        <div>
          <span>You pay today</span>
          <b>₹0</b>
        </div>
      </div>
      <Guar>switch tutor free, any time.</Guar>
      <div className="bc-reply">
        <Icon name="clock" size={15} /> {t.first} replies in {t.replyTime}
      </div>
    </div>
  );
}

function Step1({ t, next }: { t: Tutor; next: () => void }) {
  const { s, update } = useApp();
  return (
    <div className="bstep">
      <h2>Pick a time for the free demo</h2>
      <p className="muted">Darker squares have more open slots. Tap a square, then a time.</p>
      <Heatmap heat={t.availability} />
      <TimeChips heat={t.availability} />
      <div className="lbl" style={{ marginTop: 20 }}>
        Where should {t.first} teach?
      </div>
      <Tog
        items={t.mode.map((x) => [x, x === "Home" ? "home" : "video"] as const)}
        value={s.bk.mode}
        onChange={(v) => update((st) => ({ ...st, bk: { ...st.bk, mode: v } }))}
        className="full"
        ariaLabel={`Where should ${t.first} teach?`}
      />
      <p className="t-sm muted" style={{ marginTop: 8 }}>
        {s.bk.mode === "Home" ? `${t.first} will come to ${USER.city} (${t.distanceKm} km away).` : "Live video class with a shared whiteboard."}
      </p>
      <Picked />
      <button type="button" className="btn btn-p btn-block btn-lg" onClick={next}>
        Continue <Icon name="arrowR" size={18} />
      </button>
    </div>
  );
}

const CLASS_OPTS = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];

function Step2({ t, next }: { t: Tutor; next: () => void }) {
  const { s, update } = useApp();
  const uid = useId();
  const b = s.bk;
  const setBk = (patch: Partial<typeof b>) => update((st) => ({ ...st, bk: { ...st.bk, ...patch } }));
  return (
    <div className="bstep">
      <h2>Who is the demo for?</h2>
      <p className="muted">This helps {t.first} plan the first class.</p>
      <div className="field">
        <label className="lbl" htmlFor={`${uid}-stu`}>
          Student name
        </label>
        <div className="iw">
          <Icon name="user" size={18} />
          <input id={`${uid}-stu`} className="inp" value={b.student} autoComplete="name" onChange={(e) => setBk({ student: e.target.value })} />
        </div>
      </div>
      <div className="grid2">
        <div className="field">
          <label className="lbl" htmlFor={`${uid}-cls`}>
            Class
          </label>
          <select id={`${uid}-cls`} className="inp" value={b.cls} onChange={(e) => setBk({ cls: e.target.value })}>
            {CLASS_OPTS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="lbl" htmlFor={`${uid}-sub`}>
            Subject
          </label>
          <select id={`${uid}-sub`} className="inp" value={b.subject} onChange={(e) => setBk({ subject: e.target.value })}>
            {t.subjects.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <span className="lbl">Board</span>
        <ChipGroup items={["CBSE", "ICSE", "State"]} value={b.board} onChange={(v) => setBk({ board: v })} ariaLabel="Board" />
      </div>
      <div className="field">
        <span className="lbl">
          Goals{" "}
          <span className="muted" style={{ fontWeight: 500 }}>
            · pick any
          </span>
        </span>
        <ChipMulti
          items={GOALS}
          value={b.goals}
          ariaLabel="Goals"
          onToggle={(v) => setBk({ goals: b.goals.includes(v) ? b.goals.filter((x) => x !== v) : [...b.goals, v] })}
        />
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label className="lbl" htmlFor={`${uid}-info`}>
          Anything {t.first} should know?{" "}
          <span className="muted" style={{ fontWeight: 500 }}>
            (optional)
          </span>
        </label>
        <textarea
          id={`${uid}-info`}
          className="inp"
          placeholder="E.g. Needs help with mechanics numericals before pre-boards."
          value={b.info}
          onChange={(e) => setBk({ info: e.target.value })}
        />
      </div>
      <button type="button" className="btn btn-p btn-block btn-lg" onClick={next}>
        Continue <Icon name="arrowR" size={18} />
      </button>
    </div>
  );
}

/** Confirm — no account, no OTP: optional contact details + one tap to book */
function Step3({ t, next }: { t: Tutor; next: () => void }) {
  const { s, update } = useApp();
  const uid = useId();
  const b = s.bk;
  const setBk = (patch: Partial<typeof b>) => update((st) => ({ ...st, bk: { ...st.bk, ...patch } }));
  return (
    <div className="bstep">
      <h2>Confirm your demo</h2>
      <p className="muted">No account, no code, no payment. Check the details and book.</p>
      <div className="cf-card" style={{ marginTop: 16 }}>
        <div className="cf-row">
          <Icon name="calendar" size={18} />
          <span>Demo</span>
          <b>
            {t.first} · {b.subject} · {dateLabel(s.pick)}
          </b>
        </div>
      </div>
      <div className="field" style={{ marginTop: 20 }}>
        <label className="lbl" htmlFor={`${uid}-par`}>
          Parent&apos;s name{" "}
          <span className="muted" style={{ fontWeight: 500 }}>
            (optional)
          </span>
        </label>
        <div className="iw">
          <Icon name="user" size={18} />
          <input id={`${uid}-par`} className="inp" value={b.parent} autoComplete="name" placeholder="E.g. Sunita Agrahari" onChange={(e) => setBk({ parent: e.target.value })} />
        </div>
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label className="lbl" htmlFor={`${uid}-ph`}>
          Mobile number{" "}
          <span className="muted" style={{ fontWeight: 500 }}>
            · Optional — so the tutor can reach you
          </span>
        </label>
        <div className="ph-inp">
          <span className="cc">
            <Flag /> +91
          </span>
          <input
            id={`${uid}-ph`}
            className="inp"
            type="tel"
            inputMode="numeric"
            maxLength={11}
            placeholder="98723 46350"
            value={b.phone}
            autoComplete="tel-national"
            onChange={(e) => setBk({ phone: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && next()}
          />
        </div>
      </div>
      <button type="button" className="btn btn-p btn-block btn-lg" onClick={next}>
        <Icon name="check" size={18} stroke={2.6} /> Book free demo · ₹0
      </button>
    </div>
  );
}

function Step4({ t }: { t: Tutor }) {
  const { s } = useApp();
  const { addToCalendar, chatWith } = useActions();
  const b = s.bk;
  const rows: [IconName, string, string][] = [
    ["user", "Tutor", t.name],
    ["book", "Subject", `${b.subject} · ${b.cls}`],
    ["calendar", "Date", slotDay(s.pick)],
    ["clock", "Time", `${slotTime(s.pick)} · 60 min`],
    ["home", "Where", b.mode === "Home" ? `Home visit · ${USER.city.split(",")[0]}` : "Online class"],
    ["wallet", "Cost", "₹0 · free demo"],
  ];
  return (
    <div className="bstep succ" role="status">
      <OkCheck />
      <h2>Demo booked!</h2>
      <p className="muted" style={{ marginTop: 6 }}>
        {t.first} will confirm within {t.replyTime.replace("~", "")}.{" "}
        {b.phone.trim() ? `Details sent to +91 ${b.phone.trim()} on WhatsApp.` : "You will see the reply in Chat."}
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
      <div className="grid2" style={{ marginTop: 20 }}>
        <button type="button" className="btn btn-p" onClick={addToCalendar}>
          <Icon name="calPlus" size={18} /> Add to calendar
        </button>
        <button type="button" className="btn btn-s" onClick={() => chatWith(t)}>
          <Icon name="chat" size={17} /> Chat with {t.first}
        </button>
      </div>
      <Link href="/classes" className="skip">
        Go to Classes <Icon name="arrowR" size={15} style={{ display: "inline-block", verticalAlign: "-3px" }} />
      </Link>
    </div>
  );
}

/** Booking — Scout-style progressive steps; finished steps collapse to summary chips */
export function BookingFlow({ slug }: { slug: string }) {
  const t = tutorBySlug(slug)!;
  const { s, update } = useApp();
  const n: Step = s.bookTutor === t.id ? s.bookStep : 1;
  const setStep = (k: Step) => {
    update((st) => ({ ...st, tutor: t.id, bookTutor: t.id, bookStep: k, booked: k === 4 ? true : st.booked }));
    if (typeof window !== "undefined") appScrollTo(0);
  };
  const body =
    n === 1 ? <Step1 t={t} next={() => setStep(2)} /> : n === 2 ? <Step2 t={t} next={() => setStep(3)} /> : n === 3 ? <Step3 t={t} next={() => setStep(4)} /> : <Step4 t={t} />;
  return (
    <div className="book-page">
      <AppBar title={n === 4 ? "Demo booked" : "Book free demo"} back={`/tutors/${t.slug}`} />
      <div className="wrap">
        <Crumb items={[["Find tutors", "/tutors"], [t.name, `/tutors/${t.slug}`], ["Book free demo"]]} back={`/tutors/${t.slug}`} />
        <div className="d-book">
          <div className="bflow" key={n}>
            <Progress n={n} />
            <SummaryChips n={n} setStep={setStep} />
            {body}
          </div>
          <Desktop>
            <aside className="bk-aside" aria-label="Demo summary">
              <BookSide t={t} />
            </aside>
          </Desktop>
        </div>
      </div>
    </div>
  );
}
