"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "@/lib/site";
import Magnetic from "./Magnetic";
import { SplitLine } from "./Reveal";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-20%", "0%"]);

  return (
    <footer ref={ref} id="contact" className="relative overflow-hidden px-5 pb-8 pt-28 md:px-10 md:pt-44">
      <p className="mb-8 text-xs uppercase tracking-[0.3em] text-muted">(Contact)</p>
      <h2 className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-tighter md:text-8xl">
        {site.contact.title.split(". ").map((part, i, arr) => (
          <SplitLine key={i} text={i < arr.length - 1 ? `${part}.` : part} delay={i * 0.1} />
        ))}
      </h2>

      <div className="mt-14 flex flex-col gap-8 md:flex-row md:items-center">
        <Magnetic>
          <a
            href={`mailto:${site.email}`}
            className="group relative inline-flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-accent text-center text-sm font-semibold uppercase tracking-widest text-bg md:h-44 md:w-44"
          >
            <span className="absolute inset-0 translate-y-full rounded-full bg-fg transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
            <span className="relative px-4">{site.contact.button}</span>
          </a>
        </Magnetic>
        <a href={`mailto:${site.email}`} className="break-all text-2xl underline decoration-line underline-offset-8 transition-colors hover:decoration-accent md:text-4xl">
          {site.email}
        </a>
      </div>

      <div className="mt-24 flex flex-col justify-between gap-6 border-t border-line pt-8 text-sm text-muted md:flex-row">
        <div className="flex flex-wrap gap-6">
          {site.socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="transition-colors hover:text-fg">
              {s.label} ↗
            </a>
          ))}
        </div>
        <span>
          © {new Date().getFullYear()} {site.name} — {site.location}
        </span>
      </div>

      <motion.div
        aria-hidden
        style={{ x }}
        className="pointer-events-none mt-10 select-none whitespace-nowrap text-[22vw] font-semibold uppercase leading-[0.8] tracking-[-0.06em] text-fg/[0.06]"
      >
        {site.name}
      </motion.div>
    </footer>
  );
}
