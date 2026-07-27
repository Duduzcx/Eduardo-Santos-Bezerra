import Hero from "@/components/Hero";
import About from "@/components/About";
import Journey from "@/components/Journey";
import Process from "@/components/Process";
import Skills from "@/components/Skills";
import Laboratory from "@/components/Laboratory";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import SectionReveal from "@/components/SectionReveal";
import LazyMount from "@/components/LazyMount";

export default function Home() {
  return (
    <main className="w-full relative">
      <Hero />
      <SectionReveal variant="up"><About /></SectionReveal>
      <LazyMount minHeight={800}><Journey /></LazyMount>
      <SectionReveal variant="left"><Process /></SectionReveal>
      <SectionReveal variant="scale"><Skills /></SectionReveal>
      <LazyMount minHeight={1200}><SectionReveal variant="right"><Laboratory /></SectionReveal></LazyMount>
      <SectionReveal variant="left"><Projects /></SectionReveal>
      <LazyMount minHeight={700}><SectionReveal variant="scale"><Contact /></SectionReveal></LazyMount>
    </main>
  );
}
