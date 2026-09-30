"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { lockScroll } from "./SmoothScroll";

const links = [
  { id: "home", label: "Home" },
  { id: "portfolio", label: "Portfolio" },
  { id: "over-mij", label: "Over mij" },
  { id: "contact", label: "Contact" },
];

const ease = [0.76, 0, 0.24, 1] as const;

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [onHero, setOnHero] = useState(true);
  const [active, setActive] = useState("home");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setOnHero(v < window.innerHeight - 90));

  useEffect(() => {
    const els = links.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const toggle = (next: boolean) => {
    setOpen(next);
    lockScroll(next);
  };

  const light = onHero || open;
  const onRed = !onHero && !open && active === "contact";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-10 md:pt-6">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
          <a
            href="#home"
            onClick={() => toggle(false)}
            className={`font-display relative z-50 rounded-full px-4 py-2 text-2xl tracking-wide backdrop-blur-xl transition-all duration-500 md:text-3xl ${
              light ? "-ml-4 text-white" : "border border-fg/10 bg-white/70 text-fg shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
            }`}
          >
            {site.name}
          </a>

          <nav
            className={`absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border p-1.5 backdrop-blur-xl transition-colors duration-500 md:flex ${
              light ? "border-white/20 bg-white/10" : "border-fg/10 bg-white/70 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
            }`}
          >
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300 ${
                  active === l.id ? (light ? "text-accent" : "text-white") : light ? "text-white/85 hover:text-white" : "text-fg/70 hover:text-fg"
                }`}
              >
                {active === l.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className={`absolute inset-0 rounded-full ${light ? "bg-white" : "bg-accent"}`}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className={`group relative hidden overflow-hidden rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-500 md:block ${
              light || onRed ? "bg-white text-accent" : "bg-accent text-white"
            }`}
          >
            <span className="absolute inset-0 translate-y-full rounded-full bg-fg transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
            <span className="relative transition-colors duration-300 group-hover:text-white">Neem contact op</span>
          </a>

          <button
            aria-label={open ? "Sluit menu" : "Open menu"}
            aria-expanded={open}
            className={`relative z-50 flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-full border backdrop-blur-md transition-colors duration-500 md:hidden ${
              light ? "border-white/30 bg-white/10" : "border-fg/10 bg-white/80"
            }`}
            onClick={() => toggle(!open)}
          >
            {[0, 1].map((i) => (
              <motion.span
                key={i}
                className={`h-[1.5px] w-5 transition-colors duration-500 ${light ? "bg-white" : "bg-fg"}`}
                animate={open ? { rotate: i ? -45 : 45, y: i ? -3.75 : 3.75 } : { rotate: 0, y: 0 }}
              />
            ))}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-between bg-accent px-6 pb-10 pt-28 text-white md:hidden"
            initial={{ clipPath: "circle(0% at 92% 6%)" }}
            animate={{ clipPath: "circle(150% at 92% 6%)" }}
            exit={{ clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: 0.8, ease }}
          >
            <ul>
              {links.map((l, i) => (
                <li key={l.id} className="overflow-hidden border-b border-white/20">
                  <motion.a
                    href={`#${l.id}`}
                    onClick={() => toggle(false)}
                    className="font-display flex items-baseline justify-between py-3 text-7xl leading-none"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.07, ease }}
                  >
                    {l.label}
                    <span className="font-sans text-sm text-white/60">0{i + 1}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              className="flex flex-wrap gap-5 text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              exit={{ opacity: 0 }}
            >
              <a href={site.contact.instagram} target="_blank" rel="noreferrer">Instagram</a>
              <a href={`https://wa.me/${site.contact.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a>
              <a href={site.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
