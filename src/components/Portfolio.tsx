"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState, type ReactNode } from "react";
import { brandLogo, clientLogo, isVertical, projectVariant, site, slugify, youtubePreviewUrl, youtubeThumb, type Project } from "@/lib/site";
import { Corners, PlayButton } from "./Frame";
import SectionHeader from "./SectionHeader";
import VideoModal, { type ModalContent } from "./VideoModal";

const filters = ["Alles", "TV", ...site.roles, "Fotografie"];
const sorts = ["Aanbevolen", "Meest recent"] as const;
// Position of each project in the "most recent first" order (unknown projects go last).
const recentRank = new Map(site.recent.map((t, i) => [t, i]));
const VISIBLE = 6;

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
  wide,
  onOpen,
  className = "",
}: {
  project: Pick<Project, "title" | "brand" | "video" | "preview" | "thumbnail" | "jaar" | "vertical" | "previewStart"> & { functie?: string; subtitle?: string };
  big?: boolean;
  wide?: boolean;
  onOpen: () => void;
  className?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const thumb = project.thumbnail || youtubeThumb(project.video);
  const vertical = isVertical(project);
  // Without an own preview clip, hovering plays a muted loop straight from the YouTube video.
  const ytPreview = !project.preview && project.video ? youtubePreviewUrl(project.video, project.previewStart ?? (vertical ? 1 : 15)) : null;
  const [hover, setHover] = useState(false);
  const [ready, setReady] = useState(false);

  return (
    <button
      onClick={onOpen}
      onPointerEnter={(e) => {
        video.current?.play().catch(() => {});
        if (e.pointerType === "mouse") setHover(true);
      }}
      onPointerLeave={() => {
        video.current?.pause();
        setHover(false);
        setReady(false);
      }}
      data-cursor={project.video ? "Play" : "Bekijk"}
      aria-label={`${project.title} bekijken`}
      className={`group relative block h-full w-full overflow-hidden rounded-2xl bg-fg text-left text-white md:rounded-3xl ${className}`}
    >
      <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]">
        {thumb ? (
          <Image src={thumb} alt={project.title} fill sizes={big ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"} className="object-cover" />
        ) : (
          <div className="h-full w-full" style={{ background: "radial-gradient(90% 80% at 25% 20%, #ff2a36 0%, transparent 60%), radial-gradient(80% 80% at 100% 100%, #5a0007 0%, transparent 60%), #b3000d" }} />
        )}
        {project.preview && (
          <video ref={video} src={project.preview} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        )}
        {ytPreview && hover && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden [container-type:size]">
            <iframe
              src={ytPreview}
              title=""
              tabIndex={-1}
              aria-hidden
              allow="autoplay; encrypted-media"
              onLoad={() => setTimeout(() => setReady(true), 700)}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
              style={vertical ? { width: "max(100cqw, 56.25cqh)", height: "max(100cqh, 177.78cqw)" } : { width: "max(100cqw, 177.78cqh)", height: "max(100cqh, 56.25cqw)" }}
            />
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/5 transition-opacity duration-500 group-hover:opacity-80" />
      <Corners />
      {project.video && <PlayButton className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${big ? "h-16 w-16 md:h-28 md:w-28" : "h-10 w-10 md:h-16 md:w-16"}`} />}
      <div className={`absolute inset-x-0 bottom-0 ${big || wide ? "p-5" : "p-3 sm:p-5"} md:p-7`}>
        <span className="inline-block max-w-full truncate rounded-full bg-accent px-2.5 py-1 align-bottom text-[9px] font-semibold uppercase tracking-[0.12em] sm:px-3 sm:text-[10px] md:text-[11px]">{project.brand}</span>
        <p className={`mt-2 font-semibold leading-[1.05] sm:mt-3 tracking-tight ${big ? "text-2xl sm:text-3xl md:text-5xl" : "text-base sm:text-xl md:text-2xl"}`}>{project.title}</p>
        {project.subtitle && <p className="mt-1 text-sm font-medium text-white/85">{project.subtitle}</p>}
        {project.functie && (
          <p className="mt-1 max-h-0 overflow-hidden text-sm text-white/75 opacity-0 transition-all duration-500 group-hover:max-h-8 group-hover:opacity-100">{[project.functie, project.jaar].filter(Boolean).join(" · ")}</p>
        )}
      </div>
    </button>
  );
}

/** Card for a project; when it has several items, arrows/swipe switch the video, info and modal content. */
function ProjectTile({
  project,
  big,
  wide,
  n,
  setN,
  onOpen,
}: {
  project: Project;
  big: boolean;
  wide: boolean;
  n: number;
  setN: (n: number) => void;
  onOpen: () => void;
}) {
  const count = project.items?.length ?? 0;
  const start = useRef<number | null>(null);
  const swiped = useRef(false);
  const current = projectVariant(project, n);

  const go = (d: number) => setN((n + d + count) % count);

  if (count < 2) return <ProjectCard project={current} big={big} wide={wide} onOpen={onOpen} />;

  return (
    <div
      className="relative h-full w-full touch-pan-y"
      onPointerDown={(e) => {
        start.current = e.clientX;
        swiped.current = false;
      }}
      onPointerUp={(e) => {
        if (start.current === null) return;
        const dx = e.clientX - start.current;
        start.current = null;
        if (Math.abs(dx) > 40) {
          swiped.current = true;
          go(dx < 0 ? 1 : -1);
        }
      }}
      onClickCapture={(e) => {
        if (swiped.current) {
          e.stopPropagation();
          e.preventDefault();
          swiped.current = false;
        }
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={n}
          className="h-full w-full"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProjectCard project={current} big={big} wide={wide} onOpen={onOpen} />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-3 right-3 z-10 flex gap-2 md:bottom-6 md:right-6">
        {[-1, 1].map((d) => (
          <button
            key={d}
            onClick={() => go(d)}
            aria-label={d < 0 ? "Vorige video" : "Volgende video"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-fg shadow-lg transition-colors duration-300 hover:bg-accent hover:text-white md:h-11 md:w-11"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d={d < 0 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>
      <div className="pointer-events-none absolute left-1/2 top-3 z-10 flex -translate-x-1/2 gap-1.5 md:top-5">
        {project.items!.map((_, k) => (
          <span key={k} className={`h-1.5 rounded-full transition-all duration-300 ${k === n ? "w-5 bg-white" : "w-1.5 bg-white/50"}`} />
        ))}
      </div>
    </div>
  );
}

function modalContent(p: Project, n: number, setN: (n: number) => void): ModalContent {
  const v = projectVariant(p, n);
  // Photography-only projects show their photos in the main panel and step through them like videos.
  const photoProject = !v.video && v.roles.includes("Fotografie");
  const gallery = photoProject ? (v.photos ?? []) : [];
  const count = gallery.length || (p.items?.length ?? 0);
  return {
    title: v.subtitle ? `${v.title} · ${v.subtitle}` : v.title,
    video: v.video,
    vertical: isVertical(v),
    meta: (
      <>
        {projectMeta({ ...v, photos: undefined })}
        <Link href={`/projecten/${slugify(p.title)}`} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent underline-offset-4 hover:underline">
          Bekijk projectpagina →
        </Link>
      </>
    ),
    nav: count > 1 ? { index: n, count, go: (d) => setN((n + d + count) % count) } : undefined,
    photos: photoProject ? undefined : v.photos,
    gallery: gallery.length ? gallery[n % gallery.length] : undefined,
    navLabel: gallery.length ? "Foto" : "Video",
    photoProject,
  };
}

/** Logo image when available, otherwise the plain name. */
export function LogoOrName({ name, logo }: { name: string; logo?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return logo ? <img src={logo} alt={name} title={name} className="mt-1 h-9 w-auto max-w-[180px] object-contain md:h-11" /> : <>{name}</>;
}

export function projectMeta(p: Pick<Project, "brand" | "functie" | "description" | "tv" | "jaar" | "timeline" | "kijk" | "via" | "photos" | "credits" | "logo">) {
  const rows: [string, ReactNode][] = [
    [p.tv ? "Zender" : "Merk", <LogoOrName key="b" name={p.brand} logo={brandLogo(p)} />],
    ...(p.via ? ([["Via", <LogoOrName key="v" name={p.via} logo={clientLogo(p.via)} />]] as [string, ReactNode][]) : []),
    [
      "Functie",
      p.credits?.length ? (
        <ul className="space-y-1">
          {p.credits.map((c) => (
            <li key={c.name}>
              <span className="font-semibold">{c.name}</span> <span className="text-muted">— {c.role}</span>
            </li>
          ))}
        </ul>
      ) : (
        p.functie
      ),
    ],
    ...(p.jaar ? ([[p.tv ? "Gewerkt aan" : "Jaar", p.jaar]] as [string, ReactNode][]) : []),
  ];
  return (
    <dl className="space-y-5">
      {rows.map(([k, v]) => (
        <div key={k} className="border-b border-line pb-4">
          <dt className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{k}</dt>
          <dd className="mt-1 text-lg">{v}</dd>
        </div>
      ))}
      <div>
        <dt className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Beschrijving</dt>
        <dd className="mt-2 space-y-4 leading-relaxed">
          {p.description.split(/\n\n+/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </dd>
      </div>
      {p.kijk && (
        <div className="border-b border-line pb-4">
          <dt className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Te zien op</dt>
          <dd className="mt-1 text-lg">
            <a href={p.kijk.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline-offset-4 hover:underline">
              {p.kijk.label} ↗
            </a>
          </dd>
        </div>
      )}
      {!!p.timeline?.length && (
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Mijn seizoenen</dt>
          <dd>
            <ol className="mt-4 space-y-3 border-l-2 border-line pl-5">
              {p.timeline.map((t) => (
                <li key={t.label} className="relative">
                  <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-white" />
                  <p className="font-semibold">{t.label}</p>
                  <p className="text-sm text-muted">{t.date}</p>
                </li>
              ))}
            </ol>
          </dd>
        </div>
      )}
    </dl>
  );
}

/** Homepage teaser (first tiles + link to /projecten) or, with `full`, the complete filterable grid. */
export default function Portfolio({ full = false }: { full?: boolean }) {
  const [filter, setFilter] = useState("Alles");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Aanbevolen");
  const [sortOpen, setSortOpen] = useState(false);
  const [open, setOpen] = useState<Project | null>(null);
  const [variants, setVariants] = useState<Record<string, number>>({});
  const close = useCallback(() => setOpen(null), []);
  const variantOf = (p: Project) => variants[p.title] ?? 0;
  const setVariant = (p: Project, n: number) => setVariants((v) => ({ ...v, [p.title]: n }));
  const ordered =
    sort === "Meest recent" ? [...site.projects].sort((a, b) => (recentRank.get(a.title) ?? 999) - (recentRank.get(b.title) ?? 999)) : site.projects;
  const shown = filter === "Alles" ? ordered : filter === "TV" ? ordered.filter((p) => p.tv) : ordered.filter((p) => p.roles.includes(filter));
  // Prev/next in the modal walks through the projects currently visible under the active filter.
  const modal: ModalContent | null = open
    ? (() => {
        const i = shown.indexOf(open);
        const at = (d: number) => shown[(i + d + shown.length) % shown.length];
        return {
          ...modalContent(open, variantOf(open), (n) => setVariant(open, n)),
          projectNav: i >= 0 && shown.length > 1 ? { prev: at(-1).title, next: at(1).title, go: (d: number) => setOpen(at(d)) } : undefined,
        };
      })()
    : null;
  // On the homepage "Alles" shows a teaser; a role filter (or the projects page) shows every match.
  const limit = full || filter !== "Alles" ? shown.length : VISIBLE;
  const first = shown.slice(0, limit);
  const more = site.projects.length - first.length;

  const renderGrid = (items: Project[], offset: number) => (
    <motion.div layout className="grid grid-flow-dense grid-cols-2 gap-3 md:auto-rows-[clamp(190px,15.5vw,250px)] md:grid-cols-3 md:gap-5">
      <AnimatePresence mode="popLayout">
        {items.map((p, j) => {
          const i = j + offset;
          return (
            <motion.div
              key={p.title}
              layout
              className={
                isVertical(p)
                  ? "aspect-[9/16] md:row-span-3 md:aspect-auto"
                  : `${i % 6 === 0 ? "col-span-2 aspect-video" : i % 6 === 5 ? "col-span-2 aspect-video md:col-span-1" : "aspect-[4/5] sm:aspect-video"} md:aspect-auto ${layout(i)}`
              }
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.7, delay: (j % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectTile
                project={p}
                big={!isVertical(p) && i % 6 === 0}
                wide={!isVertical(p) && i % 6 === 5}
                n={variantOf(p)}
                setN={(n) => setVariant(p, n)}
                onOpen={() => setOpen(p)}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <section id="portfolio" className={`mx-auto max-w-[1500px] px-5 md:px-10 ${full ? "pb-28 md:pb-36" : "py-28 md:py-36"}`}>
      <div className="mb-12 flex flex-col justify-between gap-8 md:mb-16 md:flex-row md:items-end">
        {full ? <p className="text-sm text-muted">{shown.length} {shown.length === 1 ? "project" : "projecten"}</p> : <SectionHeader label="Portfolio" title="Geselecteerd" accent="werk" />}
        <div className="flex flex-col items-start gap-3 md:items-end">
        <div className="relative">
          <button
            onClick={() => setSortOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={sortOpen}
            className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:border-fg"
          >
            <span className="text-muted">Sorteer:</span> {sort}
            <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${sortOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <AnimatePresence>
            {sortOpen && (
              <motion.ul
                role="listbox"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-full z-20 mt-2 min-w-full overflow-hidden rounded-2xl border border-line bg-white py-1 shadow-xl md:left-auto md:right-0"
              >
                {sorts.map((s) => (
                  <li key={s}>
                    <button
                      role="option"
                      aria-selected={sort === s}
                      onClick={() => {
                        setSort(s);
                        setSortOpen(false);
                      }}
                      className={`block w-full whitespace-nowrap px-5 py-2.5 text-left text-sm transition-colors hover:bg-accent hover:text-white ${sort === s ? "font-semibold text-accent" : ""}`}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
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
      </div>

      {renderGrid(first, 0)}

      {!full && more > 0 && filter === "Alles" && (
        <div className="mt-12 flex justify-center md:mt-16">
          <Link
            href="/projecten"
            className="group relative flex items-center gap-4 overflow-hidden rounded-full border border-fg/15 py-3 pl-7 pr-3 font-semibold transition-colors duration-500 hover:border-accent hover:text-white"
          >
            <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
            <span className="relative">Bekijk alle projecten</span>
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition-colors duration-500 group-hover:bg-white group-hover:text-accent">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="relative -ml-1 mr-1 text-sm font-medium text-muted transition-colors group-hover:text-white/80">+{more}</span>
          </Link>
        </div>
      )}

      <VideoModal content={modal} onClose={close} />
    </section>
  );
}
