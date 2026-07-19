"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import Scene from "./Scene";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export default function Contact() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");

  function openWhatsApp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!WHATSAPP_NUMBER) {
      setNotice("O número do WhatsApp ainda precisa ser configurado.");
      return;
    }
    const text = `Olá, Eduardo! Meu nome é ${name || ""}. ${message || "Gostaria de conversar sobre um projeto."}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="contact" className="relative w-full py-24 md:py-32 px-6 bg-neutral-950 border-t border-white/[0.06] overflow-hidden">
      {/* Objeto 3D em loop, estilo Thor, atrás do formulário */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <Scene color="#67e8f9" opacity={0.3} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
        <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-cyan)] font-semibold">Vamos conversar</p>
          <h2 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.02] text-white">Tem um projeto em mente?</h2>
          <p className="mt-6 max-w-md text-base md:text-lg leading-relaxed text-neutral-400">Conte um pouco sobre o desafio. A conversa continua diretamente no WhatsApp, de forma rápida e sem compromisso.</p>
          <div className="mt-9 flex items-center gap-3 text-sm text-neutral-300"><MessageCircle className="w-5 h-5 text-[#25D366]" /> Atendimento pelo WhatsApp</div>
        </motion.div>

        <motion.form initial={{ opacity: 0, x: 28, scale: 0.98 }} whileInView={{ opacity: 1, x: 0, scale: 1 }} whileHover={{ y: -4 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} onSubmit={openWhatsApp} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="block text-sm text-neutral-300">Seu nome
              <input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Como podemos te chamar?" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-neutral-600 outline-none focus:border-[var(--color-cyan)] transition-colors" />
            </label>
            <label className="block text-sm text-neutral-300">Empresa <span className="text-neutral-600">(opcional)</span>
              <input placeholder="Nome da empresa" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-neutral-600 outline-none focus:border-[var(--color-cyan)] transition-colors" />
            </label>
          </div>
          <label className="block mt-5 text-sm text-neutral-300">Sobre o projeto
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} required rows={5} placeholder="O que você precisa construir ou melhorar?" className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-neutral-600 outline-none focus:border-[var(--color-cyan)] transition-colors" />
          </label>
          <button type="submit" className="mt-6 w-full rounded-xl bg-[#25D366] px-5 py-4 text-sm font-semibold text-[#07130b] hover:bg-[#37e477] transition-colors flex items-center justify-center gap-2">Iniciar conversa no WhatsApp <ArrowUpRight className="w-4 h-4" /></button>
          {notice && <p role="status" className="mt-3 text-sm text-amber-300">{notice}</p>}
        </motion.form>
      </div>
      <footer className="relative z-10 max-w-6xl mx-auto mt-20 pt-6 border-t border-white/[0.06] text-sm text-neutral-600">© {new Date().getFullYear()} Eduardo Santos Bezerra. Todos os direitos reservados.</footer>
    </section>
  );
}
