import { ogSize, renderOg } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name} | ${site.brand} — ${site.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: site.name, title: `${site.tagline} ${site.taglineAccent}` });
}
