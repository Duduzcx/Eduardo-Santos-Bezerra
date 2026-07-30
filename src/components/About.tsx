"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import TextReveal from "./TextReveal";
import LetterReveal from "./LetterReveal";
import CosmicFolder from "./CosmicFolder";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: titleProgress } = useScroll({
    target: titleRef,
    offset: ["start 90%", "start 30%"],
  });
  const bgTextClip = useTransform(titleProgress, [0, 1], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);

  // Saída de scroll: encolhe + some na segunda metade do trânsito da seção pelo topo da tela
  const { scrollYProgress: exitProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const exitOpacity = useTransform(exitProgress, [0.55, 1], [1, 0]);
  const exitScale = useTransform(exitProgress, [0.55, 1], [1, 0.95]);

  return (
    <section ref={sectionRef} id="about" className="w-full py-32 relative z-20 bg-transparent overflow-hidden">
      
      {/* Orrery Cósmico (Planetário de órbitas) */}
      <motion.div
        style={{ opacity: exitOpacity, scale: exitScale }}
        className="absolute -left-[10%] top-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: -45 }}
          whileInView={{ opacity: 0.12, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full"
        >
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[var(--color-cyan)]" stroke="currentColor" strokeWidth="0.75">
            {/* Sol Central */}
            <circle cx="50" cy="50" r="4" fill="currentColor" className="animate-pulse" />
            
            {/* Órbita 1 e Planeta 1 */}
            <circle cx="50" cy="50" r="16" strokeDasharray="3 3" opacity="0.5" />
            <motion.circle 
              cx="50" cy="50" r="16" 
              stroke="var(--color-accent)" strokeWidth="1.5"
              strokeDasharray="0.1 32" strokeLinecap="round"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              style={{ originX: "50px", originY: "50px" }}
            />

            {/* Órbita 2 e Planeta 2 */}
            <circle cx="50" cy="50" r="30" strokeDasharray="4 4" opacity="0.6" />
            <motion.circle 
              cx="50" cy="50" r="30" 
              stroke="var(--color-cyan)" strokeWidth="2"
              strokeDasharray="0.1 60" strokeLinecap="round"
              animate={{ rotate: -360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              style={{ originX: "50px", originY: "50px" }}
            />

            {/* Órbita 3 e Planeta 3 com Lua orbitando ele */}
            <circle cx="50" cy="50" r="44" strokeDasharray="6 4" opacity="0.4" />
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              style={{ originX: "50px", originY: "50px" }}
            >
              {/* Planeta 3 */}
              <circle cx="94" cy="50" r="2.5" fill="var(--color-pink)" />
              {/* Órbita da lua do Planeta 3 */}
              <circle cx="94" cy="50" r="5" stroke="currentColor" strokeWidth="0.25" strokeDasharray="1 1" opacity="0.5" />
              <motion.circle
                cx="94" cy="50" r="5"
                stroke="white" strokeWidth="0.75"
                strokeDasharray="0.1 10"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{ originX: "94px", originY: "50px" }}
              />
            </motion.g>
          </svg>
        </motion.div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          
          <motion.div style={{ opacity: exitOpacity, scale: exitScale }} className="flex-1 space-y-8">
            <div ref={titleRef} className="relative">
              {/* Texto de fundo gigante, revela progressivamente conforme o scroll passa pela seção */}
              <motion.div
                style={{ clipPath: bgTextClip }}
                className="absolute -top-4 md:-top-14 left-0 text-[12vw] md:text-[7vw] font-black text-white/5 leading-none whitespace-nowrap pointer-events-none select-none -z-10 overflow-hidden"
                aria-hidden="true"
              >
                SOBRE MIM
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 1.2, rotateX: -45 }}
                whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, type: "spring" }}
              >
                <h2 className="fs-h1 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500 mb-6 tracking-tight max-w-full">
                  <LetterReveal text="Sobre mim" />
                </h2>
              </motion.div>
            </div>

            <div className="space-y-6 text-[var(--text-secondary)] text-base sm:text-xl leading-relaxed">
              <TextReveal text="Sou desenvolvedor e curso Engenharia de Software na Uniasselvi e Ciência de Dados na Fatec, o que me deu uma base técnica sólida e multidisciplinar para arquitetar sistemas web responsivos e experiências digitais de alto impacto. Minha atuação vai muito além da interface visual." />
              <TextReveal text="Gosto de unir performance de código, inteligência na estruturação de dados e um design imersivo. Estou sempre evoluindo tecnicamente, e meu foco é dominar a engenharia de ponta a ponta pra construir ecossistemas robustos, escaláveis e inteligentes como Desenvolvedor Full-Stack." />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                Chega de sistemas <span className="text-[var(--foreground)] font-semibold">obsoletos</span> — eu construo o que sua empresa vai precisar nos próximos 10 anos.
              </motion.p>
            </div>
          </motion.div>

          <div className="flex-1 w-full relative z-10">
            <CosmicFolder />
          </div>
        </div>
      </div>
    </section>
  );
}
