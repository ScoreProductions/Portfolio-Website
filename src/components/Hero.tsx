"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

function RoleRotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % site.roles.length), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-flex h-[1.4em] items-center overflow-hidden pr-[0.15em] leading-[1.4]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={site.roles[i]}
          className="block font-serif italic text-accent"
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.45, ease }}
        >
          {site.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const words = site.brand.split(" ");

  return (
    <section id="home" ref={ref} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pb-12 pt-32 md:px-10 md:pb-16">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-[25vw] -top-[20vw] h-[70vw] w-[70vw] rounded-full bg-accent/15 blur-[120px] md:-right-[10vw] md:h-[45vw] md:w-[45vw]"
        animate={{ scale: [1, 1.15, 1], x: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div style={{ y, opacity }} className="relative">
        <motion.div
          className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-2xl font-medium tracking-tight md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1, ease }}
        >
          <span>{site.name}</span>
          <span className="h-px w-8 bg-fg/30 md:w-14" />
          <RoleRotator />
        </motion.div>

        <h1 className="text-[13vw] font-semibold uppercase leading-[0.84] tracking-[-0.055em] md:text-[11vw]">
          {words.map((w, i) => (
            <span key={w} className="block overflow-hidden pb-[0.04em]">
              <motion.span
                className={`block ${i === 1 ? "text-accent md:pl-[8vw]" : ""}`}
                initial={{ y: "105%", rotate: 5 }}
                animate={{ y: "0%", rotate: 0 }}
                transition={{ duration: 1.3, delay: 1.05 + i * 0.12, ease }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <motion.p
            className="max-w-xl text-xl leading-snug tracking-tight md:text-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 1, ease }}
          >
            {site.tagline} <span className="font-serif italic text-accent">{site.taglineAccent}</span>
          </motion.p>
          <motion.a
            href="#showreel"
            className="group flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9 }}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-fg/20 transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
              <motion.span animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
                ↓
              </motion.span>
            </span>
            Scroll
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
