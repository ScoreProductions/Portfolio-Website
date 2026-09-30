"use client";

import Link from "next/link";
import { site } from "@/lib/site";
import { socials } from "./Contact";

const links = [
  { href: "#portfolio", label: "Portfolio" },
  { href: "#over-mij", label: "Over mij" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1500px] px-5 pt-20 md:px-10">
      <div className="grid gap-12 md:grid-cols-3">
        <div>
          <p className="font-display text-4xl leading-none">
            {site.brand}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-4 flex flex-wrap items-baseline gap-x-2 text-muted">
            <span className="font-display text-xl tracking-[0.2em]">{site.heroSub}</span>
            <span className="font-serif text-2xl italic">{site.heroSubAccent}</span>
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em]">Links</p>
          <ul className="mt-5 space-y-3">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-muted transition-colors hover:text-accent">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em]">Contact</p>
          <ul className="mt-5 space-y-3 text-muted">
            <li>
              <a href={`mailto:${site.contact.email}`} className="transition-colors hover:text-accent">{site.contact.email}</a>
            </li>
            <li>
              <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-accent">{site.contact.phone}</a>
            </li>
            <li className="flex flex-wrap gap-4 pt-1">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
                  {s.label} ↗
                </a>
              ))}
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-16 flex flex-col justify-between gap-3 border-t border-line py-8 text-sm text-muted md:flex-row">
        <span className="flex flex-wrap gap-x-4 gap-y-1">
          <span>© {new Date().getFullYear()} {site.brand}. Alle rechten voorbehouden.</span>
          <span>KvK {site.contact.kvk}</span>
          <Link href="/privacy" className="transition-colors hover:text-accent">
            Privacyverklaring
          </Link>
        </span>
        <a href="#home" className="transition-colors hover:text-accent">
          Terug naar boven ↑
        </a>
      </div>
      <div aria-hidden className="font-display pointer-events-none -mb-[0.18em] select-none overflow-hidden whitespace-nowrap text-center text-[13vw] leading-[0.8] text-fg/[0.06]">
        {site.name}
      </div>
    </footer>
  );
}
