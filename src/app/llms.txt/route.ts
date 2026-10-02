import { site, siteUrl, slugify } from "@/lib/site";

// Plain-language summary for AI assistants (llms.txt convention), generated from the same content as the site.
export const dynamic = "force-static";

export function GET() {
  const c = site.contact;
  const tv = site.projects.filter((p) => p.tv);
  const other = site.projects.filter((p) => !p.tv);
  const line = (p: (typeof site.projects)[number]) => `- [${p.title}](${siteUrl}/projecten/${slugify(p.title)}): ${p.functie} — ${p.brand}${p.jaar ? `, ${p.jaar}` : ""}. ${p.description}`;

  const body = `# ${site.name} — ${site.brand}

> ${site.description}

${site.name} is de eigenaar van ${site.brand}, gevestigd in Enschede (Twente). Hij is van A tot Z inzetbaar: concept, script en storyboard, productie, camera en fotografie, en montage. Ook los in te huren als ${site.freelance.items.join(", ")}.

## Over
${site.about.blocks.map((b) => `- ${b.title}: ${b.text}`).join("\n")}

## Televisie
${tv.map(line).join("\n")}

## Overige projecten
${other.map(line).join("\n")}

## Gewerkt met / voor
${site.clients.items.map((x) => x.name).join(", ")}

## Contact
- E-mail: ${c.email}
- Telefoon/WhatsApp: ${c.phone}
- Instagram: ${c.instagram}
- LinkedIn: ${c.linkedin}
- Adres: ${c.address}
- KvK: ${c.kvk}

## Pagina's
- [Home](${siteUrl})
- [Alle projecten](${siteUrl}/projecten)
- [Privacyverklaring](${siteUrl}/privacy)
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
