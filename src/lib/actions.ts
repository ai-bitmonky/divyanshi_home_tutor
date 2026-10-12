"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useToast } from "@/components/Toast";
import { CANNED, REPLIES, aiAnswer, dateLabel, nowT, tutorById, type Tutor } from "./data";
import { useApp, type AppState } from "./store";

/** Cross-screen actions (ported from the prototype's ACT map). */
export function useActions() {
  const { s, set, update } = useApp();
  const router = useRouter();
  const toast = useToast();

  /** "Book free demo" — starts the 4-step flow (full tutors go to their profile instead) */
  const bookTutor = useCallback(
    (t: Tutor) => {
      if (!t.acceptingStudents) {
        set({ tutor: t.id });
        router.push(`/tutors/${t.slug}`);
        return;
      }
      update((st) => ({
        ...st,
        tutor: t.id,
        bookTutor: t.id,
        bookStep: 1,
        bk: {
          ...st.bk,
          mode: t.mode.includes(st.bk.mode) ? st.bk.mode : t.mode[0],
          subject: t.subjects.includes(st.bk.subject) ? st.bk.subject : t.subjects[0],
        },
      }));
      router.push(`/book/${t.slug}`);
    },
    [router, set, update],
  );

  /** open (or create) the chat thread with a tutor */
  const chatWith = useCallback(
    (t: Tutor) => {
      const k = t.id;
      update((st) => {
        const convos = { ...st.convos };
        let corder = st.corder;
        if (!convos[k]) {
          convos[k] = {
            name: t.name,
            initials: t.initials,
            g: t.g,
            role: t.headline,
            online: true,
            unread: 0,
            day: "TODAY",
            msgs: [{ f: "t", x: `Hi! I'm ${t.first}. Happy to help with ${t.subjects.join(" or ")}. Any questions before the demo?`, t: nowT() }],
          };
          corder = [corder[0], k, ...corder.slice(1)];
        }
        convos[k] = { ...convos[k], unread: 0 };
        return { ...st, convos, corder, convo: k };
      });
      router.push(`/chat/${k}`);
    },
    [router, update],
  );

  const toggleFav = useCallback(
    (id: string) => {
      const on = !s.favs[id];
      set({ favs: { ...s.favs, [id]: on } });
      toast(on ? "Saved to your shortlist" : "Removed from shortlist", "heart");
    },
    [s.favs, set, toast],
  );

  const openAuth = useCallback((kind: "demo" | "login", step: AppState["auth"]["step"] = "signup", mob?: string) => {
    update((st) => ({ ...st, searchSheet: false, auth: { ...st.auth, open: true, kind, step, mob: mob ?? st.auth.mob } }));
  }, [update]);

  const addToCalendar = useCallback(() => toast(`Added to calendar: ${dateLabel(s.pick)}`, "calPlus"), [s.pick, toast]);

  /** chat: send a message, typing indicator, canned reply after 700 ms */
  const sendMsg = useCallback(
    (key: string, text: string, quick = false) => {
      const t = nowT();
      update((st) => {
        const c = st.convos[key];
        if (!c) return st;
        return { ...st, typing: key, convos: { ...st.convos, [key]: { ...c, quickUsed: quick ? true : c.quickUsed, msgs: [...c.msgs, { f: "u", x: text, t }] } } };
      });
      setTimeout(() => {
        update((st) => {
          const c = st.convos[key];
          if (!c) return { ...st, typing: null };
          let r: string;
          let cannedI = st.cannedI;
          if (key === "ashish") {
            r = REPLIES[text] ?? CANNED[cannedI % CANNED.length];
            if (!REPLIES[text]) cannedI += 1;
          } else if (key === "support") r = "Thanks for reaching out! A support specialist will reply within 5 minutes.";
          else r = "Thanks, Divyanshi! I will reply properly after my current class.";
          return { ...st, typing: null, cannedI, convos: { ...st.convos, [key]: { ...c, msgs: [...c.msgs, { f: "t", x: r, t: nowT() }] } } };
        });
      }, 700);
    },
    [update],
  );

  /** AI Assist: question → typing → answer after 900 ms */
  const aiSend = useCallback(
    (text: string) => {
      update((st) => ({ ...st, ai: { open: true, typing: true, msgs: [...st.ai.msgs, { f: "u", x: text, t: nowT() }] } }));
      setTimeout(() => {
        update((st) => ({ ...st, ai: { ...st.ai, typing: false, msgs: [...st.ai.msgs, { f: "t", x: aiAnswer(text), h: true, t: nowT() }] } }));
      }, 900);
    },
    [update],
  );

  const currentTutor = tutorById(s.tutor);

  return { bookTutor, chatWith, toggleFav, openAuth, addToCalendar, sendMsg, aiSend, currentTutor, toast };
}
