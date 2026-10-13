"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type ReactNode } from "react";
import { USER, inr, planPrice, tutorById } from "@/lib/data";
import { useActions } from "@/lib/actions";
import { useApp } from "@/lib/store";
import { Flag } from "../Illustration";
import { Icon, type IconName } from "../Icons";
import { Avatar } from "../Portrait";
import { TabHead } from "../ui";
import { Desktop, Mobile } from "../Variant";

type PrefKey = "sms" | "wa" | "mail" | "report";

function Switch({ k, label }: { k: PrefKey; label: string }) {
  const { s, update } = useApp();
  const on = s.pf.prefs[k];
  return (
    <button
      type="button"
      className={`switch${on ? " on" : ""}`}
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => update((st) => ({ ...st, pf: { ...st.pf, prefs: { ...st.pf.prefs, [k]: !on } } }))}
    />
  );
}

function EduGrid() {
  const { s, update } = useApp();
  const p = s.pf;
  const setPf = (patch: Partial<typeof p>) => update((st) => ({ ...st, pf: { ...st.pf, ...patch } }));
  if (!p.edit)
    return (
      <div className="edu">
        <div>
          <span>Class</span>
          <b>{p.grade}</b>
        </div>
        <div>
          <span>Board</span>
          <b>{p.board}</b>
        </div>
        <div>
          <span>Target</span>
          <b>{p.target}</b>
        </div>
      </div>
    );
  const sel = (k: "grade" | "board" | "target", label: string, arr: string[]) => (
    <div>
      <label>
        <span>{label}</span>
        <select value={p[k]} onChange={(e) => setPf({ [k]: e.target.value })}>
          {arr.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
    </div>
  );
  return (
    <div className="edu">
      {sel("grade", "Class", ["Class 10", "Class 11", "Class 12"])}
      {sel("board", "Board", ["CBSE", "ICSE", "State Board", "IB"])}
      {sel("target", "Target", ["Boards", "JEE", "NEET", "University"])}
    </div>
  );
}

function EduEditBtn({ style }: { style?: React.CSSProperties }) {
  const { s, update } = useApp();
  const { toast } = useActions();
  return (
    <button
      type="button"
      className="link"
      style={style}
      onClick={() => {
        const editing = s.pf.edit;
        update((st) => ({ ...st, pf: { ...st.pf, edit: !st.pf.edit } }));
        if (editing) toast("Educational details saved", "check");
      }}
    >
      {s.pf.edit ? (
        <>
          <Icon name="check" size={15} stroke={2.4} /> Save
        </>
      ) : (
        <>
          <Icon name="edit" size={15} /> Edit
        </>
      )}
    </button>
  );
}

function GuardianForm() {
  const { toast } = useActions();
  const uid = useId();
  return (
    <>
      <div className="grid2">
        <div className="field">
          <label className="lbl" htmlFor={`${uid}-n`}>
            Guardian Name
          </label>
          <input id={`${uid}-n`} className="inp" defaultValue={USER.parent} />
        </div>
        <div className="field">
          <label className="lbl" htmlFor={`${uid}-r`}>
            Relationship
          </label>
          <select id={`${uid}-r`} className="inp" defaultValue="Mother">
            {["Mother", "Father", "Guardian"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid2">
        <div className="field">
          <label className="lbl" htmlFor={`${uid}-p`}>
            Phone
          </label>
          <div className="ph-inp">
            <span className="cc">
              <Flag /> +91
            </span>
            <input id={`${uid}-p`} className="inp" type="tel" defaultValue="98110 22457" />
          </div>
        </div>
        <div className="field">
          <label className="lbl" htmlFor={`${uid}-e`}>
            Email
          </label>
          <input id={`${uid}-e`} className="inp" type="email" defaultValue="sunita.a@example.com" />
        </div>
      </div>
      <div className="pref">
        <span className="tt">
          Send weekly progress reports<small>Every Sunday at 7:00 PM on WhatsApp and email</small>
        </span>
        <Switch k="report" label="Weekly progress reports" />
      </div>
      <button type="button" className="btn btn-p" style={{ marginTop: 12 }} onClick={() => toast("Guardian details saved", "check")}>
        Save Guardian Details
      </button>
    </>
  );
}

function Panel({ title, sub, right, children, style }: { title: string; sub?: string; right?: ReactNode; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="pf-panel" style={style}>
      <h3>
        {title}
        {right}
      </h3>
      {sub && <p className="muted">{sub}</p>}
      {children}
    </div>
  );
}

/** One profile panel (shared by the desktop side menu and the mobile list) */
function PfPanel({ tab }: { tab: string }) {
  const { s } = useApp();
  const { toast } = useActions();
  const uid = useId();
  const t = tutorById(s.tutor);
  const price = planPrice(t.pricePerClass, s.plan);
  switch (tab) {
    case "edu":
      return (
        <>
          <Panel title="Educational Details" sub="Tutors use this to plan your lessons." right={<EduEditBtn style={{ fontSize: 14 }} />}>
            <EduGrid />
          </Panel>
          <Panel title="Guardian Details" sub="We send booking updates and progress reports to your guardian.">
            <GuardianForm />
          </Panel>
        </>
      );
    case "guardian":
      return (
        <Panel title="Guardian Details" sub="We send booking updates and progress reports to your guardian.">
          <GuardianForm />
        </Panel>
      );
    case "personal":
      return (
        <Panel title="Personal Details" sub="Keep your contact details up to date.">
          <div className="grid2">
            <div className="field">
              <label className="lbl" htmlFor={`${uid}-f`}>
                First Name
              </label>
              <input id={`${uid}-f`} className="inp" defaultValue="Divyanshi" autoComplete="given-name" />
            </div>
            <div className="field">
              <label className="lbl" htmlFor={`${uid}-l`}>
                Last Name
              </label>
              <input id={`${uid}-l`} className="inp" defaultValue="Agrahari" autoComplete="family-name" />
            </div>
          </div>
          <div className="grid2">
            <div className="field">
              <label className="lbl" htmlFor={`${uid}-p`}>
                Mobile
              </label>
              <div className="ph-inp">
                <span className="cc">
                  <Flag /> +91
                </span>
                <input id={`${uid}-p`} className="inp" defaultValue={USER.phoneLocal} type="tel" />
              </div>
            </div>
            <div className="field">
              <label className="lbl" htmlFor={`${uid}-e`}>
                Email
              </label>
              <input id={`${uid}-e`} className="inp" defaultValue={USER.email} type="email" />
            </div>
          </div>
          <div className="field">
            <label className="lbl" htmlFor={`${uid}-a`}>
              Home Address (for tutor visits)
            </label>
            <textarea id={`${uid}-a`} className="inp" defaultValue="Tower B, Flat 1204, Sector 56, Gurgaon, Haryana 122011" />
          </div>
          <button type="button" className="btn btn-p" onClick={() => toast("Personal details saved", "check")}>
            Save Changes
          </button>
        </Panel>
      );
    case "security":
      return (
        <Panel title="Sign-In & Security" sub="Control how you log in to TutorForMe.">
          <div className="pref">
            <span className="tt">
              Login with OTP<small>{USER.phone} · verified</small>
            </span>
            <span className="badge badge-t">
              <Icon name="check" size={13} stroke={2.4} /> On
            </span>
          </div>
          <div className="pref">
            <span className="tt">
              Password<small>Add a password as a backup login</small>
            </span>
            <button type="button" className="btn btn-s btn-sm" onClick={() => toast("Password setup link sent by SMS", "check")}>
              Set password
            </button>
          </div>
          <div className="pref">
            <span className="tt">
              Two-step verification<small>Ask for an OTP on new devices</small>
            </span>
            <Switch k="mail" label="Two-step verification" />
          </div>
          <div className="pref">
            <span className="tt">
              Active devices<small>iPhone 15 · Gurgaon · this device</small>
            </span>
            <button type="button" className="link" onClick={() => toast("Signed out of other devices", "check")}>
              Sign out others
            </button>
          </div>
        </Panel>
      );
    case "wallet":
      return (
        <>
          <div className="pf-panel" style={{ background: "linear-gradient(120deg,var(--navy),#2D5478 70%,var(--blue))", color: "#fff" }}>
            <div className="ovl" style={{ color: "rgba(255,255,255,.7)" }}>
              Wallet balance
            </div>
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-.03em", margin: "4px 0", lineHeight: 1.2 }}>{inr(USER.wallet)}</div>
            <p style={{ opacity: 0.8, fontSize: 13.5 }}>Used automatically on your next monthly plan.</p>
            <div className="row" style={{ marginTop: 16, flexWrap: "wrap" }}>
              <button type="button" className="btn btn-w btn-sm" onClick={() => toast("Add money: UPI request sent", "check")}>
                Add Money
              </button>
              <button type="button" className="btn btn-sm" style={{ border: "1.5px solid rgba(255,255,255,.5)", color: "#fff" }} onClick={() => toast("Referral link copied", "check")}>
                Refer &amp; earn ₹200
              </button>
            </div>
          </div>
          <Panel title="Recent activity">
            <div className="tx">
              <span className="lic" style={{ background: "var(--teal-l)", color: "var(--teal)" }}>
                <Icon name="sparkle" size={18} />
              </span>
              <span className="tt">
                Welcome credit<small>Mon, 5 Oct 2026</small>
              </span>
              <b style={{ color: "var(--teal-d)" }}>+ ₹450</b>
            </div>
            <div className="tx">
              <span className="lic" style={{ background: "var(--blue-l)", color: "var(--blue)" }}>
                <Icon name="upi" size={18} />
              </span>
              <span className="tt">
                {s.paid ? `${s.plan}-class plan · ${t.name}` : `Free demo · ${t.name}`}
                <small>{s.paid ? "Paid via UPI" : "₹0 · no card needed"}</small>
              </span>
              <b>{s.paid ? `− ${inr(price)}` : "₹0"}</b>
            </div>
          </Panel>
        </>
      );
    case "purchases":
      return (
        <Panel title="My Purchases" sub="Your plans and receipts.">
          <div className="tx">
            <span className="lic" style={{ background: "var(--blue-l)", color: "var(--blue)" }}>
              <Icon name="award" size={18} />
            </span>
            <span className="tt">
              {s.plan} classes / month · {s.bk.subject}
              <small>{t.name} · Oct 2026</small>
            </span>
            {s.paid ? <span className="badge badge-t">Paid {inr(price)}</span> : <span className="badge badge-a">Due {inr(price)}</span>}
          </div>
          <div className="tx">
            <span className="lic" style={{ background: "var(--light)", color: "var(--navy)" }}>
              <Icon name="book" size={18} />
            </span>
            <span className="tt">
              English · 4 classes<small>Aman Jaiswal · Sep 2026</small>
            </span>
            <span className="badge badge-c">Completed</span>
          </div>
          <button type="button" className="btn btn-s btn-sm" style={{ marginTop: 14 }} onClick={() => toast(`Receipts emailed to ${USER.email}`, "mail")}>
            Email all receipts
          </button>
        </Panel>
      );
    default: {
      const sw = (k: PrefKey, title: string, sub: string) => (
        <div className="pref" key={k}>
          <span className="tt">
            {title}
            <small>{sub}</small>
          </span>
          <Switch k={k} label={title} />
        </div>
      );
      return (
        <Panel title="Preferences" sub="Choose how we keep you updated.">
          {sw("sms", "Class reminders by SMS", "1 hour before every class")}
          {sw("wa", "WhatsApp updates", "Booking confirmations and tutor messages")}
          {sw("mail", "Email newsletter", "Study tips once a month")}
          {sw("report", "Weekly progress report", "Shared with your guardian every Sunday")}
        </Panel>
      );
    }
  }
}

const MENU: [string, [string, IconName, string][]][] = [
  [
    "ACCOUNT",
    [
      ["personal", "user", "Personal Details"],
      ["security", "key", "Sign-In & Security"],
      ["guardian", "family", "Guardian Details"],
    ],
  ],
  [
    "PAYMENTS & PREFERENCES",
    [
      ["wallet", "wallet", "My Wallet"],
      ["purchases", "bag", "My Purchases"],
      ["prefs", "sliders", "Preferences"],
    ],
  ],
];

function useSignOut() {
  const { reset } = useApp();
  const router = useRouter();
  const { toast } = useActions();
  return () => {
    reset();
    router.push("/");
    toast("Signed out", "logout", "/");
  };
}

/** shown at the top of the profile card while browsing without an account */
function GuestLine({ center = false }: { center?: boolean }) {
  const { openAuth } = useActions();
  return (
    <p className="t-sm muted" style={{ margin: "0 0 12px", textAlign: center ? "center" : undefined }}>
      You&apos;re browsing as a guest ·{" "}
      <button type="button" className="link" onClick={() => openAuth("login")}>
        Log in
      </button>
    </p>
  );
}

export function ProfileScreen() {
  const { s, update } = useApp();
  const { toast } = useActions();
  const signOut = useSignOut();
  const [openRow, setOpenRow] = useState<string | null>(null);
  const tab = s.pf.tab;
  return (
    <>
      {/* desktop: side menu + panels */}
      <Desktop>
        <div className="wrap">
          <div className="d-pf">
            <aside className="pf-menu" aria-label="Profile sections">
              {!s.loggedIn && <GuestLine />}
              <div className="pf-id">
                <Avatar ini="DA" size={52} g={4} label={USER.name} />
                <div>
                  <b>{USER.name}</b>
                  <span>{USER.phone}</span>
                </div>
              </div>
              <button type="button" className={`mi${tab === "edu" ? " on" : ""}`} aria-current={tab === "edu" ? "true" : undefined} onClick={() => update((st) => ({ ...st, pf: { ...st.pf, tab: "edu", edit: false } }))}>
                <Icon name="grad" size={18} /> Educational Details
              </button>
              {MENU.map(([g, items]) => (
                <div key={g}>
                  <div className="grp">{g}</div>
                  {items.map(([k, i, l]) => (
                    <button key={k} type="button" className={`mi${tab === k ? " on" : ""}`} aria-current={tab === k ? "true" : undefined} onClick={() => update((st) => ({ ...st, pf: { ...st.pf, tab: k, edit: false } }))}>
                      <Icon name={i} size={18} /> {l}
                      {k === "wallet" && <em>{inr(USER.wallet)}</em>}
                    </button>
                  ))}
                </div>
              ))}
              {s.loggedIn && (
                <>
                  <div className="divider" style={{ margin: "10px 0" }} />
                  <button type="button" className="mi danger" onClick={signOut}>
                    <Icon name="logout" size={18} /> Sign Out
                  </button>
                </>
              )}
              <div className="ver" style={{ margin: "14px 0 4px" }}>
                TUTORFORME v2.0
              </div>
            </aside>
            <section aria-live="polite">
              <PfPanel tab={tab} />
            </section>
          </div>
        </div>
      </Desktop>

      {/* mobile: header + list (rows expand into their panel) */}
      <Mobile>
        <div>
          <TabHead
            title="My Profile"
            right={
              <button type="button" className="icbtn" aria-label="Settings" onClick={() => toast("Settings", "sliders")}>
                <Icon name="sliders" size={19} />
              </button>
            }
          />
          <div className="m-wrap">
            <div className="pf-head">
              {!s.loggedIn && <GuestLine center />}
              <Avatar ini="DA" size={88} g={4} ring label={USER.name} />
              <h1>{USER.name}</h1>
              <p>Student · Class 12 · {USER.phone}</p>
              <span className="badge badge-t" style={{ marginTop: 8 }}>
                <Icon name="family" size={13} /> Parent: {USER.parent}
              </span>
            </div>
            <div className="pf-sec">
              <div className="card" style={{ marginTop: 18 }}>
                <div className="row between">
                  <span className="ovl">Educational Details</span>
                  <EduEditBtn />
                </div>
                <EduGrid />
              </div>
              {MENU.map(([g, items]) => (
                <div key={g}>
                  <div className="ovl" style={{ margin: "22px 0 10px" }}>
                    {g}
                  </div>
                  <div className="list">
                    {items.map(([k, i, l]) => (
                      <div key={k}>
                        <button type="button" className="lrow" aria-expanded={openRow === k} onClick={() => setOpenRow(openRow === k ? null : k)}>
                          <span className="lic">
                            <Icon name={i} size={18} />
                          </span>
                          <span className="lt">{l}</span>
                          {k === "wallet" && <b style={{ color: "var(--teal-d)", fontSize: 14 }}>{inr(USER.wallet)}</b>}
                          <span className="chev" style={{ transform: openRow === k ? "rotate(90deg)" : undefined, transition: "transform .2s" }}>
                            <Icon name="chevR" size={18} />
                          </span>
                        </button>
                        {openRow === k && (
                          <div className="pf-inline">
                            <PfPanel tab={k} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {s.loggedIn && (
                <button type="button" className="signout" onClick={signOut}>
                  <Icon name="logout" size={18} /> Sign Out
                </button>
              )}
              <div className="ver">TUTORFORME v2.0</div>
            </div>
          </div>
        </div>
      </Mobile>
    </>
  );
}
