import About from "@/components/About";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Featured from "@/components/Featured";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import TvCredits from "@/components/TvCredits";

export default function Home() {
  return (
    <>
      <Hero />
      {/* Rest of the page slides up over the hero as a rounded sheet for a softer transition. */}
      <div className="relative z-10 -mt-10 rounded-t-[2rem] bg-bg shadow-[0_-20px_60px_rgba(0,0,0,0.18)] md:-mt-14 md:rounded-t-[3rem]">
        <TvCredits />
        <Services />
        <Portfolio />
        <Featured />
        <Clients />
        <About />
        <Contact />
      </div>
    </>
  );
}
