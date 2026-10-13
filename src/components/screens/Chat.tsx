"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { REPLIES, type Convo } from "@/lib/data";
import { useActions } from "@/lib/actions";
import { DESKTOP_MQ, useViewportMode } from "@/lib/hooks";
import { appScrollToEnd } from "@/lib/native";
import { useApp } from "@/lib/store";
import { Icon } from "../Icons";
import { Avatar } from "../Portrait";
import { BackButton, TabHead, useBack } from "../ui";
import { Desktop, Mobile } from "../Variant";

function ChatHead({ c, mobile }: { c: Convo; mobile?: boolean }) {
  const { toast } = useActions();
  const back = useBack("/chat");
  return (
    <div className="ch-head">
      {mobile && <BackButton onClick={back} />}
      <Avatar ini={c.initials} size={42} g={c.g} label={c.name} />
      <div className="ct">
        <b>{c.name}</b>
        <span>
          {c.online && <i />}
          {c.role}
        </span>
      </div>
      <button type="button" className="icbtn flat" aria-label={`Call ${c.name}`} onClick={() => toast(`Calling ${c.name}…`, "phone")}>
        <Icon name="phone" size={20} />
      </button>
      <button type="button" className="icbtn flat" aria-label="More options" onClick={() => toast("Chat muted for 1 hour", "bell")}>
        <Icon name="dots" size={20} />
      </button>
    </div>
  );
}

function Bubbles({ id, c }: { id: string; c: Convo }) {
  const { s } = useApp();
  const { sendMsg } = useActions();
  return (
    <>
      <div className="bubs" aria-live="polite">
        <div className="day-div">{c.day || "TODAY"}</div>
        {c.msgs.map((x, i) => (
          <div key={i} className={`bub-row ${x.f}`}>
            {x.f === "t" && <Avatar ini={c.initials} size={28} g={c.g} label={c.name} />}
            <div className="bub">
              {x.x}
              <time>{x.t}</time>
            </div>
          </div>
        ))}
        {s.typing === id && (
          <div className="bub-row t">
            <Avatar ini={c.initials} size={28} g={c.g} label={c.name} />
            <div className="bub typing" role="status" aria-label={`${c.name} is typing`}>
              <i />
              <i />
              <i />
            </div>
          </div>
        )}
      </div>
      {c.quick && !c.quickUsed && (
        <div className="qr">
          <div className="ovl">Select one option</div>
          <div className="chips">
            {Object.keys(REPLIES).map((k) => (
              <button key={k} type="button" className="chip" onClick={() => sendMsg(id, k, true)}>
                {k}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export function Composer({ placeholder, onSend, inputId }: { placeholder: string; onSend: (text: string) => void; inputId: string }) {
  const [v, setV] = useState("");
  const send = () => {
    const t = v.trim();
    if (!t) return;
    onSend(t);
    setV("");
  };
  return (
    <form
      className="composer"
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
    >
      <label className="sr" htmlFor={inputId}>
        Message
      </label>
      <input id={inputId} className="inp" placeholder={placeholder} autoComplete="off" value={v} onChange={(e) => setV(e.target.value)} />
      <button type="submit" className="send" aria-label="Send message">
        <Icon name="send" size={19} />
      </button>
    </form>
  );
}

function ConvoList({ active, desktop }: { active?: string; desktop?: boolean }) {
  const { s, update } = useApp();
  return (
    <div className="cl-list">
      {s.corder.map((k) => {
        const x = s.convos[k];
        if (!x) return null;
        const last = x.msgs[x.msgs.length - 1];
        const on = desktop && k === active;
        return (
          <Link
            key={k}
            href={`/chat/${k}`}
            className={`ci${on ? " on" : ""}`}
            aria-current={on ? "page" : undefined}
            onClick={() => update((st) => ({ ...st, convo: k, convos: { ...st.convos, [k]: { ...st.convos[k], unread: 0 } } }))}
          >
            <Avatar ini={x.initials} size={44} g={x.g} label={x.name} />
            <span className="cit">
              <b>
                {x.name}
                <small>{last.t}</small>
              </b>
              <span>
                {last.f === "u" ? "You: " : ""}
                {last.x}
              </span>
            </span>
            {x.unread > 0 && !on && <span className="unread">{x.unread}</span>}
          </Link>
        );
      })}
    </div>
  );
}

/** Chat — desktop two-pane (list + thread); mobile list at /chat, thread at /chat/[id] */
export function ChatScreen({ id }: { id?: string }) {
  const { s } = useApp();
  const { sendMsg } = useActions();
  const key = id && s.convos[id] ? id : id ? "ashish" : s.convos[s.convo] ? s.convo : "ashish";
  const c = s.convos[key];
  const thread = useRef<HTMLDivElement>(null);
  const count = c.msgs.length + (s.typing === key ? 1 : 0);

  /* `mode` is a dep so the newly mounted variant is scrolled to the latest message after a resize across 900px */
  const mode = useViewportMode();
  useEffect(() => {
    const el = thread.current;
    if (el) el.scrollTop = el.scrollHeight;
    if (id && !window.matchMedia(DESKTOP_MQ).matches) appScrollToEnd();
  }, [count, key, id, mode]);

  return (
    <>
      {/* desktop */}
      <Desktop>
        <div className="wrap" style={{ paddingBottom: 28 }}>
          <div className="d-chat">
            <aside className="cl" aria-label="Conversations">
              <div className="cl-h">
                <b>Chats</b>
                <div className="iw">
                  <Icon name="search" size={16} />
                  <input className="inp" placeholder="Search conversations" aria-label="Search conversations" />
                </div>
              </div>
              <ConvoList active={key} desktop />
            </aside>
            <section className="th" aria-label={`Conversation with ${c.name}`}>
              <ChatHead c={c} />
              <div className="th-scroll" ref={thread}>
                <Bubbles id={key} c={c} />
              </div>
              <Composer inputId="msg-d" placeholder="Ask your question…" onSend={(t) => sendMsg(key, t)} />
            </section>
          </div>
        </div>
      </Desktop>
      {/* mobile */}
      {id ? (
        <Mobile>
          <div className="m-chat">
            <div className="m-chat-head">
              <ChatHead c={c} mobile />
            </div>
            <Bubbles id={key} c={c} />
            <div className="m-composer">
              <Composer inputId="msg-m" placeholder="Ask your question…" onSend={(t) => sendMsg(key, t)} />
            </div>
          </div>
        </Mobile>
      ) : (
        <Mobile>
          <div>
            <TabHead title="Chats" />
            <div className="m-wrap px">
              <div className="list m-clist">
                <ConvoList />
              </div>
            </div>
          </div>
        </Mobile>
      )}
    </>
  );
}
