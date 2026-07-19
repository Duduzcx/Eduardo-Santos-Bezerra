"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import LetterReveal from "./LetterReveal";

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Arquitetura de Banco de Dados",
    desc: "Estruturação escalável, normalização e modelagem relacional rigorosa focada em queries de alta performance.",
  },
  {
    num: "02",
    title: "Lógica de Back-end",
    desc: "Desenvolvimento de microsserviços robustos, segurança de endpoints e regras de negócio complexas processadas em milissegundos.",
  },
  {
    num: "03",
    title: "Integração de APIs Físicas",
    desc: "Conectando o código à realidade: telemetria, sensores IoT e sincronização de dados bi-direcional em tempo real.",
  },
  {
    num: "04",
    title: "UI/UX de Alta Conversão",
    desc: "A camada final onde a engenharia encontra a arte. Animações de GPU, design responsivo de ponta e retenção visceral.",
  }
];

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"]
  });

  return (
    <section ref={containerRef} className="relative w-full py-40 z-20 bg-neutral-950/60 backdrop-blur-md border-t border-neutral-900/50">
      <div className="px-6 md:px-12 lg:px-24 mb-32 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end">
        <div>
          <h2 className="text-neutral-500 uppercase tracking-widest text-xs font-medium" data-magnetic>
            <LetterReveal text="O Processo" />
          </h2>
          <p className="mt-4 text-3xl md:text-5xl font-light text-neutral-300 tracking-tight">
            Engenharia de Ponta a Ponta
          </p>
        </div>
        <p className="mt-6 md:mt-0 text-neutral-500 max-w-sm text-sm font-light leading-relaxed">
          Nenhuma etapa é subestimada. Do bit armazenado no banco à física do cursor na tela, o controle arquitetural é absoluto.
        </p>
      </div>

      <div className="flex flex-col w-full max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
        {PROCESS_STEPS.map((step, index) => {
          // Cada etapa aparece um pouco depois, dependendo do scroll global
          const opacity = useTransform(
            scrollYProgress, 
            [0 + (index * 0.15), 0.3 + (index * 0.15)], 
            [0, 1]
          );
          
          const y = useTransform(
            scrollYProgress,
            [0 + (index * 0.15), 0.3 + (index * 0.15)],
            [40, 0]
          );

          return (
            <motion.div 
              key={index}
              style={{ opacity, y }}
              className="group flex flex-col md:flex-row border-b border-neutral-800 py-12 md:py-16 items-start md:items-center relative"
            >
              {/* Linha de preenchimento (Glow no Hover) */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

              <div className="text-5xl md:text-7xl font-bold text-neutral-800 group-hover:text-neutral-600 transition-colors duration-700 md:w-1/4 mb-6 md:mb-0">
                {step.num}
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl md:text-4xl font-medium text-neutral-200 group-hover:text-white transition-colors duration-500 tracking-tight mb-4">
                  {step.title}
                </h3>
                <p className="text-neutral-500 group-hover:text-neutral-400 font-light text-sm md:text-base max-w-2xl leading-relaxed transition-colors duration-500">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
