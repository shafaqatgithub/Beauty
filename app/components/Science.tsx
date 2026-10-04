"use client";

import { motion } from "motion/react";
import Droplet3D from "./Droplet3D";

const INGREDIENTS = [
  { name: "Strawberry extract", pct: "AHA", copy: "Natural fruit acids gently resurface for a smoother, brighter look.", side: "left", top: "18%" },
  { name: "Niacinamide", pct: "10%", copy: "Visibly evens tone and refines the look of pores.", side: "left", top: "60%" },
  { name: "Hyaluronic acid", pct: "3×", copy: "Multi-weight hydration that plumps from the first drop.", side: "right", top: "22%" },
  { name: "Vitamin E", pct: "1%", copy: "Antioxidant shield that keeps skin soft and supple.", side: "right", top: "64%" },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export default function Science() {
  return (
    <section id="science" className="relative overflow-hidden bg-[radial-gradient(circle_at_50%_45%,#fde3e3_0%,var(--cream)_60%)] px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl">
        <div data-speed="50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-berry">Inside every drop</p>
          <h2 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.9] text-ink">
            Fruit-powered, <em className="text-berry">science-backed.</em>
          </h2>
        </motion.div>
        </div>

        <div className="relative mt-12 lg:mt-4">
          <div data-speed="-40">
            <Droplet3D className="mx-auto aspect-square w-full max-w-[640px]" />
          </div>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:mt-0 lg:block">
            {INGREDIENTS.map((ing, i) => (
              <motion.li
                key={ing.name}
                initial={{ opacity: 0, x: ing.side === "left" ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease }}
                style={{ top: ing.top }}
                className={`lg:absolute lg:w-72 ${
                  ing.side === "left" ? "lg:left-0" : "lg:right-0"
                }`}
              >
                <div data-speed={i % 2 ? 70 : 30} className="rounded-3xl bg-white/85 p-6 shadow-[0_20px_50px_-30px_rgba(158,18,32,0.35)] ring-1 ring-berry/10">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-base font-semibold text-ink">{ing.name}</h3>
                  <span className="font-display text-3xl text-berry italic">{ing.pct}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{ing.copy}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
