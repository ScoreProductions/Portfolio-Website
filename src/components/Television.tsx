"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { site } from "@/lib/site";
import SectionHeader from "./SectionHeader";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Television() {
  const tv = site.tv;
  if (!tv?.items.length) return null;

  return (
    <section id="televisie" className="mx-auto max-w-[1500px] px-5 pb-28 md:px-10 md:pb-36">
      <SectionHeader label={tv.label} title={tv.title} accent={tv.accent}>
        <p className="mt-4 max-w-2xl text-lg text-muted">{tv.intro}</p>
      </SectionHeader>

      <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3 md:gap-6">
        {tv.items.map((show, i) => (
          <motion.article
            key={show.title}
            className={`overflow-hidden rounded-2xl border border-line md:rounded-3xl ${show.timeline.length ? "md:col-span-3 md:grid md:grid-cols-2" : ""}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease }}
          >
            <div className="group relative aspect-video overflow-hidden bg-fg md:aspect-auto md:min-h-[280px]">
              <Image
                src={show.thumbnail}
                alt={show.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white md:left-6 md:top-6 md:text-[11px]">
                {show.rol}
              </span>
            </div>

            <div className="p-6 md:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
                {show.zender} · {show.jaar}
              </p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-tight md:text-3xl">{show.title}</h3>
              <p className="mt-4 leading-relaxed text-muted">{show.description}</p>

              {show.timeline.length > 0 && (
                <ol className="relative mt-8 space-y-4 border-l-2 border-line pl-6">
                  {show.timeline.map((t) => (
                    <li key={t.label} className="relative">
                      <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-bg" />
                      <p className="font-semibold">{t.label}</p>
                      <p className="text-sm text-muted">{t.date}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
