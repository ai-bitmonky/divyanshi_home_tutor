"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { clsRange, inr, similarTutors, tutorBySlug } from "@/lib/data";
import { useActions } from "@/lib/actions";
import { useApp } from "@/lib/store";
import { Heatmap, NextSlotChips, Picked, TimeChips } from "../Heatmap";
import { Icon, type IconName } from "../Icons";
import { Avatar, Portrait, Star1, Stars } from "../Portrait";
import { RatingBars } from "../RatingBars";
import { appScrollToEl } from "@/lib/native";
import { Sheet } from "../Sheet";
import { AppBar, Crumb, Guar } from "../ui";
import type { Tutor } from "@/lib/data";
import { Desktop, Mobile } from "../Variant";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) appScrollToEl(el, 84);
}

/** Mobile share / message sheet for a tutor */
function ShareSheet({ t, open, onClose }: { t: Tutor; open: boolean; onClose: () => void }) {
  const { chatWith, toast } = useActions();
  const url = typeof window !== "undefined" ? `${window.location.origin}/tutors/${t.slug}` : `/tutors/${t.slug}`;
  const rows: [IconName, string, string, () => void][] = [
    ["chat", `Message ${t.first}`, `Usually replies in ${t.replyTime}`, () => chatWith(t)],
    [
      "clip",
      "Copy link",
      url.replace(/^https?:\/\//, ""),
      () => {
        navigator.clipboard?.writeText(url).catch(() => {});
        toast("Profile link copied", "check");
      },
    ],
    [
      "share",
      "Share via…",
      "WhatsApp, SMS, email",
      () => {
        if (navigator.share) navigator.share({ title: `${t.name} · TutorForMe`, url }).catch(() => {});
        else toast("Profile link copied", "share");
      },
    ],
  ];
  return (
    <Sheet open={open} onClose={onClose} title={`Share ${t.first}'s profile`}>
      {(close) => (
        <div className="list ins">
          {rows.map(([i, l, sub, act]) => (
            <button
              key={l}
              type="button"
              className="lrow"
              onClick={() => {
                close();
                window.setTimeout(act, 230);
              }}
            >
              <span className="lic">
                <Icon name={i} size={18} />
              </span>
              <span className="lt">
                {l}
                <small>{sub}</small>
              </span>
              <span className="chev">
                <Icon name="chevR" size={18} />
              </span>
            </button>
          ))}
        </div>
      )}
    </Sheet>
  );
}

/** Intro video (16:9) placeholder — click to "play" with a fake progress bar */
function IntroVideo({ t }: { t: Tutor }) {
  const [playing, setPlaying] = useState(false);
  return (
    <button
      type="button"
      className={`vid${playing ? " playing" : ""}`}
      aria-label={`Play intro video of ${t.name}, ${t.videoDuration}`}
      aria-pressed={playing}
      onClick={() => setPlaying(!playing)}
    >
      <svg className="art" viewBox="0 0 480 270" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <circle cx="420" cy="20" r="130" fill="#fff" opacity=".06" />
        <circle cx="40" cy="270" r="100" fill="#fff" opacity=".05" />
        <g stroke="#fff" strokeOpacity=".07">
          {[45, 90, 135, 180, 225].map((y) => (
            <path key={y} d={`M0 ${y}h480`} />
          ))}
        </g>
        <circle cx="240" cy="112" r="40" fill="#fff" opacity=".16" />
        <path d="M152 270c6-62 42-92 88-92s82 30 88 92z" fill="#fff" opacity=".16" />
        <text x="456" y="48" textAnchor="end" fill="#fff" fillOpacity=".8" fontSize="20" fontStyle="italic" fontFamily="Georgia,serif">
          F = m × a
        </text>
        <rect x="20" y="152" width={150 + t.first.length * 9} height="34" rx="9" fill="#0A9A8A" />
        <text x="34" y="174" fill="#fff" fontSize="15" fontWeight="700" fontFamily="Inter,system-ui,sans-serif">
          Hi, I&apos;m {t.first} · {t.yearsExp} yrs
        </text>
      </svg>
      <span className="vtop">Intro video</span>
      <span className="play">
        <Icon name="play" size={26} />
      </span>
      <span className="eq">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="vcap">Meet {t.first}: how a class works</span>
      <span className="vdur">{t.videoDuration}</span>
      <span className="vprog" />
    </button>
  );
}

function ProfHead({ t }: { t: Tutor }) {
  const { s } = useApp();
  const { toggleFav } = useActions();
  const [share, setShare] = useState(false);
  const fav = !!s.favs[t.id];
  return (
    <>
      <div className="ph-head">
        <div className="ph-pic">
          <Portrait name={t.name} ini={t.initials} g={t.g} size={112} r={14} />
          <span className="tc-ver" title="Verified">
            <Icon name="check" size={14} stroke={3} />
          </span>
        </div>
        <div className="ph-id">
          <h1 className="ph-name">
            {t.name}
            {t.superTutor && (
              <span className="super">
                <Icon name="star" size={10} stroke={2.6} />
                Super Tutor
              </span>
            )}
          </h1>
          <div className="ph-title">
            {t.headline} · {t.boards.join("/")} · <span style={{ whiteSpace: "nowrap" }}>{clsRange(t)}</span>
          </div>
          <div className="ph-meta">
            <span>
              <Star1 size={15} /> <b style={{ color: "var(--navy)" }}>{t.rating}</b> ({t.reviews} reviews)
            </span>
            <span>
              <Icon name="users" size={15} /> {t.students} students · {t.lessons.toLocaleString("en-IN")} lessons
            </span>
            <span>
              <Icon name="globe" size={15} /> Speaks {t.languages.join(", ")}
            </span>
            <span>
              <Icon name="clock" size={15} /> Last active today · replies in {t.replyTime}
            </span>
          </div>
          <Mobile>
            <div className="ph-act">
              <button type="button" className={`icbtn${fav ? " on" : ""}`} aria-pressed={fav} aria-label="Save tutor" onClick={() => toggleFav(t.id)}>
                <Icon name={fav ? "heartF" : "heart"} size={19} />
              </button>
              <button type="button" className="icbtn" aria-label="Share or message" aria-haspopup="dialog" onClick={() => setShare(true)}>
                <Icon name="share" size={19} />
              </button>
            </div>
            <ShareSheet t={t} open={share} onClose={() => setShare(false)} />
          </Mobile>
        </div>
      </div>
      <div className="vlist-h">
        <span className="t-cap" style={{ color: "var(--teal-d)" }}>
          What we verified
        </span>
      </div>
      <div className="vlist">
        {t.verified.map(([, a, b]) => (
          <div key={a} className="vi">
            <span className="ck">
              <Icon name="check" size={13} stroke={3} />
            </span>
            <span>
              {a}
              <small>{b}</small>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function Matrix({ t }: { t: Tutor }) {
  const C = [6, 7, 8, 9, 10, 11, 12];
  const B = ["CBSE", "ICSE", "State"] as const;
  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <table className="mx">
          <caption className="sr">Boards and classes {t.first} teaches</caption>
          <thead>
            <tr>
              <th scope="col" style={{ textAlign: "left", paddingLeft: 12 }}>
                Board
              </th>
              {C.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {B.map((b) => (
              <tr key={b}>
                <th scope="row">{b}</th>
                {C.map((c) => {
                  const y = t.boards.includes(b) && c >= t.classRange[0] && c <= t.classRange[1];
                  return (
                    <td key={c}>
                      {y ? (
                        <span className="y" aria-label="Yes" role="img">
                          <Icon name="check" size={12} stroke={3} />
                        </span>
                      ) : (
                        <span className="n" aria-label="No" role="img" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="t-sm muted" style={{ marginTop: 10 }}>
        Subjects: <b style={{ color: "var(--navy)" }}>{t.subjects.join(", ")}</b>
      </p>
    </>
  );
}

function Reviews({ t }: { t: Tutor }) {
  const { s, set } = useApp();
  const f = s.rvf;
  const list = t.reviewsList.filter((r) => f === "All" || (f === "5 ★" ? r.rating === 5 : r.tags.includes(f)));
  return (
    <>
      <div className="chips" role="group" aria-label="Filter reviews" style={{ marginBottom: 14 }}>
        {["All", "5 ★", "Board exam", "Home visits", "Concepts"].map((v) => (
          <button key={v} type="button" className={`chip${f === v ? " on" : ""}`} aria-pressed={f === v} onClick={() => set({ rvf: v })}>
            {v}
          </button>
        ))}
      </div>
      <div>
        {list.length ? (
          list.map((r) => (
            <div key={r.name} className="rv">
              <div className="rv-h">
                <Avatar ini={r.initials} size={40} g={r.g} label={r.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b>{r.name}</b>
                  <span>{r.who}</span>
                </div>
              </div>
              <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                <Stars r={r.rating} size={14} />
                <span className="t-sm muted">{r.when}</span>
              </div>
              <p>{r.text}</p>
              <div className="tags">
                {r.tags.map((x) => (
                  <span key={x} className="tag">
                    {x}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="muted">No reviews with this tag yet.</p>
        )}
      </div>
    </>
  );
}

function Policies({ t }: { t: Tutor }) {
  const rows: [IconName, string, string][] = [
    ["route", "Travel radius", t.travelKm ? `Travels up to ${t.travelKm} km · you are ${t.distanceKm} km away (${t.locality})` : "Online classes only"],
    ["calendar", "Cancellation", "Free up to 6 hours before a class. Later cancellations count as a class."],
    ["swap", "Right-Fit Promise", "Not the right fit? Switch tutor free — your next first class is on us."],
    ["doc", "Reports", "Short WhatsApp note after each class and a weekly progress report."],
  ];
  return (
    <div className="pol">
      {rows.map(([i, b, d]) => (
        <div key={b}>
          <Icon name={i} size={18} />
          <span>
            <b>{b}</b>
            {d}
          </span>
        </div>
      ))}
    </div>
  );
}

function Similar({ t }: { t: Tutor }) {
  return (
    <div className="sim">
      {similarTutors(t).map((x) => (
        <Link key={x.id} href={`/tutors/${x.slug}`} className="simc" aria-label={`${x.name}, ${x.rating} stars, ${inr(x.pricePerClass)} per class`}>
          <div className="row">
            <Portrait name={x.name} ini={x.initials} g={x.g} size={48} />
            <div style={{ minWidth: 0 }}>
              <b>{x.name}</b>
              <span>
                <Star1 size={12} /> {x.rating} · {x.distanceKm} km
              </span>
            </div>
          </div>
          <span className="t-sm muted">
            {x.subjects.slice(0, 2).join(" & ")} · {clsRange(x)}
          </span>
          <div className="row between">
            <span className="sp">
              {inr(x.pricePerClass)}
              <small> / 60-min</small>
            </span>
            <span className="link">
              View <Icon name="chevR" size={14} stroke={2.2} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

/** Sticky booking card (desktop) */
function BookCard({ t }: { t: Tutor }) {
  const { bookTutor, chatWith, toast } = useActions();
  if (!t.acceptingStudents)
    return (
      <div className="bcard">
        <div className="bc-price">
          <b>{inr(t.pricePerClass)}</b>
          <span>/ 60-min class</span>
        </div>
        <span className="badge badge-c">
          <Icon name="clock" size={13} /> Not taking new students until 1 Nov
        </span>
        <button type="button" className="btn btn-s btn-block" onClick={() => scrollToId("simP")}>
          See 3 similar tutors
        </button>
        <button type="button" className="btn btn-g btn-block" onClick={() => toast(`We will tell you when ${t.first} has a free slot`, "bell")}>
          Notify me when free
        </button>
      </div>
    );
  return (
    <div className="bcard">
      <div className="bc-price">
        <b>{inr(t.pricePerClass)}</b>
        <span>/ 60-min class</span>
      </div>
      <span className="badge badge-t bc-zero">
        <Icon name="sparkle" size={13} /> Free demo · ₹0 · No card needed
      </span>
      <div>
        <div className="lbl" style={{ fontSize: 13 }}>
          Next open slots
        </div>
        <NextSlotChips heat={t.availability} />
      </div>
      <button type="button" className="btn btn-p btn-block btn-lg" onClick={() => bookTutor(t)}>
        Book free demo <span className="zero">₹0</span>
      </button>
      <button type="button" className="btn btn-s btn-block" onClick={() => chatWith(t)}>
        <Icon name="chat" size={17} /> Message {t.first}
      </button>
      <Guar>switch tutor free.</Guar>
      <div className="bc-reply">
        <Icon name="clock" size={15} /> Replies in {t.replyTime} · last active today
      </div>
    </div>
  );
}

function Sec({ id, title, small, children }: { id: string; title: string; small?: string; children: ReactNode }) {
  return (
    <section className="panel" id={`${id}P`} aria-labelledby={`${id}H`}>
      <h2 className="ph3" id={`${id}H`}>
        {title}
        {small && <small>{small}</small>}
      </h2>
      {children}
    </section>
  );
}

/** Tutor profile — brief order: header · video · about · matrix · heat-map · ratings · reviews · qualifications · policies · similar */
export function TutorProfile({ slug }: { slug: string }) {
  const t = tutorBySlug(slug)!;
  const { bookTutor } = useActions();
  const full = !t.acceptingStudents;
  return (
    <div className="prof-page">
      <AppBar title="Tutor profile" back="/tutors" />
      <div className="wrap prof-wrap">
        <Crumb items={[["Find tutors", "/tutors"], [t.name]]} />
        <div className="d-prof">
          <div className="prof-main">
            <section className="panel prof-head">
              {full && (
                <div className="fullnote">
                  <Icon name="info" size={22} />
                  <span>
                    <b>{t.first} is not taking new students until 1 Nov.</b> See 3 similar tutors below.
                  </span>
                </div>
              )}
              <ProfHead t={t} />
            </section>
            <Sec id="vid" title="Intro video" small={t.videoDuration}>
              <IntroVideo t={t} />
            </Sec>
            <Sec id="about" title={`About ${t.first}`}>
              <p className="about">{t.about}</p>
              <div className="tags" style={{ marginTop: 14 }}>
                {t.style.map((x) => (
                  <span key={x} className="tag">
                    {x}
                  </span>
                ))}
              </div>
            </Sec>
            <Sec id="mx" title="Subjects × boards × classes">
              <Matrix t={t} />
            </Sec>
            <Sec id="av" title="Availability" small="Darker = more open slots">
              <Heatmap heat={t.availability} />
              <TimeChips heat={t.availability} />
              <Picked />
              <Mobile>
                <div>
                  <div className="lbl" style={{ marginTop: 16 }}>
                    Or take a next open slot
                  </div>
                  <NextSlotChips heat={t.availability} />
                </div>
              </Mobile>
            </Sec>
            <Sec id="rt" title="Ratings">
              <RatingBars t={t} />
            </Sec>
            <Sec id="rv" title="Reviews">
              <Reviews t={t} />
            </Sec>
            <Sec id="q" title="Qualifications">
              {t.qualifications.map(([a, b], i) => (
                <div key={a} className="qual">
                  <span className="qi">
                    <Icon name={i ? "award" : "grad"} size={18} />
                  </span>
                  <span>
                    {a}
                    <small>{b}</small>
                  </span>
                </div>
              ))}
            </Sec>
            <Sec id="pol" title="Policies">
              <Policies t={t} />
            </Sec>
            <Sec id="sim" title="Similar tutors">
              <Similar t={t} />
            </Sec>
          </div>
          <Desktop>
            <aside className="bk-aside" aria-label="Book a demo">
              <BookCard t={t} />
            </aside>
          </Desktop>
        </div>
      </div>
      <Mobile>
        <div className="mbot">
          {full ? (
            <>
              <div className="pr">
                <small>Per class</small>
                <b>
                  {inr(t.pricePerClass)}
                  <span> / 60-min</span>
                </b>
              </div>
              <button type="button" className="btn btn-s" onClick={() => scrollToId("simP")}>
                See similar
              </button>
            </>
          ) : (
            <>
              <div className="pr">
                <small>Free demo · then</small>
                <b>
                  {inr(t.pricePerClass)}
                  <span> / 60-min</span>
                </b>
              </div>
              <button type="button" className="btn btn-p" onClick={() => bookTutor(t)}>
                Book free demo
              </button>
            </>
          )}
        </div>
      </Mobile>
    </div>
  );
}
