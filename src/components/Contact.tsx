"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import Magnetic from "./Magnetic";
import { SplitLine } from "./Reveal";

const c = site.contact;

const socials = [
  { label: "Instagram", href: c.instagram },
  { label: "WhatsApp", href: `https://wa.me/${c.whatsapp}` },
  { label: "LinkedIn", href: c.linkedin },
];

function Field({ label, name, type = "text", textarea }: { label: string; name: string; type?: string; textarea?: boolean }) {
  const cls =
    "peer w-full border-b border-fg/15 bg-transparent pb-3 pt-6 text-lg outline-none transition-colors placeholder-transparent focus:border-accent";
  return (
    <label className="relative block">
      {textarea ? (
        <textarea name={name} required rows={4} placeholder={label} className={`${cls} resize-none`} />
      ) : (
        <input name={name} type={type} required placeholder={label} className={cls} />
      )}
      <span className="pointer-events-none absolute left-0 top-0 text-xs font-medium uppercase tracking-[0.2em] text-muted transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-lg peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-0 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:text-accent">
        {label}
      </span>
    </label>
  );
}

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 30%"] });
  const radius = useTransform(scrollYProgress, [0, 1], [120, 32]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Nieuw project — ${d.get("naam")}`);
    const body = encodeURIComponent(`${d.get("bericht")}\n\n${d.get("naam")}\n${d.get("email")}`);
    window.location.href = `mailto:${c.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="contact" ref={ref} className="px-3 pb-3 md:px-6 md:pb-6">
      <motion.div style={{ borderRadius: radius, scale }} className="overflow-hidden bg-accent px-5 pb-8 pt-24 text-white md:px-12 md:pt-32">
        <p className="mb-8 text-sm font-medium uppercase tracking-[0.25em] text-white/70">(Contact)</p>
        <h2 className="max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.045em] md:text-[7vw]">
          {c.title.split(" ").reduce<string[][]>((acc, w, i) => {
            (acc[Math.floor(i / 3)] ??= []).push(w);
            return acc;
          }, []).map((line, i) => (
            <SplitLine key={i} text={line.join(" ")} delay={i * 0.08} />
          ))}
        </h2>

        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <div className="flex flex-col justify-between gap-10">
            <p className="max-w-md text-xl leading-snug text-white/90">{c.text}</p>
            <div className="space-y-2 text-2xl font-medium tracking-tight md:text-3xl">
              <a href={`mailto:${c.email}`} className="block w-fit break-all underline decoration-white/30 underline-offset-8 transition-colors hover:decoration-white">
                {c.email}
              </a>
              <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="block w-fit underline decoration-white/30 underline-offset-8 transition-colors hover:decoration-white">
                {c.phone}
              </a>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-6 rounded-3xl bg-white p-6 text-fg md:p-10">
            <Field label="Naam" name="naam" />
            <Field label="E-mail" name="email" type="email" />
            <Field label="Bericht" name="bericht" textarea />
            <div className="flex items-center justify-between gap-4 pt-2">
              <span className="text-sm text-muted">{sent ? "Je mailapp is geopend ✓" : ""}</span>
              <Magnetic>
                <button type="submit" className="group relative overflow-hidden rounded-full bg-accent px-8 py-4 font-semibold text-white">
                  <span className="absolute inset-0 translate-y-full rounded-full bg-fg transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
                  <span className="relative">Verstuur →</span>
                </button>
              </Magnetic>
            </div>
          </form>
        </div>

        <div className="mt-20 grid grid-cols-3 border-t border-white/25 md:mt-28">
          {socials.map((s, i) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className={`group flex items-center justify-between py-6 text-base font-semibold md:py-8 md:text-3xl md:tracking-tight ${i > 0 ? "border-l border-white/25 pl-3 md:pl-8" : ""} ${i < 2 ? "pr-3 md:pr-8" : ""}`}
            >
              {s.label}
              <span className="hidden transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 sm:inline">↗</span>
            </a>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-white/25 pt-6 text-sm text-white/70 md:flex-row">
          <span>
            © {new Date().getFullYear()} {site.brand}
          </span>
          <span>{site.role}</span>
        </div>

        <div aria-hidden className="pointer-events-none mt-6 select-none whitespace-nowrap text-center text-[15vw] font-semibold uppercase leading-[0.78] tracking-[-0.06em] text-white/15 md:text-[13vw]">
          {site.name}
        </div>
      </motion.div>
    </section>
  );
}
