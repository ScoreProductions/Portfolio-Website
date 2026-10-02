"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Counts up from 0 to the number in `value` (e.g. "25+") once it scrolls into view. */
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [, prefix = "", num = "", suffix = ""] = value.match(/^(\D*)(\d+)(.*)$/) ?? [];
  const target = Number(num);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || !num || reduce) return;
    const controls = animate(0, target, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, num, reduce, target]);

  if (!num) return <span>{value}</span>;
  return (
    <span ref={ref} aria-label={value}>
      {prefix}
      {reduce ? target : n}
      {suffix}
    </span>
  );
}
