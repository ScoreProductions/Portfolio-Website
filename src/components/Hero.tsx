"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { embedUrl, site, youtubeBackgroundUrl } from "@/lib/site";
import BackgroundVideo from "./BackgroundVideo";

const ease = [0.22, 1, 0.36, 1] as const;

function Timecode() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const id = setInterval(() => setT(performance.now() - start), 40);
    return () => clearInterval(id);
  }, []);
  const f = Math.floor((t / 40) % 25);
  const s = Math.floor(t / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span className="tabular-nums">
      00:{pad(Math.floor(s / 60))}:{pad(s % 60)}:{pad(f)}
    </span>
  );
}

const ROLE_MS = 4500;

/** Timeline-style strip listing every role; the active one fills like a playhead. */
function RoleTimeline({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <div className="flex items-start justify-center gap-3 sm:gap-5">
      {site.roles.map((r, i) => (
        <button
          key={r}
          onClick={() => onSelect(i)}
          className={`group flex w-16 flex-col items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] transition-colors duration-500 sm:w-24 sm:text-[11px] ${
            i === active ? "text-white" : "text-white/45 hover:text-white/80"
          }`}
        >
          <span className="relative block h-[2px] w-full overflow-hidden rounded-full bg-white/20">
            {i === active && (
              <motion.span
                key={`fill-${active}`}
                className="absolute inset-y-0 left-0 bg-white"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: ROLE_MS / 1000, ease: "linear" }}
              />
            )}
          </span>
          {r}
        </button>
      ))}
    </div>
  );
}

function RoleWord({ i }: { i: number }) {
  const word = site.roles[i];
  return (
    <span className="relative block overflow-hidden py-[0.06em]" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={word} className="flex justify-center" initial="hidden" animate="show" exit="exit">
          {word.split("").map((ch, k) => (
            <motion.span
              key={k}
              className="inline-block"
              variants={{ hidden: { y: "105%" }, show: { y: "0%" }, exit: { y: "-105%" } }}
              transition={{ duration: 0.7, delay: k * 0.04, ease }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const [role, setRole] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setRole((n) => (n + 1) % site.roles.length), ROLE_MS);
    return () => clearTimeout(id);
  }, [role]);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const isFile = site.showreel && !embedUrl(site.showreel);
  const ytBg = site.showreel ? youtubeBackgroundUrl(site.showreel) : null;

  return (
    <section id="home" ref={ref} className="relative h-[100svh] min-h-[560px] overflow-hidden bg-accent text-white">
      <motion.div style={{ scale: bgScale }} className="absolute inset-0 will-change-transform">
        {ytBg ? (
          // YouTube showreel as background: scaled to cover, slightly blurred and darkened so the text stays readable.
          <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black [container-type:size]">
            <iframe
              src={ytBg}
              title=""
              tabIndex={-1}
              aria-hidden
              allow="autoplay; encrypted-media"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-110 border-0 blur-[2px]"
              style={{ width: "max(100cqw, 177.78cqh)", height: "max(100cqh, 56.25cqw)" }}
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-accent/20 mix-blend-multiply" />
          </div>
        ) : isFile ? (
          <>
            <BackgroundVideo src={site.showreel} poster={site.showreelPoster || undefined} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/45" />
          </>
        ) : (
          <div className="h-full w-full" style={{ background: "radial-gradient(70% 60% at 50% 45%, #ff2a36 0%, transparent 70%), radial-gradient(60% 60% at 100% 100%, #6e0008 0%, transparent 70%), radial-gradient(50% 50% at 0% 0%, #8a000b 0%, transparent 70%), #d10714" }}>
            <motion.div
              aria-hidden
              className="absolute inset-0 opacity-[0.07]"
              style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 4px)" }}
              animate={{ y: [0, 8] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/45" />
      </motion.div>

      <motion.div
        className="absolute inset-x-3 bottom-14 top-20 text-white/70 md:inset-x-6 md:bottom-20 md:top-24"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 1.2, ease }}
      >
        {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
          <span key={c} aria-hidden className={`absolute h-8 w-8 border-current md:h-12 md:w-12 ${c}`} />
        ))}
      </motion.div>

      <motion.div
        className="absolute inset-x-7 top-28 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.3em] text-white/80 md:inset-x-12 md:top-36 md:text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span className="flex items-center gap-2">
          <motion.span className="h-2 w-2 rounded-full bg-white" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
          Rec
        </span>
        <Timecode />
      </motion.div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative flex h-full flex-col items-center justify-center px-5 text-center">
        <motion.p
          className="font-display text-xl tracking-[0.45em] text-white/85 md:text-3xl"
          initial={{ opacity: 0, y: 20, letterSpacing: "0.9em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.45em" }}
          transition={{ delay: 1.1, duration: 1.4, ease }}
        >
          {site.heroEyebrow}
        </motion.p>
        <h1 className="font-display mt-2 text-[27vw] leading-[0.85] md:text-[15vw]">
          <span className="sr-only">
            {site.name} — {site.roles.join(", ")}
          </span>
          <motion.span
            aria-hidden
            className="block"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 1.2, duration: 1.2, ease }}
          >
            <RoleWord i={role} />
          </motion.span>
        </h1>
        <motion.p
          className="mt-5 flex flex-wrap items-baseline justify-center gap-x-3 text-white/90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1, ease }}
        >
          <span className="font-display text-xl tracking-[0.3em] md:text-3xl">{site.heroSub}</span>
          <span className="font-serif text-2xl italic md:text-4xl">{site.heroSubAccent}</span>
        </motion.p>
        <motion.div
          className="mt-10 md:mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <RoleTimeline active={role} onSelect={setRole} />
        </motion.div>
      </motion.div>

      <motion.a
        href="#diensten"
        style={{ opacity: contentOpacity }}
        className="absolute bottom-16 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] text-white/80 md:bottom-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Scroll
        <span className="relative block h-14 w-px overflow-hidden bg-white/25">
          <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-white" animate={{ y: ["-100%", "200%"] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
        </span>
      </motion.a>
    </section>
  );
}
