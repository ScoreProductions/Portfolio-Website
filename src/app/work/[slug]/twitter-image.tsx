import { ogSize, renderOg } from "@/lib/og";
import { getProject, site } from "@/lib/site";

export const alt = `Project — ${site.name}`;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return site.projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  return renderOg({ eyebrow: p?.category ?? "Project", title: p?.title ?? site.name, colors: p?.colors });
}
