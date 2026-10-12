/** Progress ring (84px) — teal arc over a light track */
export function ProgressRing({ value, label, delta }: { value: number; label: string; delta: string }) {
  const C = 2 * Math.PI * 34;
  return (
    <div>
      <div className="pring" role="img" aria-label={`${label}: ${value}%`}>
        <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
          <circle cx="42" cy="42" r="34" fill="none" stroke="#E7ECEF" strokeWidth="8" />
          <circle
            className="pr"
            cx="42"
            cy="42"
            r="34"
            fill="none"
            stroke="#0A9A8A"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={C.toFixed(1)}
            strokeDashoffset={(C * (1 - value / 100)).toFixed(1)}
          />
        </svg>
        <b>{value}%</b>
      </div>
      <div className="rl">{label}</div>
      <div className="rd">{delta}</div>
    </div>
  );
}
