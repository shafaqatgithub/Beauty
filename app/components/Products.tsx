"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  {
    name: "Strawberry Bright Serum",
    tag: "10% Niacinamide",
    price: "₹595",
    src: "/assets/Products/image4.png",
    w: 199, h: 209,
    bg: "from-[#ffd9dc] to-[#f6a7ad]",
    glow: "rgba(211,32,44,0.45)",
  },
  {
    name: "Vitamin C + E Gel Face Wash",
    tag: "Super Bright",
    price: "₹345",
    src: "/assets/Products/image3.png",
    w: 390, h: 417,
    bg: "from-[#ffe2c7] to-[#ffb27a]",
    glow: "rgba(255,140,40,0.45)",
  },
  {
    name: "Vitamin C + E Glow Duo",
    tag: "Moisturiser + Wash",
    price: "₹845",
    src: "/assets/Products/image2.png",
    w: 207, h: 203,
    bg: "from-[#ffe7b8] to-[#ffc062]",
    glow: "rgba(255,170,30,0.45)",
  },
  {
    name: "Barrier Repair Collection",
    tag: "Ceramides + Probiotics",
    price: "₹1,195",
    src: "/assets/Products/image1.png",
    w: 267, h: 271,
    bg: "from-[#d7f1fb] to-[#9fd8ef]",
    glow: "rgba(60,160,210,0.45)",
  },
];

function TiltCard({ p, index }: { p: (typeof PRODUCTS)[number]; index: number }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 180, damping: 18 });
  const gx = useTransform(mx, (v) => `${v * 100}%`);
  const gy = useTransform(my, (v) => `${v * 100}%`);
  const shine = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.55), transparent 55%)`;

  return (
    <motion.article
      data-card
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => { mx.set(0.5); my.set(0.5); }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="group relative w-full shrink-0 [transform-style:preserve-3d] md:w-[min(26rem,34vw,calc((100svh-17rem)*0.8))]"
    >
      <div className={`relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br ${p.bg}`}>
        <span className="absolute top-6 left-6 font-display text-6xl text-white/70 italic">0{index + 1}</span>
        <div
          className="absolute inset-[18%] rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: p.glow, opacity: 0.6 }}
        />
        <div className="absolute inset-0 flex items-center justify-center px-6 pt-20 pb-8 [transform:translateZ(60px)]">
          <div data-card-img className="flex h-full w-full items-center justify-center">
          <Image
            src={p.src}
            alt={p.name}
            width={p.w}
            height={p.h}
            sizes="(min-width: 768px) 26rem, 80vw"
            className="h-auto max-h-full w-[88%] rounded-3xl object-contain shadow-[0_30px_60px_-20px_rgba(42,11,16,0.45)] transition-transform duration-700 group-hover:scale-105"
          />
          </div>
        </div>
        <motion.div className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: shine }} />
      </div>
      <div className="mt-5 flex items-start justify-between gap-4 px-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-berry">{p.tag}</p>
          <h3 className="mt-1 font-display text-2xl leading-tight text-ink sm:text-3xl">{p.name}</h3>
        </div>
        <p className="font-display text-2xl text-ink">{p.price}</p>
      </div>
      <button
        type="button"
        aria-label={`Add ${p.name} to cart`}
        className="mt-4 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-ink/15 text-sm font-semibold text-ink transition-colors hover:border-berry hover:bg-berry hover:text-cream"
      >
        Add to bag
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </motion.article>
  );
}

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current!;
      const distance = () => track.scrollWidth - window.innerWidth;
      const scroll = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });
      // Inner parallax: product shots drift against the track as cards travel across the screen.
      gsap.utils.toArray<HTMLElement>("[data-card-img]").forEach((img) => {
        gsap.fromTo(img, { x: 70 }, {
          x: -70,
          ease: "none",
          scrollTrigger: { trigger: img, containerAnimation: scroll, start: "left right", end: "right left", scrub: true },
        });
      });
    });
    mm.add("(max-width: 767px)", () => {
      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card) => {
        gsap.from(card, { y: 60, autoAlpha: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 85%" } });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="products" ref={sectionRef} className="relative overflow-hidden bg-cream py-24 md:flex md:h-svh md:items-center md:pt-20 md:pb-8">
      <div
        ref={trackRef}
        className="flex flex-col gap-14 px-6 md:flex-row md:items-center md:gap-10 md:pr-[10vw] md:pl-12 lg:pl-20"
      >
        <div className="shrink-0 md:w-[min(30rem,38vw)]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-berry">The fruit bar</p>
          <h2 className="font-display text-[clamp(2.8rem,6vw,6rem)] leading-[0.88] text-ink">
            Pick your <em className="text-berry">squeeze.</em>
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-ink-soft sm:text-lg">
            Every formula starts with a fruit. Strawberry to brighten, blood orange to energise, blueberry to calm.
          </p>
          <p className="mt-10 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-ink/60 md:flex">
            Keep scrolling
            <svg width="28" height="12" viewBox="0 0 28 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M0 6h26M21 1l5 5-5 5" />
            </svg>
          </p>
        </div>
        {PRODUCTS.map((p, i) => (
          <TiltCard key={p.name} p={p} index={i} />
        ))}
      </div>
    </section>
  );
}
