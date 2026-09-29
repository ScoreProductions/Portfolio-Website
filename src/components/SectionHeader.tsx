"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function SectionHeader({
  label,
  title,
  accent,
  children,
  center = false,
  dark = false,
}: {
  label: string;
  title: string;
  accent?: string;
  children?: ReactNode;
  center?: boolean;
  dark?: boolean;
}) {
  if (center) {
    return (
      <div className="text-center">
        <motion.p
          className={`text-xs font-medium uppercase tracking-[0.4em] ${dark ? "text-white/70" : "text-muted"}`}
          initial={{ opacity: 0, letterSpacing: "0.8em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
        >
          {label}
        </motion.p>
        {title && (
          <h2 className="font-display mt-4 overflow-hidden text-7xl leading-[0.9] md:text-[9rem]">
            <motion.span className="block" initial={{ y: "100%" }} whileInView={{ y: "0%" }} viewport={{ once: true }} transition={{ duration: 1, ease }}>
              {title} {accent && <span className="text-accent">{accent}</span>}
            </motion.span>
          </h2>
        )}
        {children}
      </div>
    );
  }
  return (
    <div className="relative pl-5 md:pl-7">
      <motion.span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[2px] origin-top bg-accent"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease }}
      />
      <motion.p
        className="text-xs font-semibold uppercase tracking-[0.35em] text-accent"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease }}
      >
        {label}
      </motion.p>
      <h2 className="font-display mt-2 overflow-hidden text-6xl leading-[0.92] md:text-8xl">
        <motion.span className="block" initial={{ y: "100%" }} whileInView={{ y: "0%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.1, ease }}>
          {title} {accent && <span className="text-accent">{accent}</span>}
        </motion.span>
      </h2>
      {children}
    </div>
  );
}
