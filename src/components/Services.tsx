"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { site } from "@/lib/site";
import { Reveal, SplitLine } from "./Reveal";

export default function Services() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="services" className="px-5 py-28 md:px-10 md:py-44">
      <h2 className="mb-16 text-[14vw] font-semibold uppercase leading-[0.85] tracking-[-0.05em] md:text-[9vw]">
        <SplitLine text="Wat we" />
        <SplitLine text="doen" delay={0.1} className="font-serif font-normal normal-case italic text-accent" />
      </h2>
      <ul className="border-t border-line">
        {site.services.map((s, i) => {
          const active = open === i;
          return (
            <Reveal key={s.title} delay={i * 0.05}>
              <li className="border-b border-line">
                <button
                  className="group flex w-full items-center justify-between gap-6 py-8 text-left md:py-10"
                  onClick={() => setOpen(active ? null : i)}
                  aria-expanded={active}
                >
                  <span className="flex items-baseline gap-5 md:gap-10">
                    <span className="text-sm tabular-nums text-muted">0{i + 1}</span>
                    <span className="text-3xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-3 md:text-6xl">
                      {s.title}
                    </span>
                  </span>
                  <motion.span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-xl md:h-14 md:w-14"
                    animate={{ rotate: active ? 45 : 0, backgroundColor: active ? "#e8ff47" : "rgba(0,0,0,0)", color: active ? "#0a0a0b" : "#f2efe9" }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-10 text-lg text-muted md:ml-[5.5rem] md:text-xl">{s.text}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
