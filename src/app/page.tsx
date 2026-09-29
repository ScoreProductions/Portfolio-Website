import About from "@/components/About";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Featured from "@/components/Featured";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Portfolio />
      <Featured />
      <Clients />
      <About />
      <Contact />
    </>
  );
}
