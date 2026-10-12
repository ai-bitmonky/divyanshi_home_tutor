import type { Tutor } from "@/lib/data";
import { Stars } from "./Portrait";

const LABELS = ["Clarity", "Patience", "Punctuality"];

/** Ratings breakdown: big number + 5 bars + 3 sub-scores */
export function RatingBars({ t }: { t: Tutor }) {
  return (
    <>
      <div className="rsum">
        <div className="center">
          <div className="rbig">{t.rating}</div>
          <Stars r={t.rating} size={15} />
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, whiteSpace: "nowrap" }}>{t.reviews} reviews</div>
        </div>
        <div className="rbars">
          {t.ratingBreakdown.map(([st, p]) => (
            <div key={st}>
              <span>{st} ★</span>
              <span className="bar" role="img" aria-label={`${st} stars: ${p}%`}>
                <i style={{ width: `${p}%` }} />
              </span>
              <span style={{ textAlign: "right" }}>{p}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="subs">
        {LABELS.map((l, i) => (
          <div key={l}>
            <span>{l}</span>
            <b>{t.subScores[i].toFixed(1)}</b>
            <span className="bar">
              <i style={{ width: `${(t.subScores[i] / 5) * 100}%` }} />
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
