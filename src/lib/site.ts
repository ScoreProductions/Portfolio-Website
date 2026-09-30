import content from "@/content/site.json";

export type Project = {
  title: string;
  brand: string;
  roles: string[];
  functie: string;
  description: string;
  video: string;
  preview: string;
  thumbnail: string;
  tv?: boolean;
  jaar?: string;
  timeline?: { label: string; date: string }[];
  kijk?: { label: string; url: string };
  /** Extra videos for the same client; the tile lets visitors swipe between them. */
  items?: ProjectItem[];
};

export type ProjectItem = Partial<Pick<Project, "video" | "preview" | "thumbnail" | "functie" | "description" | "jaar">> & { title: string };

/** Project merged with its n-th item (item 0 is the project itself). */
export function projectVariant(p: Project, n: number): Project & { subtitle?: string } {
  const item = p.items?.[n];
  return item ? { ...p, ...item, title: p.title, subtitle: item.title } : p;
}

export const site = content as Omit<typeof content, "projects"> & { projects: Project[] };

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

/** Turns a YouTube/Vimeo link into an embeddable URL; returns null for direct video files. */
export function embedUrl(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([\da-f]+))?/);
  const hash = vimeo?.[2] ?? url.match(/[?&]h=([\da-f]+)/)?.[1];
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&title=0&byline=0${hash ? `&h=${hash}` : ""}`;
  return null;
}

export function youtubeThumb(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return yt ? `https://i.ytimg.com/vi/${yt[1]}/maxresdefault.jpg` : null;
}
