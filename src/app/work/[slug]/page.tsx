import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import ProjectVisual from "@/components/ProjectVisual";
import { Reveal, SplitLine } from "@/components/Reveal";
import { getProject, site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return site.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: `${p.title} — ${site.name}`, description: p.summary, url: `/work/${p.slug}`, type: "article" },
    twitter: { title: `${p.title} — ${site.name}`, description: p.summary },
  };
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = site.projects.indexOf(project);
  const next = site.projects[(idx + 1) % site.projects.length];

  return (
    <>
      <article className="px-5 pt-32 md:px-10 md:pt-44">
        <Reveal>
          <Link href="/#work" className="text-sm uppercase tracking-[0.2em] text-muted transition-colors hover:text-fg">
            ← Alle projecten
          </Link>
        </Reveal>
        <h1 className="mt-8 text-[15vw] font-semibold uppercase leading-[0.85] tracking-[-0.05em] md:text-[10vw]">
          <SplitLine text={project.title} />
        </h1>
        <div className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-6 text-sm md:grid-cols-4">
          {[
            ["Klant", project.client],
            ["Jaar", project.year],
            ["Categorie", project.category],
          ].map(([k, v], i) => (
            <Reveal key={k} delay={i * 0.08}>
              <div className="text-muted">{k}</div>
              <div className="mt-1 text-base">{v}</div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl md:aspect-[16/8]">
            <ProjectVisual project={project} priority sizes="100vw" />
          </div>
        </Reveal>
        <div className="grid gap-10 py-24 md:grid-cols-[1fr_2fr] md:py-36">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">(Over het project)</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-2xl leading-snug tracking-tight md:text-4xl">{project.description}</p>
          </Reveal>
        </div>
        <Link href={`/work/${next.slug}`} data-cursor="Volgende" className="group block border-t border-line py-16 md:py-24">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Volgend project</p>
          <p className="mt-4 text-[12vw] font-semibold uppercase leading-[0.85] tracking-[-0.05em] transition-colors duration-500 group-hover:text-accent md:text-[8vw]">
            {next.title} →
          </p>
        </Link>
      </article>
      <Footer />
    </>
  );
}
