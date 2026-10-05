"use client";

import Image from "next/image";
import { useState } from "react";
import { embedUrl, youtubeThumb } from "@/lib/site";

type Video = { title?: string; video: string; vertical: boolean };

/** One player with a thumbnail strip to click through a project's videos (instead of stacking them). */
export default function VideoSwitcher({ videos, title }: { videos: Video[]; title: string }) {
  const [i, setI] = useState(0);
  const [play, setPlay] = useState(false);
  const v = videos[i];
  const src = embedUrl(v.video, true);
  const poster = youtubeThumb(v.video);
  const go = (d: number) => setI((i + d + videos.length) % videos.length);

  return (
    <div>
      <div className="relative">
        <div className={`relative overflow-hidden rounded-3xl bg-black ${v.vertical ? "mx-auto aspect-[9/16] w-full max-w-sm" : "aspect-video w-full"}`}>
          {src && !play && (
            <button onClick={() => setPlay(true)} aria-label={`Speel ${v.title ?? title} af`} className="group absolute inset-0 h-full w-full">
              {poster && <Image src={poster} alt={v.title ?? title} fill priority sizes="(min-width: 768px) 80vw, 100vw" className="object-cover" />}
              <span className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/10" />
              <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-fg shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-white md:h-20 md:w-20">
                <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 md:h-7 md:w-7" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </button>
          )}
          {src && play && <iframe key={src} src={src} title={v.title ? `${title} — ${v.title}` : title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />}
        </div>
        {videos.length > 1 &&
          [-1, 1].map((d) => (
            <button
              key={d}
              onClick={() => go(d)}
              aria-label={d < 0 ? "Vorige video" : "Volgende video"}
              className={`absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-fg shadow-lg transition-colors duration-300 hover:bg-accent hover:text-white ${d < 0 ? "left-3 md:-left-6" : "right-3 md:-right-6"}`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d={d < 0 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
      </div>

      {videos.length > 1 && (
        <div className="mt-5">
          <p className="text-sm text-muted">
            Video {i + 1} van {videos.length}
            {v.title ? ` · ${v.title}` : ""}
          </p>
          <div className="-mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0" role="tablist" aria-label="Video's">
            {videos.map((x, k) => {
              const thumb = youtubeThumb(x.video);
              return (
                <button
                  key={x.video}
                  role="tab"
                  aria-selected={k === i}
                  onClick={() => setI(k)}
                  className={`group relative h-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 md:h-24 ${x.vertical ? "aspect-[9/16]" : "aspect-video"} ${k === i ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  {thumb && <Image src={thumb} alt={x.title ?? `Video ${k + 1}`} fill sizes="180px" className="object-cover" />}
                  <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/80 to-transparent px-2 pb-1 pt-4 text-left text-[11px] font-medium text-white">
                    {x.title ?? `Video ${k + 1}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
