import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Search engines and AI assistants (ChatGPT, Claude, Perplexity, Google AI) may read everything except the admin bits.
const aiBots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended"];
const disallow = ["/beheer", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow }, ...aiBots.map((userAgent) => ({ userAgent, allow: "/", disallow }))],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
