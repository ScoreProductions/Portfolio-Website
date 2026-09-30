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

function SocialIcon({ name }: { name: string }) {
  const p = { viewBox: "0 0 24 24", className: "h-5 w-5", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "Instagram")
    return (
      <svg {...p}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    );
  if (name === "WhatsApp")
    return (
      <svg {...p}>
        <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20z" />
        <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2L9 9.5z" />
      </svg>
    );
  return (
    <svg {...p}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10.5V16M8 8v.01M12 16v-5.5M12 13a2.5 2.5 0 0 1 5 0v3" />
    </svg>
  );
}

function Field({ label, name, type = "text", textarea, optional }: { label: string; name: string; type?: string; textarea?: boolean; optional?: boolean }) {
  const cls = "peer w-full border-b border-white/30 bg-transparent pb-3 pt-6 text-lg text-white outline-none transition-colors placeholder-transparent focus:border-white";
  return (
    <label className="relative block text-left">
      {textarea ? (
        <textarea name={name} required rows={3} placeholder={label} className={`${cls} resize-none`} />
      ) : (
        <input name={name} type={type} required={!optional} placeholder={label} className={cls} />
      )}
      <span className="pointer-events-none absolute left-0 top-0 text-xs font-medium uppercase tracking-[0.2em] text-white/70 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-lg peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-0 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:text-white">
        {label}
      </span>
    </label>
  );
}

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  // Sends the form straight to the inbox via Web3Forms (access key in site.json → contact.formKey).
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: c.formKey,
          subject: `Nieuw project — ${d.get("naam")}`,
          from_name: "Score Productions website",
          name: d.get("naam"),
          email: d.get("email"),
          telefoon: d.get("telefoon") || "-",
          message: d.get("bericht"),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message ?? String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
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

        <Reveal className="mt-10 flex items-center justify-center gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              title={s.label}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:bg-white hover:text-accent"
            >
              <SocialIcon name={s.label} />
            </a>
          ))}
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={submit} className="mx-auto mt-16 max-w-2xl space-y-6 rounded-3xl border border-white/20 bg-white/[0.06] p-6 backdrop-blur-sm md:p-10">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Naam" name="naam" />
              <Field label="E-mail" name="email" type="email" />
            </div>
            <Field label="Telefoonnummer (optioneel)" name="telefoon" type="tel" optional />
            <Field label="Bericht" name="bericht" textarea />
            <div className="flex items-center justify-between gap-4 pt-2">
              <span className="text-sm text-white/80" aria-live="polite">
                {{ idle: "", sending: "Versturen…", sent: "Bedankt! We nemen snel contact met je op ✓", error: `Versturen lukte niet. Mail gerust direct naar ${c.email}` }[status]}
              </span>
              <Magnetic>
                <button type="submit" disabled={status === "sending"} className="group relative overflow-hidden rounded-full bg-white px-8 py-4 font-semibold text-accent">
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
