"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { scrollToTarget } from "./SmoothScroll";

const NAV = [
  { label: "Strawberry Dew", href: "#hero" },
  { label: "Lip Ritual", href: "#ritual" },
  { label: "Science", href: "#science" },
  { label: "Shop", href: "#products" },
  { label: "Reviews", href: "#reviews" },
];

export default function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 400 && !open);
  });

  const go = (href: string) => {
    setOpen(false);
    scrollToTarget(href);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -100 : 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 sm:px-7 ${
          scrolled
            ? "bg-cream/75 shadow-[0_10px_40px_-12px_rgba(158,18,32,0.25)] ring-1 ring-berry/10 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); go("#hero"); }}
          className="font-display text-2xl font-semibold tracking-tight text-ink"
          aria-label="Dot & Key home"
        >
          DOT <span className="italic text-berry">&amp;</span> KEY
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => { e.preventDefault(); go(item.href); }}
              className="group relative rounded-full px-4 py-2 text-sm font-medium text-ink/80 transition-colors hover:text-berry"
            >
              {item.label}
              <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-berry transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Cart, 0 items"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-berry/10 hover:text-berry"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 7h12l-1 13H7L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
          </button>
          <a
            href="#products"
            onClick={(e) => { e.preventDefault(); go("#products"); }}
            className="hidden h-11 items-center rounded-full bg-berry px-6 text-sm font-semibold text-cream shadow-lg shadow-berry/30 transition-all hover:bg-berry-deep hover:shadow-berry/50 sm:flex"
          >
            Shop now
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-berry/10 lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-3 max-w-7xl overflow-hidden rounded-3xl bg-cream/95 p-3 shadow-2xl ring-1 ring-berry/10 backdrop-blur-xl lg:hidden"
          >
            {NAV.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={(e) => { e.preventDefault(); go(item.href); }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.04 * i } }}
                className="flex min-h-12 items-center rounded-2xl px-4 font-display text-2xl text-ink hover:bg-berry/10 hover:text-berry"
              >
                {item.label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
