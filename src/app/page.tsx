import About from "@/components/About";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import Showreel from "@/components/Showreel";

export default function Home() {
  return (
    <>
      <Hero />
      <Showreel />
      <Services />
      <Portfolio />
      <Clients />
      <About />
      <Contact />
    </>
  );
}
