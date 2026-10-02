"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import PhotoGallery from "./PhotoGallery";
import { createPortal } from "react-dom";
import { embedUrl } from "@/lib/site";
import { lockScroll } from "./SmoothScroll";

export type ModalContent = {
  title: string;
  video: string;
  meta?: ReactNode;
  /** Behind-the-scenes photos, shown as a small strip under the video and info. */
  photos?: string[];
  vertical?: boolean;
  /** Present when the project has several videos to step through. */
  nav?: { index: number; count: number; go: (d: number) => void };
  /** Present when the modal can step to the previous/next project in the grid. */
  projectNav?: { prev: string; next: string; go: (d: number) => void };
};

export default function VideoModal({ content, onClose }: { content: ModalContent | null; onClose: () => void }) {
  const isOpen = !!content;
  const nav = content?.nav;
  const photos = content?.photos?.length ? content.photos : undefined;
  const projectNav = content?.projectNav;
  // Arrow keys and swipes step through a project's videos when it has several, otherwise through projects.
  const step = (d: number) => (nav ?? projectNav)?.go(d);
  const navRef = useRef(step);
  const swipeStart = useRef<number | null>(null);

  useEffect(() => {
    navRef.current = step;
  });

  useEffect(() => {
    if (!isOpen) return;
    lockScroll(true);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") navRef.current(-1);
      if (e.key === "ArrowRight") navRef.current(1);
    };
    window.addEventListener("keydown", key);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", key);
    };
  }, [isOpen, onClose]);

  const embed = content?.video ? embedUrl(content.video) : null;

  if (typeof document === "undefined") return null;

  // Portal to <body> so the modal sits above the fixed nav instead of inside the page's stacking context.
  return createPortal(
    <AnimatePresence>
      {content && (
        <motion.div
          className="fixed inset-0 z-[85] flex items-center justify-center bg-fg/80 p-3 backdrop-blur-md md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={content.title}
          data-lenis-prevent
        >
          <motion.div
            className={`relative flex w-full ${projectNav ? "max-h-[calc(100%-4.5rem)] xl:max-h-full" : "max-h-full"} ${content.vertical ? "max-w-5xl xl:max-w-4xl" : "max-w-6xl xl:max-w-5xl"}`}
            initial={{ y: 60, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => (swipeStart.current = e.clientX)}
            onPointerUp={(e) => {
              if (swipeStart.current === null) return;
              const dx = e.clientX - swipeStart.current;
              swipeStart.current = null;
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            }}
          >
            {/* Only this inner panel scrolls, so the close button below stays in place. */}
            <div className={`grid max-h-full w-full gap-0 overflow-y-auto rounded-3xl bg-white ${content.vertical ? "md:grid-cols-[auto_1fr]" : "md:grid-cols-[1.6fr_1fr]"}`}>
                        <div className="flex min-w-0 flex-col">
<div className={`relative bg-fg ${content.vertical ? "mx-auto aspect-[9/16] h-[70vh] md:h-[85vh] md:max-h-[860px]" : "aspect-video md:aspect-auto md:min-h-[420px] md:flex-1"}`}>
              {embed ? (
                <iframe key={embed} src={embed} title={content.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
              ) : content.video ? (
                <video key={content.video} src={content.video} controls autoPlay playsInline className="absolute inset-0 h-full w-full object-contain" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-accent text-white">
                  <span className="text-sm font-medium uppercase tracking-[0.25em]">Video volgt</span>
                </div>
              )}
            </div>
            </div>
            <div className="flex flex-col p-6 md:p-10">
              {nav && (
                <div className="mb-6 flex items-center gap-3 pr-12">
                  {[-1, 1].map((d) => (
                    <button
                      key={d}
                      onClick={() => nav.go(d)}
                      aria-label={d < 0 ? "Vorige video" : "Volgende video"}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-white"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d={d < 0 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  ))}
                  <span className="text-sm font-medium text-muted">
                    Video {nav.index + 1} van {nav.count}
                  </span>
                </div>
              )}
              <h3 className="pr-12 text-2xl font-semibold leading-tight tracking-tight md:text-[2rem]">
                {content.title.split(/:\s+/).map((part, i, all) => (
                  <span key={i} className={i ? "block text-[0.7em] font-medium text-muted" : "block"}>
                    {part}
                    {i < all.length - 1 ? ":" : ""}
                  </span>
                ))}
              </h3>
              <div className="mt-6 flex-1">{content.meta}</div>
            </div>
            {photos && (
              <PhotoGallery
                photos={photos}
                alt="Behind the scenes"
                renderGrid={(open) => (
                  // Small thumbnail strip under the normal video + info layout.
                  <div className="border-t border-line px-6 py-5 md:col-span-2 md:px-10">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Behind the scenes</p>
                    <div className="-mx-6 mt-3 flex gap-3 overflow-x-auto px-6 pb-1 md:-mx-10 md:px-10">
                      {photos.map((src, i) => (
                        <button
                          key={src}
                          onClick={() => open(i)}
                          aria-label={`Foto ${i + 1} groot bekijken`}
                          className="group relative aspect-[4/3] h-20 shrink-0 overflow-hidden rounded-lg bg-line md:h-24"
                        >
                          <Image src={src} alt="Behind the scenes" fill sizes="160px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              />
            )}
            </div>
            {projectNav &&
              [-1, 1].map((d) => (
                <button
                  key={d}
                  onClick={() => projectNav.go(d)}
                  aria-label={d < 0 ? `Vorig project: ${projectNav.prev}` : `Volgend project: ${projectNav.next}`}
                  className={`group absolute top-1/2 hidden w-28 -translate-y-1/2 flex-col items-center gap-3 text-center text-white xl:flex ${d < 0 ? "-left-36" : "-right-36"}`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-fg shadow-lg transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d={d < 0 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">{d < 0 ? "Vorig project" : "Volgend project"}</span>
                  <span className="line-clamp-2 text-sm font-semibold leading-tight">{d < 0 ? projectNav.prev : projectNav.next}</span>
                </button>
              ))}
            <button
              onClick={onClose}
              aria-label="Sluiten"
              className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-fg shadow-lg transition-transform duration-300 hover:rotate-90"
            >
              ×
            </button>
          </motion.div>
          {projectNav && (
            <div className="absolute inset-x-3 bottom-3 flex justify-between gap-3 xl:hidden" onClick={(e) => e.stopPropagation()}>
              {[-1, 1].map((d) => (
                <button
                  key={d}
                  onClick={() => projectNav.go(d)}
                  aria-label={d < 0 ? `Vorig project: ${projectNav.prev}` : `Volgend project: ${projectNav.next}`}
                  className={`flex min-w-0 max-w-[48%] items-center gap-2 rounded-full bg-white py-2 text-sm font-semibold text-fg shadow-lg ${d < 0 ? "pl-2 pr-4" : "ml-auto flex-row-reverse pl-4 pr-2"}`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d={d < 0 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="truncate">{d < 0 ? projectNav.prev : projectNav.next}</span>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
