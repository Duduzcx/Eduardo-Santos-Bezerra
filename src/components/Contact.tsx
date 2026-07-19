"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import LetterReveal from "./LetterReveal";

// SVGs customizados para substituir os ícones removidos pelo Lucide
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="-2 -2 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.62-.4 7.5-1.81 7.5-8.18a5.4 5.4 0 0 0-1.54-4 5.4 5.4 0 0 0-.15-3.93s-1.25-.4-4 1.44a12.9 12.9 0 0 0-7 0C6.25 1.5 5 1.9 5 1.9a5.4 5.4 0 0 0-.15 3.93 5.4 5.4 0 0 0-1.54 4c0 6.36 3.87 7.78 7.5 8.18a4.8 4.8 0 0 0-1 3.02v4" />
      <path d="M9 20a5.5 5.5 0 0 1-5-3" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function Contact() {
  return (
    <section className="w-full min-h-screen bg-neutral-950 flex flex-col justify-between pt-32 pb-12 px-6 md:px-24 border-t border-neutral-900 relative z-20">
      
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-neutral-500 uppercase tracking-widest text-sm mb-12" data-magnetic>
          <LetterReveal text="Contato" />
        </h2>
        
        <div className="overflow-hidden">
          <motion.h1 
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] text-white max-w-5xl"
          >
            Vamos construir o futuro juntos.
          </motion.h1>
        </div>

        <div className="mt-20 flex flex-col md:flex-row gap-12 md:gap-24">
          <a 
            href="mailto:seu-email@exemplo.com" 
            className="group flex items-center gap-4 text-2xl md:text-4xl text-neutral-400 hover:text-white transition-colors duration-300"
            data-magnetic
          >
            <Mail className="w-8 h-8 md:w-12 md:h-12 group-hover:scale-110 transition-transform duration-300" />
            <span>E-mail</span>
          </a>
          
          <a 
            href="https://linkedin.com/in/seulinkedin" 
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 text-2xl md:text-4xl text-neutral-400 hover:text-white transition-colors duration-300"
            data-magnetic
          >
            <LinkedinIcon className="w-8 h-8 md:w-12 md:h-12 group-hover:scale-110 transition-transform duration-300" />
            <span>LinkedIn</span>
          </a>
          
          <a 
            href="https://github.com/seugithub" 
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 text-2xl md:text-4xl text-neutral-400 hover:text-white transition-colors duration-300"
            data-magnetic
          >
            <GithubIcon className="w-8 h-8 md:w-12 md:h-12 group-hover:scale-110 transition-transform duration-300" />
            <span>GitHub</span>
          </a>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mt-24 text-neutral-600 text-sm font-light">
        <p>© {new Date().getFullYear()} Eduardo Santos Bezerra.</p>
        <p>Projetado para inércia e fluidez.</p>
      </div>
    </section>
  );
}
