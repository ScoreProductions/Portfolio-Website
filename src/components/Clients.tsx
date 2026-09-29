"use client";

import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useRef } from "react";
import { site } from "@/lib/site";
import SectionHeader from "./SectionHeader";

type Client = { name: string; logo: string; dark?: boolean };

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

function Logo({ c }: { c: Client }) {
  return (
    <div
      title={c.name}
      className={`flex h-24 w-44 shrink-0 items-center justify-center rounded-2xl px-6 py-5 ring-1 transition-all duration-500 hover:-translate-y-1 hover:ring-2 hover:ring-accent md:h-28 md:w-56 md:px-8 ${
        c.dark ? "bg-fg ring-fg" : "bg-[#f4f4f4] ring-line"
      }`}
    >
      {c.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={c.logo} alt={c.name} loading="lazy" className="max-h-full max-w-full object-contain" />
      ) : (
        <span className={`font-display text-3xl leading-none ${c.dark ? "text-white" : "text-fg"}`}>{c.name}</span>
      )}
    </div>
  );
}

function Row({ items, baseVelocity }: { items: Client[]; baseVelocity: number }) {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 3], { clamp: false });
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
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <motion.div className="flex w-max items-center" style={{ x }}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {items.map((c) => (
              <div key={`${k}-${c.name}`} className="px-2 py-2 md:px-3">
                <Logo c={c} />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Clients() {
  const items = site.clients.items as Client[];
  const half = Math.ceil(items.length / 2);
  return (
    <section aria-label={site.clients.title} className="border-y border-line py-20 md:py-28">
      <SectionHeader center label={site.clients.title} title="" />
      <div className="mt-10 space-y-2 md:mt-14">
        <Row items={items.slice(0, half)} baseVelocity={-2} />
        <Row items={items.slice(half)} baseVelocity={2} />
      </div>
      <ul className="sr-only">
        {items.map((c) => (
          <li key={c.name}>{c.name}</li>
        ))}
      </ul>
    </section>
  );
}
