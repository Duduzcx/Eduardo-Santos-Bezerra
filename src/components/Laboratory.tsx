"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import LetterReveal from "./LetterReveal";
import Scene from "./Scene";
import { Activity, Box, Variable, Cpu } from "lucide-react";

// Um Card do Bento Grid com efeitos físicos insanos no Hover
function BentoCard({ 
  title, 
  desc, 
  icon, 
  className, 
  image 
}: { 
  title: string, 
  desc: string, 
  icon: React.ReactNode, 
  className: string, 
  image?: string 
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 100 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);
  const imageScale = useTransform(mouseX, [-0.5, 0.5], [1.1, 1.2]); // Zoom dinâmico
  const imageX = useTransform(mouseX, [-0.5, 0.5], ["-5%", "5%"]);
  const imageY = useTransform(mouseY, [-0.5, 0.5], ["-5%", "5%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015, zIndex: 10 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      className={`relative group overflow-hidden rounded-3xl bg-neutral-900 border border-white/[0.05] p-8 md:p-12 flex flex-col justify-end cursor-pointer shadow-2xl ${className}`}
      data-magnetic
    >
      {/* Background Image / Noise com Parallax no Mouse */}
      {image && (
        <motion.div 
          className="absolute inset-0 z-0 opacity-40 group-hover:opacity-70 transition-opacity duration-700"
          style={{ 
            scale: imageScale,
            x: imageX,
            y: imageY
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/60 to-transparent z-10" />
          <img src={image} alt={title} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
        </motion.div>
      )}

      {/* Conteúdo levantado em 3D */}
      <motion.div 
        style={{ transform: "translateZ(60px)" }} 
        className="relative z-20 flex flex-col gap-4 mt-32"
      >
        <div className="text-white bg-white/10 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 mb-2 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
          {icon}
        </div>
        <h3 className="text-2xl md:text-4xl font-medium tracking-tight text-white leading-tight">
          {title}
        </h3>
        <p className="text-neutral-400 font-light text-base md:text-lg max-w-sm">
          {desc}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function Laboratory() {
  return (
    <section className="relative w-full py-40 z-20 bg-neutral-950 overflow-hidden">
      {/* Objeto 3D em loop, estilo Thor, bem sutil no fundo da seção */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
        <Scene color="#7c3aed" opacity={0.4} />
      </div>

      <div className="px-6 md:px-12 lg:px-24 mb-20 max-w-[1600px] mx-auto text-center md:text-left relative z-10">
        <h2 className="text-neutral-500 uppercase tracking-widest text-xs font-medium" data-magnetic>
          <LetterReveal text="Laboratório & Explorações" />
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mt-4 text-3xl md:text-4xl font-light text-neutral-300 tracking-tight"
        >
          Onde a engenharia vira arte.
        </motion.p>
      </div>

      {/* O Bento Grid Distorcido */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 auto-rows-[450px] gap-6 md:gap-8 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto" style={{ perspective: "2000px" }}>
        
        {/* Card 1: 3D Modeling (Gigante) */}
        <BentoCard 
          className="md:col-span-8"
          title="Modelagem e Renderização 3D"
          desc="Criação de ambientes virtuais e peças funcionais para impressão 3D (Autodesk Maya, Cults 3D). Elevando o design físico e digital."
          icon={<Box className="w-8 h-8" />}
          image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop"
        />

        {/* Card 2: Algorithms (Pequeno/Alto) */}
        <BentoCard 
          className="md:col-span-4"
          title="Modelos Preditivos"
          desc="Estruturação de algoritmos, cálculos de probabilidade e avaliação de odds complexos para análise massiva de dados esportivos."
          icon={<Activity className="w-8 h-8" />}
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
        />

        {/* Card 3: Experimentos Físicos */}
        <BentoCard 
          className="md:col-span-5"
          title="Microcontroladores & IoT"
          desc="Integração de hardware e software através de ESP32 e C++, unindo o plano físico aos serviços cloud."
          icon={<Cpu className="w-8 h-8" />}
          image="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=2069&auto=format&fit=crop"
        />

        {/* Card 4: Abstract Mathematics */}
        <BentoCard 
          className="md:col-span-7 bg-gradient-to-br from-neutral-900 to-neutral-950"
          title="Engenharia de Dados"
          desc="Processamento de Big Data e pipelines escaláveis para arquiteturas orientadas a eventos e tomada de decisão em tempo real."
          icon={<Variable className="w-8 h-8" />}
          image="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2070&auto=format&fit=crop"
        />
        
      </div>
    </section>
  );
}
