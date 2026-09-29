"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { embedUrl } from "@/lib/site";
import { lockScroll } from "./SmoothScroll";

export type ModalContent = { title: string; video: string; meta?: ReactNode };

export default function VideoModal({ content, onClose }: { content: ModalContent | null; onClose: () => void }) {
  useEffect(() => {
    if (!content) return;
    lockScroll(true);
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", key);
    };
  }, [content, onClose]);

  const embed = content?.video ? embedUrl(content.video) : null;

  return (
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
            className="relative grid max-h-full w-full max-w-6xl gap-0 overflow-y-auto rounded-3xl bg-white md:grid-cols-[1.6fr_1fr]"
            initial={{ y: 60, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-fg md:aspect-auto md:min-h-[420px]">
              {embed ? (
                <iframe src={embed} title={content.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
              ) : content.video ? (
                <video src={content.video} controls autoPlay playsInline className="absolute inset-0 h-full w-full object-contain" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-accent text-white">
                  <span className="text-sm font-medium uppercase tracking-[0.25em]">Video volgt</span>
                </div>
              )}
            </div>
            <div className="flex flex-col p-6 md:p-10">
              <h3 className="text-3xl font-semibold tracking-tight md:text-5xl">{content.title}</h3>
              <div className="mt-6 flex-1">{content.meta}</div>
            </div>
            <button
              onClick={onClose}
              aria-label="Sluiten"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-fg shadow-lg transition-transform duration-300 hover:rotate-90"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
