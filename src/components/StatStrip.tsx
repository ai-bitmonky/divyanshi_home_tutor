"use client";

import { memo, useEffect, useRef } from "react";
import { STATS } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

const fmt = (v: number, dec: number) => (dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-IN"));

/** Stat strip — numbers count up once when scrolled into view (final values are server-rendered) */
export const StatStrip = memo(function StatStrip() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    const nums = Array.from(el.querySelectorAll<HTMLElement>("[data-count]"));
    const raf: number[] = [];
    const run = (n: HTMLElement) => {
      const to = Number(n.dataset.count);
      const dec = Number(n.dataset.dec || 0);
      const suf = n.dataset.suf || "";
      const t0 = performance.now();
      const D = 1400;
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / D);
        const e = 1 - Math.pow(1 - p, 3);
        n.textContent = fmt(to * e, dec) + suf;
        if (p < 1) raf.push(requestAnimationFrame(step));
      };
      raf.push(requestAnimationFrame(step));
    };
    nums.forEach((n) => (n.textContent = fmt(0, Number(n.dataset.dec || 0)) + (n.dataset.suf || "")));
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (en.isIntersecting) {
            run(en.target as HTMLElement);
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.6 },
    );
    nums.forEach((n) => io.observe(n));
    return () => {
      io.disconnect();
      raf.forEach(cancelAnimationFrame);
      nums.forEach((n) => (n.textContent = fmt(Number(n.dataset.count), Number(n.dataset.dec || 0)) + (n.dataset.suf || "")));
    };
  }, []);

  return (
    <div className="stats" ref={root}>
      {STATS.map((x) => (
        <div key={x.label}>
          <b data-count={x.value} data-dec={x.dec ?? 0} data-suf={x.suffix}>
            {`${fmt(x.value, x.dec ?? 0)}${x.suffix}`}
          </b>
          <span>{x.label}</span>
        </div>
      ))}
    </div>
  );
});
