# Score Productions — Portfolio

Next.js + Tailwind + Framer Motion. Klaar voor Vercel.

## Content aanpassen (zonder code)

1. Open `src/content/site.json` op GitHub → klik het potlood-icoon.
2. Pas teksten aan (naam, e-mail, projecten, diensten, socials).
3. Klik **Commit changes**. Vercel zet de site binnen ~1 minuut live.

### Projectfoto toevoegen

1. Upload een foto naar de map `public/work/` (op GitHub: **Add file → Upload files**).
2. Zet bij het project in `site.json`: `"image": "/work/bestandsnaam.jpg"`.

Leeg laten = automatische kleurverloop met `colors`.

## Lokaal draaien

```bash
npm install
npm run dev
```

## Vercel

Optioneel: zet env var `NEXT_PUBLIC_SITE_URL` op je eigen domein (bijv. `https://scoreproductions.nl`) voor SEO.
