import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description: `Privacyverklaring van ${site.brand}.`,
};

const c = site.contact;

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "Wie zijn wij",
    body: (
      <p>
        {site.brand} is de onderneming van {site.name}, gevestigd aan {c.address} en ingeschreven bij de Kamer van Koophandel onder nummer {c.kvk}. Wij zijn verantwoordelijk voor de verwerking van
        persoonsgegevens zoals beschreven in deze verklaring. Vragen? Mail naar <a href={`mailto:${c.email}`} className="text-accent underline-offset-4 hover:underline">{c.email}</a>.
      </p>
    ),
  },
  {
    title: "Welke gegevens we verwerken",
    body: (
      <p>
        Als je het contactformulier invult, ontvangen we je naam, e-mailadres, (optioneel) je telefoonnummer en je bericht. Mail, bel of app je ons direct, dan verwerken we de
        gegevens die je daarbij zelf deelt.
      </p>
    ),
  },
  {
    title: "Waarvoor we ze gebruiken",
    body: <p>Uitsluitend om je vraag te beantwoorden en, als je dat wilt, een offerte of samenwerking met je te bespreken. We gebruiken je gegevens niet voor nieuwsbrieven of reclame en verkopen ze nooit door.</p>,
  },
  {
    title: "Wie ze nog meer verwerkt",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Het contactformulier wordt verstuurd via Web3Forms, dat het bericht doorstuurt naar onze mailbox.</li>
        <li>De website wordt gehost door Vercel. Zoals elke webserver verwerkt die technische gegevens zoals je IP-adres om de site te kunnen tonen.</li>
        <li>Video&apos;s worden afgespeeld via YouTube (in de privacyvriendelijke modus). Pas als je een video afspeelt of er met je muis overheen gaat, kan YouTube gegevens of cookies opslaan.</li>
      </ul>
    ),
  },
  {
    title: "Cookies",
    body: <p>Deze website plaatst zelf geen tracking- of advertentiecookies en gebruikt geen analysetools. Alleen de ingesloten video&apos;s van YouTube kunnen cookies plaatsen, zoals hierboven beschreven.</p>,
  },
  {
    title: "Hoe lang we ze bewaren",
    body: <p>We bewaren je gegevens niet langer dan nodig is om je vraag af te handelen. Leidt je bericht tot een opdracht, dan bewaren we de gegevens zolang dat nodig is voor die opdracht en de wettelijke (fiscale) bewaarplicht.</p>,
  },
  {
    title: "Jouw rechten",
    body: (
      <p>
        Je mag altijd vragen welke gegevens we van je hebben, ze laten aanpassen of laten verwijderen. Stuur daarvoor een mail naar{" "}
        <a href={`mailto:${c.email}`} className="text-accent underline-offset-4 hover:underline">{c.email}</a>. Ben je het niet eens met hoe we met je gegevens omgaan, dan kun je
        een klacht indienen bij de Autoriteit Persoonsgegevens.
      </p>
    ),
  },
];

export default function Privacy() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-32 md:pt-40">
      <Link href="/" className="text-sm text-muted transition-colors hover:text-accent">
        ← Terug naar de site
      </Link>
      <h1 className="font-display mt-6 break-words text-5xl leading-none sm:text-6xl md:text-8xl">Privacyverklaring</h1>
      <p className="mt-4 text-sm text-muted">Laatst bijgewerkt: oktober 2026</p>
      <div className="mt-12 space-y-10 text-lg leading-relaxed text-fg/80">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">{s.title}</h2>
            <div className="mt-3">{s.body}</div>
          </section>
        ))}
      </div>
    </main>
  );
}
