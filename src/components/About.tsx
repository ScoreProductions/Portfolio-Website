"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { site } from "@/lib/site";
import { Reveal, SplitLine } from "./Reveal";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);

  return (
    <section id="over-mij" className="px-5 py-28 md:px-10 md:py-40">
      <h2 className="mb-14 text-[17vw] font-semibold uppercase leading-[0.82] tracking-[-0.055em] md:mb-20 md:text-[10vw]">
        <SplitLine text="Over" />
        <SplitLine text="mij" delay={0.1} className="font-serif font-normal normal-case italic text-accent md:pl-[8vw]" />
      </h2>

      <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
        <motion.div ref={ref} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10%" }}>
          <motion.div
            style={{ rotate }}
            variants={{ hidden: { clipPath: "inset(100% 0% 0% 0% round 24px)" }, show: { clipPath: "inset(0% 0% 0% 0% round 24px)" } }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-accent md:sticky md:top-28"
          >
            <motion.div style={{ y }} className="absolute -inset-[10%]">
              {site.about.photo ? (
                <Image src={site.about.photo} alt={site.name} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(70%_60%_at_50%_35%,rgba(255,255,255,0.25),transparent_70%)]">
                  <span className="text-sm font-medium uppercase tracking-[0.25em] text-white/80">Foto volgt</span>
                </div>
              )}
            </motion.div>
            <div className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-fg">{site.name}</div>
          </motion.div>
        </motion.div>

        <div className="space-y-4">
          {site.about.blocks.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.05}>
              <div className="group rounded-3xl border border-line p-7 transition-colors duration-500 hover:border-accent hover:bg-accent hover:text-white md:p-10">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">{b.title}</h3>
                  <span className="text-sm tabular-nums text-muted transition-colors duration-500 group-hover:text-white/70">0{i + 1}</span>
                </div>
                <p className="mt-4 text-lg leading-relaxed text-muted transition-colors duration-500 group-hover:text-white/90">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
