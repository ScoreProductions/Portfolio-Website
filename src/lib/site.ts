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
  /** Small line under the title on the tile (items override it). */
  subtitle?: string;
  jaar?: string;
  timeline?: { label: string; date: string }[];
  kijk?: { label: string; url: string };
  /** Second where the muted hover preview of a YouTube video starts. */
  previewStart?: number;
  /** Portrait (9:16) video; defaults to true for YouTube Shorts links. */
  vertical?: boolean;
  /** Behind-the-scenes photos shown in the project modal. */
  photos?: string[];
  /** Team credits shown instead of the single "functie" line. */
  credits?: { name: string; role: string }[];
  /** Logo override when the brand name doesn't match a client in the logo list. */
  logo?: string;
  /** Production company the work was made through. */
  via?: string;
  /** Extra videos for the same client; the tile lets visitors swipe between them. */
  items?: ProjectItem[];
};

export type ProjectItem = Partial<Pick<Project, "video" | "preview" | "thumbnail" | "functie" | "description" | "jaar" | "vertical" | "previewStart">> & { title: string };

/** Project merged with its n-th item (item 0 is the project itself). */
export function projectVariant(p: Project, n: number): Project & { subtitle?: string } {
  const item = p.items?.[n];
  return item ? { ...p, ...item, title: p.title, subtitle: item.title } : p;
}

export const site = content as Omit<typeof content, "projects" | "recent"> & { projects: Project[]; recent: string[] };

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Logo from the client list whose name matches (or starts with) the given brand/company name. */
export function clientLogo(name?: string) {
  if (!name) return undefined;
  const n = norm(name);
  const c = site.clients.items.find((c) => c.logo && (norm(c.name) === n || norm(c.name).startsWith(n) || n.startsWith(norm(c.name))));
  return c?.logo || undefined;
}

/** Renders as the logo image when one exists, otherwise null (callers fall back to text). */
export function brandLogo(p: Pick<Project, "brand" | "logo">) {
  return p.logo ?? clientLogo(p.brand);
}

/** URL-friendly id for a project, used for /projecten/[slug]. */
export function slugify(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "en")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Turns a YouTube/Vimeo link into an embeddable URL; returns null for direct video files. */
export function embedUrl(url: string, autoplay = true) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([\da-f]+))?/);
  const hash = vimeo?.[2] ?? url.match(/[?&]h=([\da-f]+)/)?.[1];
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=${autoplay ? 1 : 0}&title=0&byline=0${hash ? `&h=${hash}` : ""}`;
  return null;
}

export function youtubeId(url: string) {
  return url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/)?.[1] ?? null;
}

/** Muted, chromeless, looping YouTube embed used as a hover preview on tiles. */
export function youtubePreviewUrl(url: string, start: number) {
  const id = youtubeId(url);
  if (!id) return null;
  const q = new URLSearchParams({ autoplay: "1", mute: "1", controls: "0", loop: "1", playlist: id, start: String(start), end: String(start + 8), playsinline: "1", rel: "0", modestbranding: "1", disablekb: "1", iv_load_policy: "3" });
  return `https://www.youtube-nocookie.com/embed/${id}?${q}`;
}

/** Muted, chromeless, endlessly looping YouTube embed for use as a background video. */
export function youtubeBackgroundUrl(url: string) {
  const id = youtubeId(url);
  if (!id) return null;
  const q = new URLSearchParams({ autoplay: "1", mute: "1", controls: "0", loop: "1", playlist: id, playsinline: "1", rel: "0", modestbranding: "1", disablekb: "1", iv_load_policy: "3" });
  return `https://www.youtube-nocookie.com/embed/${id}?${q}`;
}

export function isVertical(p: Pick<Project, "video" | "vertical">) {
  return p.vertical ?? /youtube\.com\/shorts\//.test(p.video);
}

export function youtubeThumb(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt && /youtube\.com\/shorts\//.test(url)) return `https://i.ytimg.com/vi/${yt[1]}/oardefault.jpg`;
  return yt ? `https://i.ytimg.com/vi/${yt[1]}/maxresdefault.jpg` : null;
}
