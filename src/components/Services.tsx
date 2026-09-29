"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { site } from "@/lib/site";
import { Reveal, SplitLine } from "./Reveal";

export default function Services() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="diensten" className="grid gap-16 px-5 py-28 md:grid-cols-[1.4fr_1fr] md:gap-20 md:px-10 md:py-40">
      <div>
        <p className="mb-6 text-sm font-medium uppercase tracking-[0.25em] text-accent">{site.brand}</p>
        <h2 className="mb-12 text-6xl font-semibold tracking-[-0.04em] md:text-8xl">
          <SplitLine text={site.services.title} />
        </h2>
        <ul className="border-t border-line">
          {site.services.items.map((s, i) => {
            const active = open === i;
            return (
              <li key={s.title} className="border-b border-line">
                <button
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-8"
                  onClick={() => setOpen(active ? null : i)}
                  aria-expanded={active}
                >
                  <span className="flex items-baseline gap-5 md:gap-8">
                    <span className="text-sm tabular-nums text-muted">0{i + 1}</span>
                    <span className={`text-3xl font-semibold tracking-tight transition-all duration-500 group-hover:translate-x-2 md:text-5xl ${active ? "text-accent" : ""}`}>
                      {s.title}
                    </span>
                  </span>
                  <motion.span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-xl md:h-12 md:w-12"
                    animate={{ rotate: active ? 45 : 0, backgroundColor: active ? "#e10a17" : "rgba(255,255,255,0)", color: active ? "#ffffff" : "#0e0e0e", borderColor: active ? "#e10a17" : "rgba(14,14,14,0.12)" }}
                    transition={{ duration: 0.4 }}
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
                      <p className="max-w-xl pb-8 text-lg text-muted md:ml-[3.9rem]">{s.text}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>

      <Reveal className="md:pt-24">
        <div className="sticky top-28 overflow-hidden rounded-3xl bg-accent p-8 text-white md:p-10">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-white/70">{site.freelance.title}</p>
          <p className="mt-4 text-xl leading-snug">{site.freelance.intro}</p>
          <ul className="mt-8 space-y-3">
            {site.freelance.items.map((item, i) => (
              <motion.li
                key={item}
                className="flex items-center gap-4 border-b border-white/20 pb-3 text-2xl font-semibold tracking-tight md:text-3xl"
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
          <p className="mt-10 font-serif text-4xl italic md:text-5xl">{site.freelance.footer}</p>
        </div>
      </Reveal>
    </section>
  );
}
