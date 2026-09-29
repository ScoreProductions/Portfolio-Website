"use client";

import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import Magnetic from "./Magnetic";
import { Reveal } from "./Reveal";
import SectionHeader from "./SectionHeader";

const c = site.contact;

export const socials = [
  { label: "Instagram", href: c.instagram },
  { label: "WhatsApp", href: `https://wa.me/${c.whatsapp}` },
  { label: "LinkedIn", href: c.linkedin },
];

function Field({ label, name, type = "text", textarea }: { label: string; name: string; type?: string; textarea?: boolean }) {
  const cls = "peer w-full border-b border-white/30 bg-transparent pb-3 pt-6 text-lg text-white outline-none transition-colors placeholder-transparent focus:border-white";
  return (
    <label className="relative block text-left">
      {textarea ? (
        <textarea name={name} required rows={3} placeholder={label} className={`${cls} resize-none`} />
      ) : (
        <input name={name} type={type} required placeholder={label} className={cls} />
      )}
      <span className="pointer-events-none absolute left-0 top-0 text-xs font-medium uppercase tracking-[0.2em] text-white/70 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-lg peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-0 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:text-white">
        {label}
      </span>
    </label>
  );
}

export default function Contact() {
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Nieuw project — ${d.get("naam")}`);
    const body = encodeURIComponent(`${d.get("bericht")}\n\n${d.get("naam")}\n${d.get("email")}`);
    window.location.href = `mailto:${c.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-accent px-5 py-28 text-white md:px-10 md:py-40">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[120vw] w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_60%)] md:h-[70vw] md:w-[70vw]"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative mx-auto max-w-3xl">
        <SectionHeader center dark label="Contact" title={c.title}>
          <p className="mt-3 text-xl text-white/80">{c.text}</p>
        </SectionHeader>

        <Reveal className="mt-10 flex flex-col items-center gap-2">
          <a href={`mailto:${c.email}`} className="group relative text-2xl font-medium tracking-tight md:text-4xl">
            {c.email}
            <span className="absolute -bottom-2 left-0 h-px w-full origin-left bg-white/40 transition-transform duration-500 group-hover:scale-x-0" />
            <span className="absolute -bottom-2 left-0 h-px w-full origin-right scale-x-0 bg-white transition-transform delay-200 duration-500 group-hover:origin-left group-hover:scale-x-100" />
          </a>
          <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="mt-3 text-lg text-white/80 transition-colors hover:text-white">
            {c.phone}
          </a>
        </Reveal>

        <Reveal className="mt-10 flex items-center justify-center gap-4 text-sm font-medium md:text-base">
          {socials.map((s, i) => (
            <span key={s.label} className="flex items-center gap-4">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-white/50" />}
              <a href={s.href} target="_blank" rel="noreferrer" className="text-white/85 transition-colors hover:text-white">
                {s.label}
              </a>
            </span>
          ))}
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={submit} className="mx-auto mt-16 max-w-2xl space-y-6 rounded-3xl border border-white/20 bg-white/[0.06] p-6 backdrop-blur-sm md:p-10">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Naam" name="naam" />
              <Field label="E-mail" name="email" type="email" />
            </div>
            <Field label="Bericht" name="bericht" textarea />
            <div className="flex items-center justify-between gap-4 pt-2">
              <span className="text-sm text-white/80">{sent ? "Je mailapp is geopend ✓" : ""}</span>
              <Magnetic>
                <button type="submit" className="group relative overflow-hidden rounded-full bg-white px-8 py-4 font-semibold text-accent">
                  <span className="absolute inset-0 translate-y-full rounded-full bg-fg transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
                  <span className="relative transition-colors duration-300 group-hover:text-white">Verstuur →</span>
                </button>
              </Magnetic>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
