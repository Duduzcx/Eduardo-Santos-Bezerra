import Hero from "@/components/Hero";
import About from "@/components/About";
import Process from "@/components/Process";
import Skills from "@/components/Skills";
import Laboratory from "@/components/Laboratory";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import SectionReveal from "@/components/SectionReveal";

export default function Home() {
  return (
    <main className="w-full relative">
      <Hero />
      <SectionReveal variant="up"><About /></SectionReveal>
      <SectionReveal variant="left"><Process /></SectionReveal>
      <SectionReveal variant="scale"><Skills /></SectionReveal>
      <SectionReveal variant="right"><Laboratory /></SectionReveal>
      <SectionReveal variant="left"><Projects /></SectionReveal>
      <SectionReveal variant="scale"><Contact /></SectionReveal>
    </main>
  );
}
