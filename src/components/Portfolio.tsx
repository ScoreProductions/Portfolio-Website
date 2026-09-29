"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { site, youtubeThumb, type Project } from "@/lib/site";
import { Corners, PlayButton } from "./Frame";
import SectionHeader from "./SectionHeader";
import VideoModal, { type ModalContent } from "./VideoModal";

const filters = ["Alles", ...site.roles];

/** Bento rhythm per group of 6: big + 2 stacked, then 3 in a row; big flips side every other group. */
function layout(i: number) {
  const g = Math.floor(i / 6);
  const k = i % 6;
  if (k === 0) return `md:col-span-2 md:row-span-2 ${g % 2 ? "md:col-start-2" : ""}`;
  return "";
}

export function ProjectCard({
  project,
  big,
  onOpen,
  className = "",
}: {
  project: Pick<Project, "title" | "brand" | "video" | "preview" | "thumbnail"> & { functie?: string };
  big?: boolean;
  onOpen: () => void;
  className?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const thumb = project.thumbnail || youtubeThumb(project.video);

  return (
    <button
      onClick={onOpen}
      onPointerEnter={() => video.current?.play().catch(() => {})}
      onPointerLeave={() => video.current?.pause()}
      data-cursor="Play"
      aria-label={`${project.title} bekijken`}
      className={`group relative block h-full w-full overflow-hidden rounded-2xl bg-fg text-left text-white md:rounded-3xl ${className}`}
    >
      <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]">
        {thumb ? (
          <Image src={thumb} alt={project.title} fill sizes={big ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"} className="object-cover" />
        ) : (
          <div className="h-full w-full" style={{ background: "radial-gradient(90% 80% at 25% 20%, #ff2a36 0%, transparent 60%), radial-gradient(80% 80% at 100% 100%, #5a0007 0%, transparent 60%), #b3000d" }} />
        )}
        {project.preview && (
          <video ref={video} src={project.preview} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/5 transition-opacity duration-500 group-hover:opacity-80" />
      <Corners />
      <PlayButton className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${big ? "h-20 w-20 md:h-28 md:w-28" : "h-14 w-14 md:h-16 md:w-16"}`} />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        <span className="inline-block rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] md:text-[11px]">{project.brand}</span>
        <p className={`mt-3 font-semibold leading-[1.05] tracking-tight ${big ? "text-3xl md:text-5xl" : "text-xl md:text-2xl"}`}>{project.title}</p>
        {project.functie && (
          <p className="mt-1 max-h-0 overflow-hidden text-sm text-white/75 opacity-0 transition-all duration-500 group-hover:max-h-8 group-hover:opacity-100">{project.functie}</p>
        )}
      </div>
    </button>
  );
}

export function projectMeta(p: { brand: string; functie: string; description: string }) {
  return (
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
  );
}

export default function Portfolio() {
  const [filter, setFilter] = useState("Alles");
  const [modal, setModal] = useState<ModalContent | null>(null);
  const close = useCallback(() => setModal(null), []);
  const shown = filter === "Alles" ? site.projects : site.projects.filter((p) => p.roles.includes(filter));

  return (
    <section id="portfolio" className="mx-auto max-w-[1500px] px-5 py-28 md:px-10 md:py-36">
      <div className="mb-12 flex flex-col justify-between gap-8 md:mb-16 md:flex-row md:items-end">
        <SectionHeader label="Portfolio" title="Geselecteerd" accent="werk" />
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

      <motion.div layout className="grid grid-flow-dense grid-cols-1 gap-4 md:auto-rows-[clamp(190px,15.5vw,250px)] md:grid-cols-3 md:gap-5">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.div
              key={p.title}
              layout
              className={`aspect-video md:aspect-auto ${layout(i)}`}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.7, delay: (i % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard
                project={p}
                big={i % 6 === 0}
                onOpen={() => setModal({ title: p.title, video: p.video, meta: projectMeta(p) })}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <VideoModal content={modal} onClose={close} />
    </section>
  );
}
