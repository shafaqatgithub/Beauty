"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

/** Smoothly scroll to a selector or y position; falls back to native scroll when Lenis is off. */
export function scrollToTarget(target: string | number) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: 0, duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target });
  else document.querySelector(target)?.scrollIntoView();
}

/**
 * Elements with `data-speed="<px>"` drift by that many pixels across their scroll range,
 * giving layered depth. Positive values lag behind the scroll, negative values race ahead.
 */
function setupParallax() {
  gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
    const amount = parseFloat(el.dataset.speed || "0");
    gsap.fromTo(
      el,
      { y: -amount },
      {
        y: amount,
        ease: "none",
        force3D: true,
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
    });
    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(setupParallax);

    // Re-measure once fonts/images settle so pinned sections and parallax line up.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
