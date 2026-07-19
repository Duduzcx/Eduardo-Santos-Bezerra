"use client";

import { motion } from "framer-motion";
import { PenTool, Code2, Rocket } from "lucide-react";

export default function Methodology() {
  const steps = [
    {
      num: "1",
      icon: <PenTool className="w-8 h-8 text-orange-500" />,
      color: "border-orange-500/30 bg-orange-500/10",
      text: "Criar projetos personalizados em menos de 20 minutos usando ferramentas gratuitas."
    },
    {
      num: "2",
      icon: <Code2 className="w-8 h-8 text-blue-500" />,
      color: "border-blue-500/30 bg-blue-500/10",
      text: "Desenvolver animações complexas e micro-interações sem escrever milhares de linhas de código."
    },
    {
      num: "3",
      icon: <Rocket className="w-8 h-8 text-purple-500" />,
      color: "border-purple-500/30 bg-purple-500/10",
      text: "Prospectar clientes de alto ticket usando abordagens automatizadas validadas pelo mercado."
    }
  ];

  return (
    <section id="metodo" className="w-full py-24 bg-[#080808] relative z-10 border-t border-neutral-800">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/30 mb-6"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-500">
              <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
            </svg>
            <span className="text-sm text-blue-400 font-bold tracking-widest">O MÉTODO</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white tracking-tight"
          >
            Com esse método, nas próximas semanas você vai:
          </motion.h2>
        </div>

        {/* Grid de Passos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative p-8 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-neutral-600 transition-colors flex flex-col items-center text-center group"
            >
              {/* Número Gigante Absoluto */}
              <span className="absolute -top-6 -left-4 text-8xl font-black text-white/5 select-none pointer-events-none group-hover:text-white/10 transition-colors">
                {step.num}
              </span>

              <div className={`w-16 h-16 rounded-xl flex items-center justify-center border ${step.color} mb-6`}>
                {step.icon}
              </div>
              
              <p className="text-neutral-300 text-lg leading-relaxed font-light">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
