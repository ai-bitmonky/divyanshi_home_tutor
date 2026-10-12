"use client";

import Link from "next/link";
import { clsRange, inr, type Tutor } from "@/lib/data";
import { useActions } from "@/lib/actions";
import { useApp } from "@/lib/store";
import { Icon } from "./Icons";
import { Portrait, Star1 } from "./Portrait";

/* Tutor card — exact 9-item order from the brief:
   photo · name+Super · rating · subject/board/class · spec row · proof · bio · momentum · footer.
   The whole card is one link (stretched over the card); the footer buttons sit above it. */
export function TutorCard({ t, style }: { t: Tutor; style?: React.CSSProperties }) {
  const { s } = useApp();
  const { bookTutor, toggleFav } = useActions();
  const fav = !!s.favs[t.id];
  const full = !t.acceptingStudents;
  return (
    <article className={`tcard${full ? " off" : ""}`} data-tid={t.id} style={style}>
      <div className="tc-top">
        <div className="tc-ph">
          <Portrait name={t.name} ini={t.initials} g={t.g} size={72} />
          <span className="tc-vid">
            <Icon name="play" size={9} />
            {t.videoDuration}
          </span>
          <span className="tc-ver" title="ID-verified">
            <Icon name="check" size={11} stroke={3.2} />
            <span className="sr">ID-verified</span>
          </span>
        </div>
        <div className="tc-id">
          <div className="tc-name">
            <Link href={`/tutors/${t.slug}`} className="tc-link" aria-label={`${t.name} — ${t.rating} stars, ${inr(t.pricePerClass)} per 60-minute class`}>
              {t.name}
            </Link>
            {t.superTutor && (
              <span className="super">
                <Icon name="star" size={10} stroke={2.6} />
                Super Tutor
              </span>
            )}
          </div>
          <div className="tc-rate">
            <Star1 size={14} /> {t.rating} <span>({t.reviews} reviews)</span>
          </div>
          <div className="tc-sub">
            {t.subjects.slice(0, 2).join(" & ")} · {t.boards.join("/")} · <span style={{ whiteSpace: "nowrap" }}>{clsRange(t)}</span>
          </div>
        </div>
      </div>
      <div className="tc-spec">
        <span>{t.yearsExp} yrs exp</span>
        <span>{t.mode.join(" + ")}</span>
        <span>{t.distanceKm} km</span>
      </div>
      <div className="tc-proof">
        <Icon name="users" size={15} /> {t.students} students · {t.lessons.toLocaleString("en-IN")} lessons
      </div>
      <p className="tc-bio">{t.bio}</p>
      <div className="tc-mo">
        {full ? (
          <span className="mo n">
            <Icon name="clock" size={13} /> {t.momentum}
          </span>
        ) : (
          <span className="mo">
            <Icon name="bolt" size={13} /> {t.momentum}
          </span>
        )}
        <span className="mo n">
          <Icon name="chat" size={13} /> Replies in {t.replyTime}
        </span>
      </div>
      <div className="tc-foot">
        <div className="tc-price">
          {inr(t.pricePerClass)}
          <small> / 60-min</small>
        </div>
        {full ? (
          <Link href={`/tutors/${t.slug}`} className="btn btn-s">
            See similar
          </Link>
        ) : (
          <button type="button" className="btn btn-p" onClick={() => bookTutor(t)}>
            Book free demo
          </button>
        )}
        <button
          type="button"
          className={`save${fav ? " on" : ""}`}
          aria-pressed={fav}
          aria-label={`Save ${t.name}`}
          onClick={() => toggleFav(t.id)}
        >
          <Icon name={fav ? "heartF" : "heart"} size={19} />
        </button>
      </div>
    </article>
  );
}
