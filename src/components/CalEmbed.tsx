"use client";

import { useEffect, type MouseEvent } from "react";

type CalFn = ((...args: unknown[]) => void) & { q?: unknown[]; ns?: Record<string, unknown>; loaded?: boolean; instance?: unknown };
type CalWindow = { Cal?: CalFn };

/** Loads the Cal.com embed once the page is idle, so links from calProps() open the booking popup on the page. */
export default function CalEmbed() {
  useEffect(() => {
    const w = window as unknown as CalWindow;
    if (w.Cal) return;
    const load = () => {
      const cal: CalFn = (...args) => {
        cal.q!.push(args);
      };
      cal.q = [];
      cal.ns = {};
      cal.loaded = true;
      w.Cal = cal;
      const script = document.createElement("script");
      script.src = "https://app.cal.com/embed/embed.js";
      script.async = true;
      document.head.appendChild(script);
      cal("init", { origin: "https://cal.com" });
      cal("ui", { theme: "light", cssVarsPerTheme: { light: { "cal-brand": "#e10a17" } } });
    };
    // Safari has no requestIdleCallback, so fall back to a short timeout there.
    const idle = typeof window.requestIdleCallback === "function";
    const id = idle ? window.requestIdleCallback(load, { timeout: 3000 }) : setTimeout(load, 1500);
    return () => (idle ? window.cancelIdleCallback(id as number) : clearTimeout(id));
  }, []);
  return null;
}

/** Props for a booking link: popup when the embed is ready, otherwise the Cal.com page in a new tab. */
export function calProps(link: string) {
  return {
    href: `https://cal.com/${link}`,
    target: "_blank",
    rel: "noreferrer",
    "data-cal-link": link,
    "data-cal-config": '{"layout":"month_view"}',
    onClick: (e: MouseEvent) => {
      if ((window as unknown as CalWindow).Cal?.instance) e.preventDefault();
    },
  };
}
