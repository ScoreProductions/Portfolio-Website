"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { site } from "@/lib/site";
import { lockScroll } from "./SmoothScroll";

const links = [
  { href: "#home", label: "Home" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#over-mij", label: "Over mij" },
  { href: "#contact", label: "Contact" },
];

const ease = [0.76, 0, 0.24, 1] as const;

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 300);
    setScrolled(v > 40);
  });

  const toggle = (next: boolean) => {
    setOpen(next);
    lockScroll(next);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8"
        animate={{ y: hidden && !open ? "-120%" : "0%" }}
        transition={{ duration: 0.5, ease }}
      >
        <div
          className={`mx-auto flex max-w-[1600px] items-center justify-between rounded-full px-5 py-3 transition-all duration-500 md:px-7 ${
            scrolled && !open ? "bg-white/75 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl" : ""
          }`}
        >
          <a href="#home" className="text-base font-semibold tracking-tight" onClick={() => toggle(false)}>
            {site.name}
            <span className="text-accent">.</span>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="group relative overflow-hidden rounded-full px-4 py-2 text-sm font-medium">
                <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
                <span className="relative block transition-colors duration-300 group-hover:text-white">{l.label}</span>
              </a>
            ))}
          </nav>
          <button
            aria-label={open ? "Sluit menu" : "Open menu"}
            aria-expanded={open}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full bg-accent md:hidden"
            onClick={() => toggle(!open)}
          >
            <motion.span className="h-[1.5px] w-5 bg-white" animate={open ? { rotate: 45, y: 3.75 } : { rotate: 0, y: 0 }} />
            <motion.span className="h-[1.5px] w-5 bg-white" animate={open ? { rotate: -45, y: -3.75 } : { rotate: 0, y: 0 }} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-accent px-6 pb-10 text-white md:hidden"
            initial={{ clipPath: "circle(0% at 90% 5%)" }}
            animate={{ clipPath: "circle(150% at 90% 5%)" }}
            exit={{ clipPath: "circle(0% at 90% 5%)" }}
            transition={{ duration: 0.8, ease }}
          >
            <ul className="space-y-1">
              {links.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.07, ease }}
                  >
                    <a href={l.href} onClick={() => toggle(false)} className="block text-6xl font-semibold tracking-tighter">
                      {l.label}
                    </a>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div
              className="mt-10 flex flex-wrap gap-5 text-sm font-medium"
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
