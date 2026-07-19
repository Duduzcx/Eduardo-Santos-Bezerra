"use client";

import { motion } from "framer-motion";
import { GithubIcon } from "./Icons";
import LetterReveal from "./LetterReveal";
import { ExternalLink } from "lucide-react";

const PROJECTS = [
  { 
    name: "Plataforma Compromisso", 
    desc: "Plataforma educacional EdTech de alta performance. Sistema de gestão com dashboard analítico.",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    tags: ["React", "Next.js", "TypeScript"],
    repo: "https://github.com",
    live: "https://example.com",
    highlight: "Desenvolvido por mim"
  },
  { 
    name: "ZcxPages", 
    desc: "Portfólio moderno focado em exibir projetos com design de ponta e altíssima performance.",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
    tags: ["Next.js", "Framer Motion"],
    repo: "https://github.com",
    live: "https://example.com"
  }
];

export default function Projects() {
  return (
    <section id="projects" className="w-full py-32 bg-[#050505] relative overflow-hidden">
      
      {/* Objeto de Fundo Flutuante (Texto gigante transparente, estilo Thor) */}
      <motion.div 
        initial={{ x: "100%" }}
        whileInView={{ x: "-100%" }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        className="absolute top-10 left-0 text-[20vw] font-black text-white/5 whitespace-nowrap pointer-events-none select-none"
      >
        LATEST WORK &bull; LATEST WORK &bull; LATEST WORK
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-7xl font-black text-white mb-4">
            <LetterReveal text="Projetos " />
            <LetterReveal text="Destaque" className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-pink)]" />
          </h2>
        </motion.div>

        <div className="flex flex-col gap-32">
          {PROJECTS.map((project, idx) => {
            const isReverse = idx % 2 !== 0;
            return (
              <div key={idx} className={`flex flex-col ${isReverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center relative`}>
                
                {/* Imagem vem de um lado rasgando a tela */}
                <motion.div 
                  initial={{ opacity: 0, x: isReverse ? 150 : -150, rotateY: isReverse ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ perspective: "1000px" }}
                  className="w-full md:w-1/2 relative group"
                >
                  <div className="relative rounded-3xl overflow-hidden border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    <img src={project.img} alt={project.name} className="w-full aspect-video object-cover group-hover:scale-110 group-hover:rotate-2 transition-all duration-700" />
                  </div>
                  
                  {/* Círculo giratório atrás da imagem */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-cyan)] opacity-20 blur-2xl rounded-full animate-[spin_10s_linear_infinite] z-0" />
                </motion.div>

                {/* Texto vem do lado oposto */}
                <motion.div 
                  initial={{ opacity: 0, x: isReverse ? -100 : 100, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`w-full md:w-1/2 flex flex-col ${isReverse ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} z-30`}
                >
                  {project.highlight && (
                    <span className="px-4 py-1 rounded-full border border-[var(--color-cyan)] text-[var(--color-cyan)] text-xs font-mono mb-4 uppercase tracking-wider font-bold">
                      {project.highlight}
                    </span>
                  )}
                  
                  <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
                    {project.name}
                  </h3>
                  
                  <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
                    {project.desc}
                  </p>

                  <div className={`flex flex-wrap gap-4 mb-10 ${isReverse ? 'justify-end' : 'justify-start'}`}>
                    {project.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-sm font-mono text-white bg-white/10 px-4 py-2 rounded-lg border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className={`flex items-center gap-6 ${isReverse ? 'justify-end' : 'justify-start'}`}>
                    <a href={project.repo} target="_blank" className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all">
                      <GithubIcon className="w-6 h-6" />
                    </a>
                    <a href={project.live} target="_blank" className="p-4 rounded-full bg-[var(--color-accent)] text-white hover:scale-110 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                      <ExternalLink className="w-6 h-6" />
                    </a>
                  </div>
                </motion.div>

              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
