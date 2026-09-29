"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { embedUrl, site } from "@/lib/site";
import VideoModal, { type ModalContent } from "./VideoModal";

export default function Showreel() {
  const ref = useRef<HTMLElement>(null);
  const [modal, setModal] = useState<ModalContent | null>(null);
  const close = useCallback(() => setModal(null), []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const inset = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [48, 24]);
  const clipPath = useTransform([inset, radius], ([i, r]) => `inset(${i}% ${i}% ${i}% ${i}% round ${r}px)`);
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);
  const isFile = site.showreel && !embedUrl(site.showreel);

  return (
    <section id="showreel" ref={ref} className="px-3 md:px-6">
      <motion.button
        style={{ clipPath }}
        data-cursor="Play"
        aria-label="Bekijk showreel"
        onClick={() => setModal({ title: "Showreel", video: site.showreel, meta: <p className="text-muted">{site.brand} — {site.role}</p> })}
        className="group relative block aspect-[4/5] w-full overflow-hidden bg-accent md:aspect-video"
      >
        <motion.div style={{ scale }} className="absolute inset-0">
          {isFile ? (
            <video src={site.showreel} poster={site.showreelPoster || undefined} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          ) : (
            <div className="relative h-full w-full bg-[radial-gradient(90%_90%_at_20%_20%,#ff3b45_0%,transparent_60%),radial-gradient(80%_80%_at_85%_85%,#6e0008_0%,transparent_65%),#e10a17]">
              <motion.div
                aria-hidden
                className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 opacity-30"
                style={{ background: "repeating-conic-gradient(from 0deg, #fff 0deg 1deg, transparent 1deg 12deg)" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white md:p-12">
          <span className="text-[14vw] font-semibold uppercase leading-[0.8] tracking-[-0.05em] md:text-[9vw]">Showreel</span>
          <span className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white text-accent transition-transform duration-500 group-hover:scale-110 md:h-24 md:w-24">
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 md:h-8 md:w-8" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </div>
      </motion.button>
      <VideoModal content={modal} onClose={close} />
    </section>
  );
}
