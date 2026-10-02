import type { MetadataRoute } from "next";
import { site, siteUrl, slugify, youtubeThumb } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/projecten`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...site.projects.map((p) => {
      const thumb = p.thumbnail ? `${siteUrl}${p.thumbnail}` : youtubeThumb(p.video);
      return {
        url: `${siteUrl}/projecten/${slugify(p.title)}`,
        lastModified: now,
        changeFrequency: "yearly" as const,
        priority: p.tv ? 0.8 : 0.6,
        images: thumb ? [thumb] : undefined,
      };
    }),
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
