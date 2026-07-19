"use client";

import { motion } from "framer-motion";
import LetterReveal from "./LetterReveal";
import { 
  FileCode2, 
  Database, 
  Smartphone, 
  Terminal, 
  Server, 
  Layout, 
  Code,
  Layers
} from "lucide-react";

const SKILLS = [
  { name: "Next.js", icon: <Layout strokeWidth={1.5} className="w-8 h-8" />, color: "text-white", bg: "bg-white/10 border-white/20" },
  { name: "React", icon: <Code strokeWidth={1.5} className="w-8 h-8" />, color: "text-[#61DAFB]", bg: "bg-[#61DAFB]/10 border-[#61DAFB]/20" },
  { name: "TypeScript", icon: <FileCode2 strokeWidth={1.5} className="w-8 h-8" />, color: "text-[#3178C6]", bg: "bg-[#3178C6]/10 border-[#3178C6]/20" },
  { name: "Node.js", icon: <Server strokeWidth={1.5} className="w-8 h-8" />, color: "text-[#339933]", bg: "bg-[#339933]/10 border-[#339933]/20" },
  { name: "Python", icon: <Terminal strokeWidth={1.5} className="w-8 h-8" />, color: "text-[#3776AB]", bg: "bg-[#3776AB]/10 border-[#3776AB]/20" },
  { name: "PostgreSQL", icon: <Database strokeWidth={1.5} className="w-8 h-8" />, color: "text-[#4169E1]", bg: "bg-[#4169E1]/10 border-[#4169E1]/20" },
  { name: "Tailwind CSS", icon: <Layers strokeWidth={1.5} className="w-8 h-8" />, color: "text-[#06B6D4]", bg: "bg-[#06B6D4]/10 border-[#06B6D4]/20" },
  { name: "React Native", icon: <Smartphone strokeWidth={1.5} className="w-8 h-8" />, color: "text-[#61DAFB]", bg: "bg-[#61DAFB]/10 border-[#61DAFB]/20" },
];

export default function Skills() {
  return (
    <section id="skills" className="w-full py-32 bg-[#0a0814] relative overflow-hidden">
      
      {/* Objeto 3D "Fake" Flutuante girando loucamente no fundo */}
      <motion.div 
        animate={{ rotateZ: 360, rotateX: 360, rotateY: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute right-[-10%] top-[30%] w-[50vw] h-[50vw] border border-[var(--color-pink)]/10 rounded-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ rotateZ: -360, rotateX: -360, rotateY: 180 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute right-[-5%] top-[20%] w-[40vw] h-[40vw] border border-[var(--color-cyan)]/10 rounded-full pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            <LetterReveal text="Stack " />
            <LetterReveal text="Principal" className="text-[var(--color-cyan)]" />
          </h2>
        </motion.div>

        {/* Animação nova: Cada card não vem de baixo, mas gira em X (estilo moeda caindo) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {SKILLS.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, rotateX: 90, scale: 0.8 }}
              whileInView={{ opacity: 1, rotateX: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1, type: "spring", bounce: 0.5 }}
              whileHover={{ scale: 1.1, y: -10 }}
              className={`group flex flex-col items-center justify-center p-8 bg-[var(--color-surface)] border border-neutral-800 rounded-3xl transition-all cursor-pointer shadow-lg hover:border-transparent relative overflow-hidden`}
            >
              {/* Overlay com a cor original da tech no fundo quando dá hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${skill.bg}`} />
              
              <div className={`text-neutral-500 transition-colors duration-300 mb-4 group-hover:${skill.color} relative z-10`}>
                {skill.icon}
              </div>
              <span className={`text-neutral-400 font-medium group-hover:${skill.color} transition-colors relative z-10`}>
                {skill.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
