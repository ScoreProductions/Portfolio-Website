"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const links = [
  { href: "/#work", label: "Werk" },
  { href: "/#about", label: "Over" },
  { href: "/#services", label: "Diensten" },
  { href: "/#contact", label: "Contact" },
];

const ease = [0.76, 0, 0.24, 1] as const;

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 200);
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 mix-blend-difference md:px-10"
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.5, ease }}
      >
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.25em]" onClick={() => setOpen(false)}>
          {site.shortName}
          <span className="text-accent">.</span>
        </Link>
        <nav className="hidden gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="group relative text-sm">
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-fg transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>
        <button
          aria-label={open ? "Sluit menu" : "Open menu"}
          aria-expanded={open}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          <motion.span className="h-px w-7 bg-fg" animate={open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }} />
          <motion.span className="h-px w-7 bg-fg" animate={open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }} />
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-accent px-5 pb-10 text-bg md:hidden"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
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
                    <Link href={l.href} onClick={() => setOpen(false)} className="block text-6xl font-semibold tracking-tighter">
                      {l.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div
              className="mt-10 flex flex-wrap gap-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              exit={{ opacity: 0 }}
            >
              {site.socials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
