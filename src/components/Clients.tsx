"use client";

import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useRef } from "react";
import { site } from "@/lib/site";
import SectionHeader from "./SectionHeader";

type Client = { name: string; logo: string };

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

function Logo({ c }: { c: Client }) {
  return (
    <div title={c.name} className="flex h-24 items-center px-8 transition-transform duration-500 hover:scale-110 md:h-28 md:px-12">
      {c.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={c.logo} alt={c.name} decoding="async" className="h-12 w-auto max-w-[200px] object-contain md:h-16 md:max-w-[240px]" />
      ) : (
        <span className="font-display whitespace-nowrap text-3xl leading-none text-fg md:text-4xl">{c.name}</span>
      )}
    </div>
  );
}

function Row({ items, baseVelocity }: { items: Client[]; baseVelocity: number }) {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-2000, 0, 2000], [-1.5, 0, 1.5]);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    // Cap the frame delta so a background tab or a slow frame can't make the row jump.
    let move = dir.current * baseVelocity * (Math.min(delta, 50) / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    base.set(base.get() + move);
  });

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <motion.div className="flex w-max items-center will-change-transform" style={{ x }}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {items.map((c) => (
              <Logo key={`${k}-${c.name}`} c={c} />
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
