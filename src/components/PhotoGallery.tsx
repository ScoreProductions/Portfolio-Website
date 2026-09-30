"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/** Thumbnail grid that opens photos in an in-page lightbox (arrows, swipe, Esc). */
export default function PhotoGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [start, setStart] = useState<number | null>(null);
  const go = (d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length));

  useEffect(() => {
    if (open === null) return;
    // Capture phase + stopImmediatePropagation so Esc/arrows don't also reach the video modal.
    const key = (e: KeyboardEvent) => {
      if (!["Escape", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.stopImmediatePropagation();
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  });

  return (
    <>
      <div className="mt-4 grid grid-cols-2 items-start gap-3">
        {photos.map((src, i) => (
          <button key={src} onClick={() => setOpen(i)} aria-label={`Foto ${i + 1} groot bekijken`} className="group block overflow-hidden rounded-xl" data-cursor="Bekijk">
            <Image src={src} alt={alt} width={600} height={600} sizes="(min-width: 768px) 20vw, 45vw" className="h-auto w-full transition-transform duration-700 group-hover:scale-105" />
          </button>
        ))}
      </div>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open !== null && (
              <motion.div
                className="fixed inset-0 z-[95] flex items-center justify-center bg-black/90 p-4 md:p-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="dialog"
                aria-modal="true"
                aria-label={alt}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(null);
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setStart(e.clientX);
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  if (start !== null && Math.abs(e.clientX - start) > 50) go(e.clientX < start ? 1 : -1);
                  setStart(null);
                }}
              >
                <motion.div
                  key={open}
                  className="relative h-full w-full"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image src={photos[open]} alt={alt} fill sizes="100vw" className="object-contain" />
                </motion.div>
                {photos.length > 1 &&
                  [-1, 1].map((d) => (
                    <button
                      key={d}
                      onClick={(e) => {
                        e.stopPropagation();
                        go(d);
                      }}
                      aria-label={d < 0 ? "Vorige foto" : "Volgende foto"}
                      className={`absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-fg shadow-lg transition-colors hover:bg-accent hover:text-white ${d < 0 ? "left-3 md:left-6" : "right-3 md:right-6"}`}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d={d < 0 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  ))}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(null);
                  }}
                  aria-label="Sluiten"
                  className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-fg shadow-lg transition-transform duration-300 hover:rotate-90 md:right-6 md:top-6"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
