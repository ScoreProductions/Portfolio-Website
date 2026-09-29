import About from "@/components/About";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import Work from "@/components/Work";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee items={site.marquee} />
      <Work />
      <About />
      <Marquee items={site.services.map((s) => s.title)} baseVelocity={3} />
      <Services />
      <Footer />
    </>
  );
}
