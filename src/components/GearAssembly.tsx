"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Front view of a mirrorless body; scrolling brings the lens in from the viewer onto the mount,
 * twists it into place and gives a small "click". Meant as a subtle background behind the set-up list.
 */
export default function GearAssembly({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref as unknown as React.RefObject<HTMLElement>, offset: ["start end", "center 50%"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 24 });
  const scale = useTransform(p, [0, 0.8, 1], [2.4, 1.04, 1]);
  const opacity = useTransform(p, [0, 0.35], [0, 1]);
  const twist = useTransform(p, [0.8, 1], [-28, 0]);
  const ring = useTransform(p, [0.92, 0.98, 1], [0, 1, 0]);

  const anim = (v: object) => (reduce ? undefined : v);

  return (
    <svg ref={ref} viewBox="0 0 320 220" className={className} aria-hidden>
      {/* body, front view */}
      <path d="M40 60 H112 L124 38 H196 L208 60 H280 a18 18 0 0 1 18 18 V176 a18 18 0 0 1 -18 18 H40 a18 18 0 0 1 -18 -18 V78 a18 18 0 0 1 18 -18 Z" className="fill-fg" />
      <rect x="22" y="72" width="44" height="122" rx="18" className="fill-fg" opacity="0.85" />
      <rect x="136" y="44" width="48" height="12" rx="3" fill="white" opacity="0.12" />
      <circle cx="252" cy="48" r="10" className="fill-fg" />
      <circle cx="74" cy="84" r="4" className="fill-accent" />
      {/* lens mount */}
      <circle cx="170" cy="126" r="58" fill="white" opacity="0.1" />
      <circle cx="170" cy="126" r="50" className="fill-bg" opacity="0.15" />
      {/* lens, coming towards the mount */}
      <motion.g style={anim({ scale, opacity, rotate: twist, transformOrigin: "170px 126px" })}>
        <circle cx="170" cy="126" r="56" className="fill-fg" />
        {Array.from({ length: 24 }, (_, i) => (
          <rect key={i} x="168" y="72" width="4" height="9" rx="1" fill="white" opacity="0.18" transform={`rotate(${i * 15} 170 126)`} />
        ))}
        <circle cx="170" cy="126" r="44" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="2" />
        <circle cx="170" cy="126" r="40" className="stroke-accent" fill="none" strokeWidth="2.5" />
        <circle cx="170" cy="126" r="32" fill="#0b1630" />
        <circle cx="170" cy="126" r="22" fill="#1d3a7a" opacity="0.8" />
        <ellipse cx="160" cy="114" rx="9" ry="6" fill="white" opacity="0.35" transform="rotate(-30 160 114)" />
      </motion.g>
      <motion.circle cx="170" cy="126" r="66" fill="none" strokeWidth="3" className="stroke-accent" style={reduce ? { opacity: 0 } : { opacity: ring }} />
    </svg>
  );
}
