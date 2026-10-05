import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PhotoGallery from "@/components/PhotoGallery";
import VideoSwitcher from "@/components/VideoSwitcher";
import { LogoOrName } from "@/components/Portfolio";
import { brandLogo, clientLogo, embedUrl, isVertical, site, siteUrl, slugify, youtubeThumb } from "@/lib/site";

const find = (slug: string) => site.projects.find((p) => slugify(p.title) === slug);

export function generateStaticParams() {
  return site.projects.map((p) => ({ slug: slugify(p.title) }));
}

export async function generateMetadata(props: PageProps<"/projecten/[slug]">): Promise<Metadata> {
  const p = find((await props.params).slug);
  if (!p) return {};
  const thumb = p.thumbnail || youtubeThumb(p.video);
  const description = `${p.title} (${p.brand}) — ${p.functie}. ${p.description.replace(/\s+/g, " ")}`.slice(0, 300);
  return {
    title: `${p.title} — ${p.functie}`,
    description,
    alternates: { canonical: `/projecten/${slugify(p.title)}` },
    openGraph: { type: "article", url: `/projecten/${slugify(p.title)}`, title: `${p.title} — ${site.brand}`, description, images: thumb ? [thumb] : undefined },
  };
}

export default async function ProjectPage(props: PageProps<"/projecten/[slug]">) {
  const p = find((await props.params).slug);
  if (!p) notFound();
  const i = site.projects.indexOf(p);
  const next = site.projects[(i + 1) % site.projects.length];
  const videos: { title?: string; video: string; vertical: boolean }[] = p.items?.length
    ? p.items.filter((it) => it.video).map((it) => ({ title: it.title, video: it.video!, vertical: isVertical({ video: it.video!, vertical: it.vertical }) }))
    : p.video
      ? [{ video: p.video, vertical: isVertical(p) }]
      : [];
  const thumb = p.thumbnail || youtubeThumb(p.video);
  const url = `${siteUrl}/projecten/${slugify(p.title)}`;

  const rows: [string, React.ReactNode][] = [
    [p.tv ? "Zender" : "Merk", <LogoOrName key="b" name={p.brand} logo={brandLogo(p)} />],
    ...(p.via ? ([["Via", <LogoOrName key="v" name={p.via} logo={clientLogo(p.via)} />]] as [string, React.ReactNode][]) : []),
    [
      p.credits?.length ? "Team" : "Mijn rol",
      p.credits?.length ? (
        <ul className="space-y-1">
          {p.credits.map((c) => (
            <li key={c.name}>
              <span className="font-semibold">{c.name}</span> <span className="text-muted">— {c.role}</span>
            </li>
          ))}
        </ul>
      ) : (
        p.functie
      ),
    ],
    ...(p.jaar ? ([[p.tv ? "Gewerkt aan" : "Jaar", p.jaar]] as [string, string][]) : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: p.title,
        url,
        description: p.description,
        image: thumb ?? undefined,
        genre: p.tv ? "Televisie" : "Video",
        dateCreated: p.jaar?.match(/\d{4}/)?.[0],
        sourceOrganization: { "@type": "Organization", name: p.brand },
        contributor: { "@type": "Person", name: site.name, url: siteUrl, jobTitle: p.functie },
        video: videos.map((v) => ({ "@type": "VideoObject", name: v.title ? `${p.title} — ${v.title}` : p.title, embedUrl: embedUrl(v.video, false), description: p.description, thumbnailUrl: youtubeThumb(v.video) ?? thumb ?? undefined })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Projecten", item: `${siteUrl}/projecten` },
          { "@type": "ListItem", position: 3, name: p.title, item: url },
        ],
      },
    ],
  };

  return (
    <article className="mx-auto max-w-[1200px] px-5 pb-28 pt-32 md:px-10 md:pt-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Kruimelpad" className="text-sm text-muted">
        <Link href="/" className="hover:text-accent">Home</Link> <span aria-hidden>/</span>{" "}
        <Link href="/projecten" className="hover:text-accent">Projecten</Link> <span aria-hidden>/</span> <span className="text-fg">{p.title}</span>
      </nav>

      <header className="mt-8">
        <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">{p.brand}</span>
        <h1 className="font-display mt-4 text-6xl leading-[0.9] md:text-8xl">
          {p.title.split(/:\s+/).map((part, i, all) => (
            <span key={i} className={i ? "block text-[0.55em] text-muted" : "block"}>
              {part}
              {i < all.length - 1 ? ":" : ""}
            </span>
          ))}
        </h1>
        <p className="mt-4 text-xl text-muted md:text-2xl">{p.functie}{p.jaar ? ` · ${p.jaar}` : ""}</p>
      </header>

      <div className="mt-12">
        {videos.length ? (
          <VideoSwitcher videos={videos} title={p.title} />        ) : thumb ? (
          <div className="relative aspect-video overflow-hidden rounded-3xl"><Image src={thumb} alt={p.title} fill sizes="100vw" className="object-cover" /></div>
        ) : null}
      </div>

      <div className="mt-14 grid gap-12 md:grid-cols-[1.5fr_1fr]">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Over dit project</h2>
          <div className="mt-4 space-y-5 text-xl leading-relaxed text-fg/80">
            {p.description.split(/\n\n+/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          {p.kijk && (
            <p className="mt-6">
              <a href={p.kijk.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline-offset-4 hover:underline">Te zien op {p.kijk.label} ↗</a>
            </p>
          )}
        </section>
        <dl className="space-y-5">
          {rows.map(([k, v]) => (
            <div key={k} className="border-b border-line pb-4">
              <dt className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{k}</dt>
              <dd className="mt-1 text-lg">{v}</dd>
            </div>
          ))}
          {!!p.timeline?.length && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Mijn seizoenen</dt>
              <dd>
                <ul className="mt-3 space-y-2">
                  {p.timeline.map((t) => (
                    <li key={t.label}><span className="font-semibold">{t.label}</span> <span className="text-muted">— {t.date}</span></li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {!!p.photos?.length && (
        <section className="mt-16">
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">{!p.video && p.roles.includes("Fotografie") ? "Foto's" : "Behind the scenes"}</h2>
          <PhotoGallery photos={p.photos} alt={`${p.title} — behind the scenes`} wide />
        </section>
      )}

      <footer className="mt-20 flex flex-col gap-6 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
        <Link href="/projecten" className="text-muted hover:text-accent">← Alle projecten</Link>
        <Link href={`/projecten/${slugify(next.title)}`} className="group text-right">
          <span className="block text-xs font-medium uppercase tracking-[0.2em] text-muted">Volgend project</span>
          <span className="font-display text-5xl leading-none transition-colors group-hover:text-accent md:text-6xl">{next.title} →</span>
        </Link>
      </footer>
    </article>
  );
}

