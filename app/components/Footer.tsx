"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Bubbles3D from "./Bubbles3D";

const COLUMNS = [
  { title: "Shop", links: ["Strawberry Dew", "Lip Ritual", "Serums", "Cleansers", "Gift sets"] },
  { title: "Help", links: ["Track order", "Shipping", "Returns", "Contact us", "FAQs"] },
  { title: "About", links: ["Our story", "Ingredients", "Sustainability", "Careers", "Press"] },
];

const SOCIALS = [
  { label: "Instagram", d: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm5.5-1.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z" },
  { label: "YouTube", d: "M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8ZM10 15V9l5.2 3L10 15Z" },
  { label: "Pinterest", d: "M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.3-5.4s-.3-.7-.3-1.6c0-1.5.9-2.7 2-2.7.9 0 1.4.7 1.4 1.6 0 1-.6 2.4-.9 3.7-.3 1.1.6 2 1.7 2 2 0 3.5-2.1 3.5-5.2 0-2.7-2-4.6-4.8-4.6-3.3 0-5.2 2.5-5.2 5 0 1 .4 2.1.9 2.7l.1.4-.3 1.3c0 .2-.2.3-.4.2-1.4-.7-2.3-2.7-2.3-4.4 0-3.6 2.6-6.9 7.5-6.9 3.9 0 7 2.8 7 6.6 0 3.9-2.5 7.1-5.9 7.1-1.2 0-2.3-.6-2.6-1.3l-.7 2.7c-.3 1-1 2.2-1.4 3A10 10 0 1 0 12 2Z" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(/^\S+@\S+\.\S+$/.test(email) ? "done" : "error");
  };

  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      <Bubbles3D count={18} depth={3} className="absolute inset-0 opacity-50" />

      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-10">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="font-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.9]">
              Join the <em className="text-[#ff8a93]">berry club.</em>
            </h2>
            <p className="mt-5 max-w-md text-cream/70">
              First dibs on drops, skin tips from our chemists, and 10% off your first order.
            </p>
            <form onSubmit={submit} noValidate className="mt-8 max-w-md">
              <label htmlFor="footer-email" className="mb-2 block text-sm font-medium text-cream/80">
                Email address
              </label>
              <div className="flex gap-2 rounded-full bg-cream/10 p-1.5 ring-1 ring-cream/15 focus-within:ring-[#ff8a93]">
                <input
                  id="footer-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                  aria-invalid={status === "error"}
                  aria-describedby="footer-email-msg"
                  placeholder="you@example.com"
                  className="h-11 min-w-0 flex-1 bg-transparent px-4 text-cream placeholder:text-cream/40 focus:outline-none"
                />
                <button type="submit" className="h-11 cursor-pointer rounded-full bg-berry px-6 text-sm font-semibold transition-colors hover:bg-[#ff4d58]">
                  Subscribe
                </button>
              </div>
              <p id="footer-email-msg" role="status" className={`mt-2 min-h-5 text-sm ${status === "error" ? "text-[#ff8a93]" : "text-cream/70"}`}>
                {status === "error" && "Please enter a valid email address."}
                {status === "done" && "You're in — check your inbox for 10% off."}
              </p>
            </form>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-cream/50">{col.title}</h3>
                <ul className="mt-5 space-y-1">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="inline-flex min-h-9 items-center text-cream/85 transition-colors hover:text-[#ff8a93]">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div data-speed="-50">
        <motion.p
          initial={{ y: "40%", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-24 text-center font-display text-[clamp(4rem,19vw,17rem)] leading-[0.8] font-medium tracking-tight text-cream/95 select-none"
          aria-hidden
        >
          DOT <em className="text-berry">&amp;</em> KEY
        </motion.p>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-cream/10 pt-8 text-sm text-cream/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Dot &amp; Key Skincare. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center rounded-full text-cream/80 ring-1 ring-cream/15 transition-colors hover:bg-cream hover:text-ink"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-cream">Privacy</a>
            <a href="#" className="hover:text-cream">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
