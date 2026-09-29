"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { site } from "@/lib/site";
import { Reveal } from "./Reveal";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {word}
    </motion.span>
  );
}

export default function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = site.about.text.split(" ");

  return (
    <section id="about" className="px-5 py-28 md:px-10 md:py-44">
      <Reveal>
        <p className="mb-10 text-xs uppercase tracking-[0.3em] text-muted">({site.about.title})</p>
      </Reveal>
      <p ref={ref} className="max-w-6xl text-3xl font-medium leading-[1.15] tracking-tight md:text-6xl">
        {words.map((w, i) => (
          <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
        ))}
      </p>
      <div className="mt-20 grid grid-cols-1 gap-10 border-t border-line pt-10 sm:grid-cols-3">
        {site.about.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1}>
            <div className="text-6xl font-semibold tracking-tighter md:text-8xl">{s.value}</div>
            <div className="mt-2 text-sm uppercase tracking-[0.2em] text-muted">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
