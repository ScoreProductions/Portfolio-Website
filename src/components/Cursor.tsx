"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement).closest<HTMLElement>(
        "a, button, [data-cursor]"
      );
      setHover(!!el);
      setLabel(el?.dataset.cursor ?? "");
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="cursor-dot pointer-events-none fixed left-0 top-0 z-[70] hidden items-center justify-center rounded-full bg-fg text-[11px] font-medium uppercase tracking-widest text-bg mix-blend-difference md:flex"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: label ? 96 : hover ? 56 : 12,
        height: label ? 96 : hover ? 56 : 12,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {label && <span className="mix-blend-normal">{label}</span>}
    </motion.div>
  );
}
