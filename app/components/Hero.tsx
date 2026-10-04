"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToTarget } from "./SmoothScroll";
import { useInViewVideo } from "./useInViewVideo";

gsap.registerPlugin(ScrollTrigger);

const VIDEO = "/assets/Herosectionzip/Strawberries_melt_into_cream_swatch_20261004135123.mp4";
const POSTER = "/assets/Herosectionzip/ezgif-frame-001.jpg";
const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useInViewVideo(videoRef, sectionRef);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom bottom", scrub: 0.35 },
        defaults: { ease: "power2.inOut" },
      });
      // Each beat's lines move at different depths: kicker slowest, headline mid, copy fastest.
      const beatIn = (sel: string, at: number) =>
        tl.fromTo(`${sel} > *`, { autoAlpha: 0, y: (i: number) => 50 + i * 40 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, at);
      const beatOut = (sel: string, at: number) =>
        tl.to(`${sel} > *`, { autoAlpha: 0, y: (i: number) => -(40 + i * 35), duration: 0.9, stagger: 0.05 }, at);

      tl.to("[data-beat='1']", { autoAlpha: 0, y: -90, duration: 1 }, 0.6);
      tl.to("[data-scroll-cue]", { autoAlpha: 0, duration: 0.4 }, 0.2);
      beatIn("[data-beat='2']", 1.6);
      beatOut("[data-beat='2']", 3.2);
      beatIn("[data-beat='3']", 4.2);
      tl.to({}, { duration: 0.8 }, 5.2);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="relative h-[320vh] bg-cream" aria-label="Strawberry Dew Brightening Moisturizer">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <video
          ref={videoRef}
          src={VIDEO}
          poster={POSTER}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(42,11,16,0.14)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-cream/85 via-cream/35 to-transparent" />

        {/* Beat 1 — title */}
        <div data-beat="1" className="absolute inset-x-0 bottom-[12vh] px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-berry"
          >
            New · Strawberry Dew
          </motion.p>
          <h1 className="font-display text-[clamp(3.2rem,11vw,10rem)] leading-[0.85] font-medium tracking-tight text-ink">
            {["Glow", "like", "dew."].map((w, i) => (
              <span key={w} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className={`inline-block ${i === 2 ? "italic text-berry" : ""}`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.45 + i * 0.12, ease }}
                >
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            A brightening moisturizer whipped with real strawberries — light as cream, finished like morning dew.
          </motion.p>
        </div>

        {/* Beat 2 — texture */}
        <div data-beat="2" className="absolute bottom-[12vh] left-6 max-w-xl sm:left-12 lg:left-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-berry">The texture</p>
          <h2 className="font-display text-[clamp(2.6rem,7vw,6rem)] leading-[0.9] text-ink">
            Melts like <em className="text-berry">cream.</em>
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-ink-soft sm:text-lg">
            A bouncy gel-cream that sinks in within seconds. No stickiness, no white cast — just a soft-focus, juicy finish.
          </p>
        </div>

        {/* Beat 3 — CTA */}
        <div data-beat="3" className="absolute right-6 bottom-[12vh] max-w-xl text-right sm:right-12 lg:right-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-berry">The ritual</p>
          <h2 className="font-display text-[clamp(2.6rem,7vw,6rem)] leading-[0.9] text-ink">
            Strawberry <em className="text-berry">&amp;</em> niacinamide.
          </h2>
          <p className="mt-5 ml-auto max-w-sm text-base leading-relaxed text-ink-soft sm:text-lg">
            Fruit enzymes smooth, niacinamide evens tone, hyaluronic acid locks in all-day hydration.
          </p>
          <div className="mt-8 flex justify-end gap-3">
            <a
              href="#products"
              onClick={(e) => { e.preventDefault(); scrollToTarget("#products"); }}
              className="flex h-12 items-center rounded-full bg-berry px-7 text-sm font-semibold text-cream shadow-xl shadow-berry/30 transition-colors hover:bg-berry-deep"
            >
              Shop Strawberry Dew
            </a>
          </div>
        </div>

        <div data-scroll-cue className="absolute top-1/2 right-6 hidden -translate-y-1/2 flex-col items-center gap-3 text-[10px] font-semibold tracking-[0.35em] text-ink/60 uppercase md:flex">
          <span className="[writing-mode:vertical-rl]">Scroll</span>
          <span className="relative h-16 w-px overflow-hidden bg-ink/15">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-berry"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </div>
      </div>
    </section>
  );
}
