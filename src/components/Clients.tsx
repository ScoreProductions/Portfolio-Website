"use client";

import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useRef } from "react";
import { site } from "@/lib/site";
import SectionHeader from "./SectionHeader";

type Client = { name: string; logo: string; ratio?: number; raw?: boolean };

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

function Logo({ c }: { c: Client }) {
  if (!c.logo) {
    return <span className="font-display whitespace-nowrap text-4xl leading-none text-fg/55 transition-colors duration-300 group-hover:text-accent md:text-5xl">{c.name}</span>;
  }
  if (c.raw) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={c.logo} alt={c.name} className="h-12 w-auto object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 md:h-16" loading="lazy" />;
  }
  const ratio = c.ratio ?? 2.5;
  return (
    <span
      role="img"
      aria-label={c.name}
      className="block h-10 bg-fg/55 transition-colors duration-300 group-hover:bg-accent md:h-14"
      style={{
        aspectRatio: String(Math.min(Math.max(ratio, 0.8), 5)),
        maskImage: `url("${c.logo}")`,
        WebkitMaskImage: `url("${c.logo}")`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
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
              <div key={`${k}-${c.name}`} className="group flex h-24 items-center px-8 md:h-28 md:px-14" title={c.name}>
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
