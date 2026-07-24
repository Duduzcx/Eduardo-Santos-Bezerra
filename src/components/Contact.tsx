"use client";

import { FormEvent, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export default function Contact() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: exitProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const exitOpacity = useTransform(exitProgress, [0.75, 1], [1, 0]);

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
    <section ref={sectionRef} id="contact" className="relative w-full py-24 md:py-32 px-6 bg-[var(--background)] border-t border-[var(--border-subtle)] overflow-hidden transition-colors duration-500">
      {/* Constelação de fundo que se desenha ao entrar em cena */}
      <motion.div
        style={{ opacity: exitOpacity }}
        className="absolute right-[5vw] bottom-[5vh] w-[350px] h-[350px] pointer-events-none z-0 text-[var(--color-cyan)]/20 hidden md:block"
      >
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="0.5">
          {/* Linhas da constelação */}
          <motion.path
            d="M 10,20 L 30,40 L 50,30 L 70,55 L 90,45 M 50,30 L 60,80 L 80,70"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
          {/* Estrela 1 */}
          <motion.circle cx="10" cy="20" r="1.5" fill="currentColor"
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Estrela 2 */}
          <motion.circle cx="30" cy="40" r="1.5" fill="currentColor"
            animate={{ scale: [1.5, 1, 1.5], opacity: [0.9, 0.3, 0.9] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Estrela 3 */}
          <motion.circle cx="50" cy="30" r="2" fill="currentColor"
            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Estrela 4 */}
          <motion.circle cx="70" cy="55" r="1.5" fill="currentColor"
            animate={{ scale: [1.3, 0.8, 1.3], opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Estrela 5 */}
          <motion.circle cx="90" cy="45" r="2.5" fill="white"
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Estrela 6 */}
          <motion.circle cx="60" cy="80" r="1.5" fill="currentColor"
            animate={{ scale: [1.5, 1, 1.5], opacity: [0.9, 0.3, 0.9] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Estrela 7 */}
          <motion.circle cx="80" cy="70" r="2" fill="currentColor"
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
        <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-cyan)] font-semibold">Vamos conversar</p>
          <h2 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.02] text-[var(--foreground)]">Tem um projeto em mente?</h2>
          <p className="mt-6 max-w-md text-base md:text-lg leading-relaxed text-[var(--text-secondary)]">Conte um pouco sobre o desafio. A conversa continua diretamente no WhatsApp, de forma rápida e sem compromisso.</p>
          <div className="mt-9 flex items-center gap-3 text-sm text-[var(--text-secondary)]"><MessageCircle className="w-5 h-5 text-[#25D366]" /> Atendimento pelo WhatsApp</div>
        </motion.div>

        <motion.form initial={{ opacity: 0, x: 28, scale: 0.98 }} whileInView={{ opacity: 1, x: 0, scale: 1 }} whileHover={{ y: -4 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} onSubmit={openWhatsApp} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--color-surface)]/60 p-6 md:p-8">
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="block text-sm text-[var(--text-secondary)]">Seu nome
              <input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Como podemos te chamar?" className="mt-2 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--background)]/40 px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-[var(--color-cyan)] transition-colors" />
            </label>
            <label className="block text-sm text-[var(--text-secondary)]">Empresa <span className="text-[var(--text-tertiary)]">(opcional)</span>
              <input placeholder="Nome da empresa" className="mt-2 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--background)]/40 px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-[var(--color-cyan)] transition-colors" />
            </label>
          </div>
          <label className="block mt-5 text-sm text-[var(--text-secondary)]">Sobre o projeto
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} required rows={5} placeholder="O que você precisa construir ou melhorar?" className="mt-2 w-full resize-none rounded-xl border border-[var(--border-subtle)] bg-[var(--background)]/40 px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-[var(--color-cyan)] transition-colors" />
          </label>
          <button type="submit" className="mt-6 w-full rounded-xl bg-[#25D366] px-5 py-4 text-sm font-semibold text-[#07130b] hover:bg-[#37e477] transition-colors flex items-center justify-center gap-2">Iniciar conversa no WhatsApp <ArrowUpRight className="w-4 h-4" /></button>
          {notice && <p role="status" className="mt-3 text-sm text-amber-300">{notice}</p>}
        </motion.form>
      </div>
      <footer className="relative z-10 max-w-6xl mx-auto mt-20 pt-6 border-t border-[var(--border-subtle)] text-sm text-[var(--text-tertiary)]">
        © {new Date().getFullYear()} Eduardo Santos Bezerra. Todos os direitos reservados.
        <span className="block mt-1 text-xs opacity-70">Modelo 3D &quot;Astronaut&quot; do projeto google/model-viewer, licença Apache 2.0.</span>
      </footer>
    </section>
  );
}
