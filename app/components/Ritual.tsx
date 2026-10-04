"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInViewVideo } from "./useInViewVideo";

gsap.registerPlugin(ScrollTrigger);

const VIDEO = "/assets/Lip_balm_product_video.mp4";
const POSTER = "/assets/next-2-sections/ezgif-frame-001.jpg";

const BEATS = [
  { n: "01", kicker: "Whipped core", title: "Butter-soft", accent: "balm.", copy: "Shea and strawberry seed oil, whipped into a cushiony balm that glides on in one swipe." },
  { n: "02", kicker: "Sheer tint", title: "A blush of", accent: "berry.", copy: "Buildable, juicy colour that looks like your lips — only better. Never sticky, never flat." },
  { n: "03", kicker: "Lasting care", title: "Soft for", accent: "hours.", copy: "Ceramides and vitamin E lock in moisture so lips stay plump and smooth from morning to night." },
];

export default function Ritual() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useInViewVideo(videoRef, sectionRef);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom bottom", scrub: 0.35 },
        defaults: { ease: "power2.inOut" },
      });
      tl.fromTo("[data-frame]", { clipPath: "inset(12% 10% 12% 10% round 48px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.2 }, 0)
        .fromTo("[data-ritual-intro]", { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -40, duration: 0.6 }, 0.6);

      BEATS.forEach((_, i) => {
        const at = 1.4 + i * 1.8;
        tl.fromTo(`[data-rbeat='${i}']`, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.7 }, at);
        if (i < BEATS.length - 1) tl.to(`[data-rbeat='${i}']`, { autoAlpha: 0, x: 40, duration: 0.6 }, at + 1.3);
        tl.to(`[data-dot='${i}']`, { scaleY: 1, duration: 0.7 }, at);
      });
      tl.to({}, { duration: 0.8 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="ritual" ref={sectionRef} className="relative h-[420vh] bg-cream" aria-label="Strawberry lip balm">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <div data-frame className="absolute inset-0 bg-blush will-change-[clip-path]">
          <video
            ref={videoRef}
            src={VIDEO}
            poster={POSTER}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-cream/80 via-cream/25 to-transparent sm:w-1/2" />
        </div>

        <div data-ritual-intro className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-berry">Chapter two</p>
          <h2 className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.85] text-ink">
            The lip <em className="text-berry">ritual.</em>
          </h2>
        </div>

        <div className="absolute inset-y-0 left-6 flex items-center sm:left-12 lg:left-20">
          <div className="relative max-w-md">
            {BEATS.map((b, i) => (
              <article key={b.n} data-rbeat={i} className="invisible absolute top-1/2 left-0 w-[min(28rem,80vw)] -translate-y-1/2">
                <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-berry">
                  <span className="font-display text-3xl tracking-normal text-berry/80 italic">{b.n}</span>
                  {b.kicker}
                </p>
                <h3 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.9] text-ink">
                  {b.title} <em className="text-berry">{b.accent}</em>
                </h3>
                <p className="mt-5 max-w-sm text-base leading-relaxed text-ink-soft sm:text-lg">{b.copy}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="absolute top-1/2 right-6 flex -translate-y-1/2 flex-col gap-3 sm:right-12" aria-hidden>
          {BEATS.map((b, i) => (
            <span key={b.n} className="relative block h-12 w-[3px] overflow-hidden rounded-full bg-ink/15">
              <span data-dot={i} className="absolute inset-0 origin-top scale-y-0 rounded-full bg-berry" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
