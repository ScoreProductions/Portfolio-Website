"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/site";
import { Corners } from "./Frame";
import { Reveal } from "./Reveal";
import SectionHeader from "./SectionHeader";

export default function Services() {
  return (
    <section id="diensten" className="mx-auto grid max-w-[1500px] gap-10 px-5 py-16 md:grid-cols-[1.5fr_1fr] md:gap-20 md:px-10 md:py-36">
      <div>
        <SectionHeader label={site.brand} title="Wat we" accent="doen">
          <p className="mt-4 max-w-xl text-lg text-muted">{site.services.intro}</p>
        </SectionHeader>
        <ul className="mt-10 border-t border-line md:mt-14">
          {site.services.items.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <li className="group relative flex flex-col gap-2 border-b border-line py-5 md:flex-row md:items-center md:justify-between md:gap-6 md:py-6">
                <span aria-hidden className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100" />
                <span className="flex items-baseline gap-5 md:gap-8">
                  <span className="text-sm tabular-nums text-muted transition-colors duration-300 group-hover:text-accent">0{i + 1}</span>
                  <span className="font-display text-4xl leading-none transition-all duration-500 group-hover:translate-x-2 group-hover:text-accent md:text-6xl">{s.title}</span>
                </span>
                <span className="flex flex-wrap gap-x-4 gap-y-1 pl-9 text-sm text-muted md:pl-0 md:text-base">
                  {s.points.map((pt, k) => (
                    <span
                      key={pt}
                      className="flex items-center gap-2 transition-all duration-500 md:translate-x-4 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100"
                      style={{ transitionDelay: `${k * 60}ms` }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {pt}
                    </span>
                  ))}
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>

      <Reveal className="md:pt-28">
        <div className="sticky top-28 overflow-hidden rounded-3xl bg-accent p-8 text-white md:p-10">
          <Corners both />
          <p className="pl-8 text-xs font-semibold uppercase tracking-[0.35em] text-white/80 md:pl-10">{site.freelance.title}</p>
          <p className="mt-6 text-xl leading-snug text-white/90 md:text-2xl">{site.freelance.intro}</p>
          <ul className="mt-8 space-y-3">
            {site.freelance.items.map((item, i) => (
              <motion.li
                key={item}
                className="font-display flex items-center gap-4 border-b border-white/20 pb-3 text-3xl leading-none md:text-4xl"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
