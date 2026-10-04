"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "motion/react";

const STATS = [
  { value: 4.8, decimals: 1, suffix: "★", label: "Average rating" },
  { value: 12, decimals: 0, suffix: "k+", label: "Five-star reviews" },
  { value: 94, decimals: 0, suffix: "%", label: "Saw brighter skin in 2 weeks*" },
];

const REVIEWS = [
  { quote: "It smells like actual strawberries and my skin looks lit from within. I've stopped wearing foundation on weekdays.", name: "Ananya R.", detail: "Combination skin" },
  { quote: "The texture is unreal — it melts the second it touches skin. No pilling under sunscreen at all.", name: "Meher S.", detail: "Oily skin" },
  { quote: "The lip balm lives in every bag I own. Sheer tint, zero stickiness, lips stay soft all day.", name: "Kavya P.", detail: "Lip Ritual fan" },
];

const ease = [0.22, 1, 0.36, 1] as const;

function Counter({ value, decimals, suffix }: { value: number; decimals: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState((0).toFixed(decimals));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease,
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      <span className="text-berry">{suffix}</span>
    </span>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="relative bg-petal px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl">
        <div data-speed="25" className="grid gap-10 border-b border-ink/10 pb-16 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-[clamp(3.5rem,7vw,6rem)] leading-none text-ink">
                <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </p>
              <p className="mt-3 text-sm font-medium tracking-wide text-ink-soft">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <div key={r.name} data-speed={[20, 60, 35][i]} className="flex">
            <motion.figure
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease }}
              whileHover={{ y: -6 }}
              className="flex w-full flex-col justify-between rounded-[2rem] bg-cream p-8 shadow-[0_20px_50px_-30px_rgba(158,18,32,0.35)] ring-1 ring-berry/10"
            >
              <div>
                <div className="flex gap-1 text-berry" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-6 font-display text-2xl leading-snug text-ink">“{r.quote}”</blockquote>
              </div>
              <figcaption className="mt-8 text-sm">
                <span className="font-semibold text-ink">{r.name}</span>
                <span className="text-ink-soft"> · {r.detail}</span>
              </figcaption>
            </motion.figure>
            </div>
          ))}
        </div>
        <p className="mt-8 text-xs text-ink-soft">*Placeholder figures for design preview.</p>
      </div>
    </section>
  );
}
