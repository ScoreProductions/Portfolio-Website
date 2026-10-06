// Publishes scheduled videos: removes "binnenkort" from items whose release date (Europe/Amsterdam) has arrived.
import { readFileSync, writeFileSync } from "node:fs";

const file = new URL("../src/content/site.json", import.meta.url);
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Amsterdam" }).format(new Date());
const site = JSON.parse(readFileSync(file, "utf8"));
const released = [];

for (const p of site.projects) {
  for (const it of [p, ...(p.items ?? [])]) {
    if (it.binnenkort && it.binnenkort <= today) {
      delete it.binnenkort;
      released.push(`${p.title} – ${it.title}`);
    }
  }
}

if (released.length) {
  writeFileSync(file, JSON.stringify(site, null, 2) + "\n");
  console.log(`Released: ${released.join(", ")}`);
} else console.log("Nothing to release");
