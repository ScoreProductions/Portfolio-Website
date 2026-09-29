"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { site, youtubeThumb, type Project } from "@/lib/site";
import { SplitLine } from "./Reveal";
import VideoModal, { type ModalContent } from "./VideoModal";

const filters = ["Alles", ...site.roles];

const span: Record<string, string> = {
  large: "col-span-2 row-span-2",
  wide: "col-span-2",
  tall: "row-span-2",
  normal: "",
};

const tints = ["#e10a17", "#b0000c", "#ff2d38", "#7a0008"];

function Tile({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const thumb = project.thumbnail || youtubeThumb(project.video);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onClick={onOpen}
      onPointerEnter={() => video.current?.play().catch(() => {})}
      onPointerLeave={() => video.current?.pause()}
      data-cursor="Bekijk"
      aria-label={`${project.title} bekijken`}
      className={`group relative overflow-hidden rounded-2xl text-left text-white md:rounded-3xl ${span[project.size] ?? ""}`}
      style={{ backgroundColor: tints[index % tints.length] }}
    >
      <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110">
        {thumb ? (
          <Image src={thumb} alt={project.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(80%_80%_at_20%_15%,rgba(255,255,255,0.22),transparent_60%)]">
            <span className="px-4 text-center text-3xl font-semibold uppercase leading-none tracking-tighter text-white/25 md:text-5xl">
              {project.title}
            </span>
          </div>
        )}
        {project.preview && (
          <video ref={video} src={project.preview} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-80 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100" />

      <span className="absolute right-3 top-3 flex h-10 w-10 scale-75 items-center justify-center rounded-full bg-white text-accent opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 md:right-4 md:top-4 md:h-12 md:w-12">
        <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
      </span>

      <div className="absolute inset-x-0 bottom-0 p-4 md:translate-y-4 md:p-6 md:opacity-0 md:transition-all md:duration-500 md:group-hover:translate-y-0 md:group-hover:opacity-100">
        <p className="text-lg font-semibold leading-tight tracking-tight md:text-2xl">{project.title}</p>
        <p className="mt-1 text-xs text-white/75 md:text-sm">
          {project.brand} · {project.functie}
        </p>
      </div>
    </motion.button>
  );
}

export default function Portfolio() {
  const [filter, setFilter] = useState("Alles");
  const [modal, setModal] = useState<ModalContent | null>(null);
  const close = useCallback(() => setModal(null), []);
  const shown = filter === "Alles" ? site.projects : site.projects.filter((p) => p.roles.includes(filter));

  const open = (p: Project) =>
    setModal({
      title: p.title,
      video: p.video,
      meta: (
        <dl className="space-y-5">
          {[
            ["Merk", p.brand],
            ["Functie", p.functie],
          ].map(([k, v]) => (
            <div key={k} className="border-b border-line pb-4">
              <dt className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{k}</dt>
              <dd className="mt-1 text-lg">{v}</dd>
            </div>
          ))}
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Beschrijving</dt>
            <dd className="mt-2 leading-relaxed">{p.description}</dd>
          </div>
        </dl>
      ),
    });

  return (
    <section id="portfolio" className="px-5 py-28 md:px-10 md:py-40">
      <div className="mb-12 flex flex-col justify-between gap-8 md:mb-16 md:flex-row md:items-end">
        <h2 className="text-[17vw] font-semibold uppercase leading-[0.82] tracking-[-0.055em] md:text-[10vw]">
          <SplitLine text="Portfolio" />
        </h2>
        <LayoutGroup>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projecten">
            {filters.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`relative rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
                  filter === f ? "border-accent text-white" : "border-line hover:border-fg"
                }`}
              >
                {filter === f && (
                  <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                <span className="relative">{f}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      <motion.div layout className="grid grid-flow-dense auto-rows-[170px] grid-cols-2 gap-3 sm:auto-rows-[220px] md:auto-rows-[240px] md:grid-cols-4 md:gap-4">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <Tile key={p.title} project={p} index={site.projects.indexOf(p)} onOpen={() => open(p)} />
          ))}
        </AnimatePresence>
      </motion.div>

      <VideoModal content={modal} onClose={close} />
    </section>
  );
}
