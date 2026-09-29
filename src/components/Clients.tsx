"use client";

import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useRef } from "react";
import { site } from "@/lib/site";

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

function Row({ items, baseVelocity }: { items: string[]; baseVelocity: number }) {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    base.set(base.get() + move);
  });

  return (
    <div className="overflow-hidden">
      <motion.div className="flex w-max whitespace-nowrap" style={{ x }}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0" aria-hidden={k === 1}>
            {items.map((name, i) => (
              <span key={`${k}-${i}`} className="flex items-center text-5xl font-semibold uppercase tracking-[-0.04em] md:text-8xl">
                <span className={i % 3 === 1 ? "text-white/45" : i % 3 === 2 ? "font-serif font-normal normal-case italic" : ""}>{name}</span>
                <span className="mx-6 inline-block h-3 w-3 rounded-full bg-white md:mx-10 md:h-4 md:w-4" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Clients() {
  const names = site.clients.names;
  const half = Math.ceil(names.length / 2);
  return (
    <section aria-label={site.clients.title} className="overflow-hidden bg-accent py-20 text-white md:py-28">
      <p className="mb-10 px-5 text-sm font-medium uppercase tracking-[0.25em] text-white/70 md:mb-14 md:px-10">({site.clients.title})</p>
      <div className="space-y-4 md:space-y-6">
        <Row items={names.slice(0, half)} baseVelocity={-2.5} />
        <Row items={names.slice(half)} baseVelocity={2.5} />
      </div>
      <ul className="sr-only">
        {names.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </section>
  );
}
