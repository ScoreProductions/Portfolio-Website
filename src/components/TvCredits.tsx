"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { useCallback, useState } from "react";
import { site, youtubeThumb, type Project } from "@/lib/site";
import { modalContent } from "./Portfolio";
import SectionHeader from "./SectionHeader";
import VideoModal from "./VideoModal";

const ease = [0.22, 1, 0.36, 1] as const;

/** Big "as seen on TV" credits list; hovering a row shows a floating still that follows the cursor. */
export default function TvCredits() {
  const shows = site.projects.filter((p) => p.tv);
  const channels = [...new Set(shows.flatMap((p) => p.brand.split("·").map((s) => s.trim())))];
  const [hover, setHover] = useState<Project | null>(null);
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });

  if (!shows.length) return null;

  return (
    <section id="tv" className="relative overflow-hidden py-24 md:py-36" onPointerMove={(e) => (x.set(e.clientX), y.set(e.clientY))}>
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <SectionHeader label="Televisie" title="Gezien op" accent="tv">
          <p className="mt-4 max-w-xl text-lg text-muted">Van de set van Hunted tot de bel in de Efteling: programma&apos;s die ik mee heb gemaakt voor het grote publiek.</p>
        </SectionHeader>

        <ul className="mt-14 border-t border-line md:mt-20" onPointerLeave={() => setHover(null)}>
          {shows.map((p, i) => (
            <motion.li
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.06, ease }}
              className="border-b border-line"
            >
              <button
                onClick={() => setOpen(p)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHover(p)}
                data-cursor="Play"
                className="group flex w-full flex-col gap-2 py-6 text-left md:flex-row md:items-center md:justify-between md:gap-8 md:py-8"
              >
                <span className="flex items-baseline gap-5 md:gap-8">
                  <span className="text-sm tabular-nums text-muted transition-colors group-hover:text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-5xl leading-[0.9] transition-all duration-500 group-hover:translate-x-3 group-hover:text-accent md:text-8xl">{p.title}</span>
                </span>
                <span className="flex flex-wrap items-center gap-x-4 gap-y-1 pl-9 text-sm text-muted md:shrink-0 md:flex-nowrap md:whitespace-nowrap md:pl-0 md:text-right md:text-base">
                  <span>{p.brand}</span>
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  <span className="text-fg">{p.functie}</span>
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  <span className="tabular-nums">{p.jaar}</span>
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Channel ticker */}
      <div className="mt-16 flex overflow-hidden border-y border-line py-5 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)] md:mt-24">
        {[0, 1].map((k) => (
          <motion.div
            key={k}
            aria-hidden={k === 1}
            className="flex shrink-0 items-center gap-10 pr-10"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            {[...channels, ...channels].map((c, j) => (
              <span key={`${k}-${j}`} className="font-display flex items-center gap-10 whitespace-nowrap text-3xl text-fg/80 md:text-5xl">
                {c}
                <span className="h-2 w-2 rounded-full bg-accent" />
              </span>
            ))}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {hover && (
          <motion.div
            key="float"
            className="pointer-events-none fixed left-0 top-0 z-30 hidden aspect-video w-[340px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl shadow-2xl md:block"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.35, ease }}
          >
            <AnimatePresence mode="popLayout">
              <motion.div key={hover.title} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Image src={hover.thumbnail || youtubeThumb(hover.video) || ""} alt="" fill sizes="340px" className="object-cover" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <VideoModal content={open ? modalContent(open, 0, () => {}) : null} onClose={close} />
    </section>
  );
}
