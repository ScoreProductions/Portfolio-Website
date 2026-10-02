"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { site } from "@/lib/site";
import CountUp from "./CountUp";
import { Corners } from "./Frame";
import { Reveal } from "./Reveal";
import SectionHeader from "./SectionHeader";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="over-mij" className="mx-auto grid max-w-[1500px] items-start gap-12 px-5 py-28 md:grid-cols-2 md:gap-20 md:px-10 md:py-40">
      <motion.div ref={ref} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10%" }} className="md:sticky md:top-28">
        <motion.div
          variants={{ hidden: { clipPath: "inset(100% 0% 0% 0% round 24px)" }, show: { clipPath: "inset(0% 0% 0% 0% round 24px)" } }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-accent"
        >
          <motion.div style={{ y }} className="absolute -inset-[8%]">
            {site.about.photo ? (
              <Image src={site.about.photo} alt={site.name} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(70%_60%_at_50%_35%,rgba(255,255,255,0.25),transparent_70%)]">
                <span className="text-xs font-medium uppercase tracking-[0.35em] text-white/80">Foto volgt</span>
              </div>
            )}
          </motion.div>
          <Corners both />
        </motion.div>
      </motion.div>

      <div>
        <SectionHeader label="Over mij" title={site.about.title.split(" ")[0]} accent={site.about.title.split(" ").slice(1).join(" ")} />
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {site.about.blocks.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.05}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">{b.title}</h3>
              <p className="mt-2 text-lg leading-relaxed text-fg/75">{b.text}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-8">
          {site.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="font-display text-6xl leading-none text-accent md:text-7xl"><CountUp value={s.value} /></div>
              <div className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-muted">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
