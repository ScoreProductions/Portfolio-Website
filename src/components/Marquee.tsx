"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

export default function Marquee({ items, baseVelocity = -3 }: { items: string[]; baseVelocity?: number }) {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(base, (v) => `${wrap(-25, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    base.set(base.get() + move);
  });

  const row = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-line py-6 md:py-8">
      <motion.div className="flex w-max whitespace-nowrap" style={{ x }}>
        {[0, 1, 2, 3].map((k) => (
          <div key={k} className="flex shrink-0">
            {row.map((item, i) => (
              <span key={`${k}-${i}`} className="flex items-center text-5xl font-semibold uppercase tracking-tighter md:text-8xl">
                <span className={i % 2 ? "outline-text" : ""}>{item}</span>
                <span className="mx-6 inline-block text-accent md:mx-10">✦</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
