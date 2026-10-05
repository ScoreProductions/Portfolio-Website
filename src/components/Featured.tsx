"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { site } from "@/lib/site";
import { ProjectCard } from "./Portfolio";
import SectionHeader from "./SectionHeader";
import VideoModal, { type ModalContent } from "./VideoModal";

export default function Featured() {
  const f = site.featured;
  const ref = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState<ModalContent | null>(null);
  const close = useCallback(() => setModal(null), []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [80, 24]);

  if (!f?.title) return null;

  return (
    <section className="mx-auto max-w-[1500px] px-5 pb-16 md:px-10 md:pb-36">
      <SectionHeader label={f.label} title={f.title}>
        <p className="mt-4 max-w-2xl text-lg text-muted">{f.text}</p>
      </SectionHeader>
      <motion.div ref={ref} style={{ scale, borderRadius: radius }} className="mx-auto mt-12 aspect-[4/5] max-w-6xl overflow-hidden md:mt-16 md:aspect-video">
        <ProjectCard
          big
          className="!rounded-none"
          project={{ title: f.title, brand: f.tag, video: f.video, preview: "", thumbnail: f.thumbnail }}
          onOpen={() => setModal({ title: f.title, video: f.video, meta: <p className="leading-relaxed text-muted">{f.text}</p> })}
        />
      </motion.div>
      <VideoModal content={modal} onClose={close} />
    </section>
  );
}
