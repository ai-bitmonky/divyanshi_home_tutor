"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { nowT } from "@/lib/data";
import { useActions } from "@/lib/actions";
import { useApp } from "@/lib/store";
import { Icon, type IconName } from "../Icons";
import { Avatar } from "../Portrait";
import { TabHead } from "../ui";
import { Composer } from "./Chat";

const SUGG = ["Explain Newton's 2nd law", "Solve 2x + 5 = 15", "Tips for exam revision"];

function AiBox() {
  const { s, update } = useApp();
  const { aiSend } = useActions();
  const a = s.ai;
  const box = useRef<HTMLDivElement>(null);
  const count = a.msgs.length + (a.typing ? 1 : 0);

  useEffect(() => {
    if (!a.open || !count) return;
    box.current?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
    box.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [a.open, count]);

  if (!a.open)
    return (
      <div className="ai-ask">
        <button
          type="button"
          className="btn btn-n btn-block"
          style={{ height: 54, fontSize: 16 }}
          onClick={() =>
            update((st) => ({
              ...st,
              ai: { ...st.ai, open: true, msgs: st.ai.msgs.length ? st.ai.msgs : [{ f: "t", x: "Hi Divyanshi! I'm your AI study buddy. Ask me to solve an equation or explain any concept.", t: nowT() }] },
            }))
          }
        >
          <Icon name="sparkle" size={20} /> Ask AI Anything
        </button>
        <p className="hint" style={{ marginTop: 10 }}>
          <Icon name="shield" size={14} /> Safe for students · Answers checked against CBSE syllabus
        </p>
      </div>
    );
  return (
    <div className="ai-box" ref={box}>
      <div className="row between" style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
        <b className="row" style={{ gap: 8 }}>
          <Icon name="sparkle" size={18} /> AI Chat
        </b>
        <button type="button" className="link" style={{ fontSize: 13 }} onClick={() => update((st) => ({ ...st, ai: { ...st.ai, open: false } }))}>
          Close
        </button>
      </div>
      <div className="ai-sugg">
        {SUGG.map((x) => (
          <button key={x} type="button" className="chip" onClick={() => aiSend(x)}>
            {x}
          </button>
        ))}
      </div>
      <div className="bubs" aria-live="polite">
        {a.msgs.map((x, i) => (
          <div key={i} className={`bub-row ${x.f}`}>
            {x.f === "t" && <Avatar ini="AI" size={28} g={5} label="AI Assist" />}
            {/* AI answers are generated from fixed templates (user text is escaped in aiAnswer) */}
            {x.h ? <div className="bub ai-ans" dangerouslySetInnerHTML={{ __html: `${x.x}<time>${x.t}</time>` }} /> : (
              <div className="bub ai-ans">
                {x.x}
                <time>{x.t}</time>
              </div>
            )}
          </div>
        ))}
        {a.typing && (
          <div className="bub-row t">
            <Avatar ini="AI" size={28} g={5} label="AI Assist" />
            <div className="bub typing" role="status" aria-label="AI is thinking">
              <i />
              <i />
              <i />
            </div>
          </div>
        )}
      </div>
      <Composer inputId="aiMsg" placeholder="Type a question or an equation…" onSend={aiSend} />
    </div>
  );
}

export function AiScreen() {
  const { update } = useApp();
  const cards: [IconName, string, string, string, string, (() => void) | string][] = [
    [
      "bolt",
      "Get Instant AI Help",
      "Solve Equations or Explain Concepts",
      "background:var(--blue-l);color:var(--blue)",
      "",
      () =>
        update((st) => ({
          ...st,
          ai: { ...st.ai, open: true, msgs: st.ai.msgs.length ? st.ai.msgs : [{ f: "t", x: "Hi Divyanshi! I'm your AI study buddy. Ask me to solve an equation or explain any concept.", t: nowT() }] },
        })),
    ],
    ["users", "Find Your Perfect Tutor", "Connect With Expert Human Educators", "background:var(--teal-l);color:var(--teal)", "", "/tutors"],
    [
      "history",
      "Continue Last Session",
      "Mechanics · Newton's laws",
      "background:#FDF1D8;color:#B7811A",
      "PHYSICS · 2 Hours Ago",
      () =>
        update((st) => ({
          ...st,
          ai: {
            ...st.ai,
            open: true,
            msgs: [...st.ai.msgs, { f: "t", x: "Welcome back! Last time we worked on <b>Newton's second law (F = m × a)</b> in Mechanics. Shall we try a practice problem?", h: true, t: nowT() }],
          },
        })),
    ],
  ];
  const css = (str: string) => Object.fromEntries(str.split(";").map((p) => p.split(":")).map(([k, v]) => [k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v]));
  return (
    <>
      <TabHead
        title="AI Assist"
        right={
          <span className="badge badge-b">
            <Icon name="sparkle" size={13} /> Beta
          </span>
        }
      />
      <div className="wrap ai-wrap">
        <div className="d-ai">
          <div className="ai-greet">
            <div className="ai-orb">
              <Icon name="sparkle" size={30} stroke={2} />
            </div>
            <div className="hi">Good Morning, Divyanshi</div>
            <h1>How Can I Help You Today?</h1>
          </div>
          <div className="ai-cards">
            {cards.map(([i, t, sub, st, em, act]) => {
              const inner = (
                <>
                  <span className="aic" style={css(st)}>
                    <Icon name={i} size={24} />
                  </span>
                  <span className="at">
                    {em && <em>{em}</em>}
                    <b>{t}</b>
                    <span>{sub}</span>
                  </span>
                  <span className="ai-chev" style={{ color: "#9AA7B4" }}>
                    <Icon name="chevR" size={18} />
                  </span>
                </>
              );
              return typeof act === "string" ? (
                <Link key={t} href={act} className="ai-card">
                  {inner}
                </Link>
              ) : (
                <button key={t} type="button" className="ai-card" onClick={act}>
                  {inner}
                </button>
              );
            })}
          </div>
          <AiBox />
        </div>
      </div>
    </>
  );
}
