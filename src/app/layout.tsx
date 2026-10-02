import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Fraunces, Geist, Geist_Mono } from "next/font/google";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import { site, siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Fraunces({ variable: "--font-serif", subsets: ["latin"], style: "italic", axes: ["SOFT", "WONK"] });
const display = Bebas_Neue({ variable: "--font-display", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name} | ${site.brand} — ${site.role}`, template: `%s — ${site.brand}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: [site.name, site.brand, "producer", "cameraman", "videograaf", "editor", "fotograaf", "videoproductie", "bedrijfsfilm", "Enschede", "Twente", "Hunted", "tv-producer"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "/",
    siteName: site.brand,
    title: `${site.name} | ${site.brand}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.brand}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#e10a17",
  colorScheme: "light",
};

// One linked graph so search engines and AI assistants can tie the person, the business and the site together.
const tvCredits = site.projects.filter((p) => p.tv).map((p) => p.title);
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: site.name,
      jobTitle: "Producer, cameraman en editor",
      description: site.description,
      url: siteUrl,
      image: site.about.photo ? `${siteUrl}${site.about.photo}` : undefined,
      email: `mailto:${site.contact.email}`,
      telephone: site.contact.phone,
      homeLocation: { "@type": "Place", name: "Twente, Nederland" },
      worksFor: { "@id": `${siteUrl}/#business` },
      knowsAbout: ["Videoproductie", "Televisieproductie", "Producer", "Camerawerk", "Videomontage", "Fotografie", "Bedrijfsfilm", "Social media content", "Concept en regie"],
      hasOccupation: { "@type": "Occupation", name: "Producer / videograaf", occupationLocation: { "@type": "City", name: "Enschede" } },
      sameAs: [site.contact.instagram, site.contact.linkedin],
      subjectOf: tvCredits.map((t) => ({ "@type": "TVSeries", name: t })),
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#business`,
      name: site.brand,
      url: siteUrl,
      description: site.description,
      founder: { "@id": `${siteUrl}/#person` },
      email: site.contact.email,
      telephone: site.contact.phone,
      address: { "@type": "PostalAddress", streetAddress: "Molenstraat 5-24", addressLocality: "Enschede", addressRegion: "Overijssel", addressCountry: "NL" },
      areaServed: [{ "@type": "AdministrativeArea", name: "Twente" }, { "@type": "Country", name: "Nederland" }],
      identifier: { "@type": "PropertyValue", propertyID: "KvK", value: site.contact.kvk },
      knowsAbout: ["Videoproductie", "Bedrijfsfilm", "Campagnevideo", "Social content", "Fotografie", "Post-productie"],
      sameAs: [site.contact.instagram, site.contact.linkedin],
    },
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: site.brand, inLanguage: "nl-NL", publisher: { "@id": `${siteUrl}/#business` } },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl" className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${serif.variable} antialiased`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SmoothScroll />
        <Cursor />
        <Nav />
        <main>{children}</main>
        <Footer />
        <div aria-hidden className="grain" />
      </body>
    </html>
  );
}
