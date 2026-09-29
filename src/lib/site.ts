import content from "@/content/site.json";

export type Project = (typeof content.projects)[number];

export const site = content;

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export function getProject(slug: string) {
  return site.projects.find((p) => p.slug === slug);
}

export function projectGradient(p: Project) {
  const [a, b] = p.colors;
  return `radial-gradient(120% 120% at 20% 10%, ${a} 0%, transparent 55%), radial-gradient(120% 120% at 90% 90%, ${b} 0%, transparent 60%), #0b0b0c`;
}
