"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { site, type Project } from "@/lib/site";
import ProjectVisual from "./ProjectVisual";
import { Reveal, SplitLine } from "./Reveal";

function Card({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const offset = index % 2 === 1;

  return (
    <Reveal className={offset ? "md:mt-40" : ""}>
      <Link ref={ref} href={`/work/${project.slug}`} data-cursor="Bekijk" className="group block">
        <motion.div
          className="relative aspect-[4/5] overflow-hidden rounded-2xl"
          initial={{ clipPath: "inset(15% 10% 15% 10% round 16px)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 16px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div style={{ y }} className="absolute -inset-[12%] transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105">
            <ProjectVisual project={project} />
          </motion.div>
          <div className="absolute left-4 top-4 rounded-full bg-bg/60 px-3 py-1 text-xs uppercase tracking-widest backdrop-blur">
            {project.category}
          </div>
        </motion.div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight md:text-4xl">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                {project.title}
              </span>
            </h3>
            <p className="mt-1 text-muted">{project.client}</p>
          </div>
          <span className="text-sm tabular-nums text-muted">{project.year}</span>
        </div>
      </Link>
    </Reveal>
  );
}

export default function Work() {
  return (
    <section id="work" className="px-5 py-28 md:px-10 md:py-44">
      <div className="mb-16 flex items-end justify-between gap-6 md:mb-24">
        <h2 className="text-[14vw] font-semibold uppercase leading-[0.85] tracking-[-0.05em] md:text-[9vw]">
          <SplitLine text="Selected" />
          <SplitLine text="Work" delay={0.1} className="font-serif font-normal normal-case italic text-accent" />
        </h2>
        <span className="text-sm tabular-nums text-muted">({String(site.projects.length).padStart(2, "0")})</span>
      </div>
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-x-10 md:gap-y-24">
        {site.projects.map((p, i) => (
          <Card key={p.slug} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
