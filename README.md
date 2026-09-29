# Max Score — Score Productions

One-page portfolio. Next.js + Tailwind + Framer Motion. Live via Vercel.

## Content aanpassen (zonder code)

1. Open `src/content/site.json` op GitHub → klik het potlood-icoon.
2. Pas teksten aan → **Commit changes**. Binnen ~1 minuut live.

### Video's

Per project in `projects`:
- `video`: YouTube- of Vimeo-link (bijv. `https://youtu.be/xxxx`). Thumbnail komt dan automatisch.
- `thumbnail` (optioneel): eigen afbeelding, bijv. `/images/tastory.jpg`.
- `preview` (optioneel): korte mp4 die speelt bij hover, bijv. `/videos/tastory.mp4`.
- `roles`: bepaalt het filter (`Producer`, `Camera`, `Editor`, `Creative`).
- `size`: `large`, `wide`, `tall` of `normal`.

Showreel: zet een YouTube/Vimeo-link of `/videos/showreel.mp4` bij `showreel`.

### Foto's

Upload naar `public/images/` (GitHub: **Add file → Upload files**), en verwijs ernaar als `/images/bestand.jpg`.
Profielfoto: `about.photo`.

## Lokaal

```bash
npm install
npm run dev
```

Optioneel op Vercel: env var `NEXT_PUBLIC_SITE_URL` = je domein.
