"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

/** Simple camera body + lens illustration; scrolling slides the lens onto the mount until it "clicks". */
export default function GearAssembly() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 55%"] });
  const p = useSpring(scrollYProgress, { stiffness: 160, damping: 26 });
  const lensX = useTransform(p, [0, 0.85, 1], [150, 6, 0]);
  const lensRot = useTransform(p, [0, 0.85, 1], [-35, -8, 0]);
  const flash = useTransform(p, [0.9, 0.97, 1], [0, 1, 0]);
  const labelOpacity = useTransform(p, [0.92, 1], [0, 1]);

  return (
    <div ref={ref} className="relative mt-4 overflow-hidden rounded-2xl border border-line bg-fg/[0.03] p-4">
      <svg viewBox="0 0 400 190" className="w-full" role="img" aria-label="Camerabody met lens">
        {/* body */}
        <g>
          <rect x="40" y="58" width="170" height="104" rx="14" className="fill-fg" />
          <path d="M70 58 L82 32 H138 L150 58 Z" className="fill-fg" />
          <rect x="92" y="38" width="36" height="14" rx="3" className="fill-bg/20" fill="rgba(255,255,255,0.18)" />
          <rect x="46" y="70" width="34" height="86" rx="10" fill="rgba(255,255,255,0.08)" />
          <circle cx="178" cy="48" r="9" className="fill-fg" />
          <circle cx="178" cy="48" r="4" className="fill-accent" />
          <rect x="196" y="78" width="16" height="64" rx="4" fill="rgba(255,255,255,0.12)" />
          <circle cx="62" cy="64" r="4" className="fill-accent" />
        </g>
        {/* lens */}
        <motion.g style={reduce ? undefined : { x: lensX, rotate: lensRot, transformOrigin: "212px 110px" }}>
          <rect x="212" y="72" width="22" height="76" rx="4" className="fill-fg" />
          <rect x="234" y="66" width="92" height="88" rx="10" className="fill-fg" />
          {[250, 262, 274].map((x) => (
            <rect key={x} x={x} y="66" width="5" height="88" fill="rgba(255,255,255,0.14)" />
          ))}
          <rect x="294" y="66" width="10" height="88" className="fill-accent" />
          <rect x="326" y="60" width="24" height="100" rx="8" className="fill-fg" />
          <ellipse cx="350" cy="110" rx="8" ry="40" fill="rgba(120,160,255,0.35)" />
        </motion.g>
        {/* click flash */}
        <motion.circle cx="214" cy="110" r="46" fill="none" strokeWidth="3" className="stroke-accent" style={reduce ? { opacity: 0 } : { opacity: flash }} />
      </svg>
      <motion.p className="absolute right-4 top-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent" style={reduce ? undefined : { opacity: labelOpacity }}>
        Klik.
      </motion.p>
    </div>
  );
}
