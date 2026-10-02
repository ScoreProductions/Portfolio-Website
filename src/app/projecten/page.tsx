import type { Metadata } from "next";
import Portfolio from "@/components/Portfolio";
import { site, siteUrl, slugify } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projecten",
  description: `Alle projecten van ${site.name} (${site.brand}): televisie zoals Hunted en Het Jachtseizoen, bedrijfsfilms, campagnes, social content en eigen films.`,
  alternates: { canonical: "/projecten" },
  openGraph: { url: "/projecten", title: `Projecten — ${site.brand}` },
};

export default function ProjectenPage() {
  const tv = site.projects.filter((p) => p.tv).length;
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Projecten van ${site.brand}`,
    itemListElement: site.projects.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${siteUrl}/projecten/${slugify(p.title)}`, name: p.title })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <header className="relative overflow-hidden bg-accent px-5 pb-20 pt-36 text-white md:px-10 md:pb-28 md:pt-48">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        <div className="relative mx-auto max-w-[1500px]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">Portfolio</p>
          <h1 className="font-display mt-3 text-7xl leading-[0.9] md:text-[11rem]">Alle projecten</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85 md:text-xl">
            Van tv-producties tot bedrijfsfilms en eigen werk. Filter op rol of klik op een project voor de video en het verhaal erachter.
          </p>
          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4">
            {[
              [site.projects.length, "Projecten"],
              [tv, "Tv-producties"],
              [site.clients.items.length, "Merken"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-5xl leading-none md:text-6xl">{n}</dd>
                <dd className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-white/75">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>
      <div className="relative z-10 -mt-10 rounded-t-[2rem] bg-bg pt-16 md:-mt-14 md:rounded-t-[3rem] md:pt-24">
        <Portfolio full />
      </div>
    </>
  );
}
