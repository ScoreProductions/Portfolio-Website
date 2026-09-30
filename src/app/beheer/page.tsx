"use client";

import { Reorder } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { site, youtubeThumb } from "@/lib/site";

type Status = { kind: "idle" | "saving" | "ok" | "error"; text?: string };

export default function Beheer() {
  const [order, setOrder] = useState(site.projects.map((p) => p.title));
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const byTitle = new Map(site.projects.map((p) => [p.title, p]));

  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  };

  const save = async () => {
    setStatus({ kind: "saving" });
    const res = await fetch("/api/volgorde", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, order }),
    });
    const json = await res.json().catch(() => ({}));
    setStatus(res.ok ? { kind: "ok", text: "Opgeslagen! Over ongeveer een minuut staat de nieuwe volgorde live." } : { kind: "error", text: json.error ?? "Opslaan mislukt." });
  };

  return (
    <main className="mx-auto max-w-2xl px-5 py-28">
      <h1 className="font-display text-6xl">Volgorde portfolio</h1>
      <p className="mt-3 text-muted">Sleep de projecten in de gewenste volgorde (of gebruik de pijltjes) en klik op Opslaan. Bovenaan = eerste tegel.</p>

      <Reorder.Group axis="y" values={order} onReorder={setOrder} className="mt-10 space-y-2" data-lenis-prevent>
        {order.map((title, i) => {
          const p = byTitle.get(title)!;
          const thumb = p.thumbnail || youtubeThumb(p.video);
          return (
            <Reorder.Item key={title} value={title} className="flex cursor-grab items-center gap-4 rounded-2xl border border-line bg-surface p-3 active:cursor-grabbing">
              <span className="w-6 text-right text-sm tabular-nums text-muted">{i + 1}</span>
              <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-accent">
                {thumb && <Image src={thumb} alt="" fill sizes="80px" className="object-cover" draggable={false} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{title}</p>
                <p className="truncate text-sm text-muted">{p.brand}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => move(i, -1)} aria-label="Omhoog" className="h-9 w-9 rounded-full border border-line hover:border-accent hover:text-accent">↑</button>
                <button onClick={() => move(i, 1)} aria-label="Omlaag" className="h-9 w-9 rounded-full border border-line hover:border-accent hover:text-accent">↓</button>
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Wachtwoord"
          className="flex-1 rounded-full border border-line px-5 py-3 outline-none focus:border-accent"
        />
        <button onClick={save} disabled={status.kind === "saving" || !password} className="rounded-full bg-accent px-8 py-3 font-semibold text-white disabled:opacity-50">
          {status.kind === "saving" ? "Opslaan…" : "Opslaan"}
        </button>
      </div>
      {status.text && <p className={`mt-4 text-sm ${status.kind === "ok" ? "text-green-700" : "text-accent"}`}>{status.text}</p>}
    </main>
  );
}
