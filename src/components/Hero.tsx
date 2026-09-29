"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const blobY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pb-10 pt-28 md:px-10 md:pb-14">
      <motion.div
        aria-hidden
        style={{ y: blobY }}
        className="pointer-events-none absolute -right-[20vw] -top-[10vw] h-[70vw] w-[70vw] rounded-full opacity-60 blur-[100px] md:h-[50vw] md:w-[50vw]"
      >
        <motion.div
          className="h-full w-full rounded-full"
          style={{ background: "conic-gradient(from 0deg, #e8ff47, #3dd6ff, #7a2cff, #ff3d7f, #e8ff47)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      <motion.div style={{ y, scale, opacity }} className="relative origin-bottom-left">
        <motion.p
          className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted md:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {site.availability}
        </motion.p>

        <h1 className="text-[12.5vw] font-semibold uppercase leading-[0.88] tracking-[-0.05em] md:text-[10.5vw]">
          {site.hero.lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.05em]">
              <motion.span
                className={`block ${i === 1 ? "font-serif font-normal normal-case italic tracking-[-0.03em] text-accent" : ""} ${i === 2 ? "md:pl-[10vw]" : ""}`}
                initial={{ y: "110%", rotate: 6 }}
                animate={{ y: "0%", rotate: 0 }}
                transition={{ duration: 1.3, delay: 1.1 + i * 0.12, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <motion.p
            className="max-w-md text-base text-muted md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 1, ease }}
          >
            {site.hero.intro}
          </motion.p>
          <motion.a
            href="#work"
            className="flex items-center gap-3 text-sm uppercase tracking-[0.2em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9 }}
          >
            Scroll
            <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
              ↓
            </motion.span>
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
