"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ImageOff } from "lucide-react";

const REAL_PROJECTS = [
  { name: "Plataforma Compromisso", url: "https://compromissose.com", category: "Ecossistema · Produção", desc: "Projeto de maior escala estrutural: arquitetura de banco de dados, gerenciamento de dados e lógica de negócio real por trás de cada tela.", tags: ["Next.js", "TypeScript", "Dados"], image: "/projects/compromisso.jpg", status: "compromissose.com" },
  { name: "Estética Automotiva", url: "https://esteticaau.netlify.app", category: "Ecossistema · Nicho de mercado", desc: "Responsividade e entrega de valor real para um nicho específico — do agendamento à apresentação do serviço.", tags: ["React", "Responsivo", "UX"], image: "/projects/estetica.jpg", status: "esteticaau.netlify.app" },
];

const CONCEPT_PROJECTS = [
  { name: "Sabor Nordestino", url: "https://sabornordestino.netlify.app", category: "UI/UX · Estudo de caso", desc: "Layout moderno e responsivo pensado pro setor gastronômico regional.", tags: ["UI/UX", "Responsivo"], image: "/projects/sabor.jpg", status: "sabornordestino.netlify.app" },
  { name: "Advocacia S.A", url: "https://advocaciasa.netlify.app", category: "UI/UX · Estudo de caso", desc: "Interface institucional, sóbria e responsiva, pra um escritório de advocacia.", tags: ["UI/UX", "Institucional"], image: "/projects/advocacia.jpg", status: "advocaciasa.netlify.app" },
  { name: "Dar Semijoias", url: "https://darsemijoias.netlify.app", category: "UI/UX · Estudo de caso", desc: "E-commerce visual pra semijoias, com foco em apresentação de produto.", tags: ["UI/UX", "E-commerce"], image: "/projects/semijoias.jpg", status: "darsemijoias.netlify.app" },
];

type Project = (typeof REAL_PROJECTS)[number];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start 95%", "start 55%"] });
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [6, 0]);
  const imageY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const [imageFailed, setImageFailed] = useState(false);
  const [forceReveal, setForceReveal] = useState(false);

  // Saída "sink 3D": quando o card passa pelo topo, cai pra trás no fundo escuro (rotateX + encolhe + some) — scroll separado da entrada
  const { scrollYProgress: exitProgress } = useScroll({ target: cardRef, offset: ["start start", "end start"] });
  const exitRotateX = useTransform(exitProgress, [0.5, 1], [0, 15]);
  const exitScale = useTransform(exitProgress, [0.5, 1], [1, 0.8]);
  const exitOpacity = useTransform(exitProgress, [0.5, 1], [1, 0]);

  useEffect(() => {
    const timer = setTimeout(() => setForceReveal(true), 900 + index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <motion.div style={{ opacity: exitOpacity, scale: exitScale, rotateX: exitRotateX, transformPerspective: 1000 }}>
    <motion.article
      ref={cardRef}
      style={{ y, scale, rotateX, transformPerspective: 1200 }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      animate={forceReveal ? { opacity: 1 } : undefined}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.a href={project.url} target="_blank" rel="noopener noreferrer" whileHover={{ y: -10, transition: { duration: 0.25 } }} className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--color-surface)]/40 shadow-[0_24px_70px_rgba(0,0,0,0.18)] transition-colors hover:border-[var(--color-cyan)]/40">
        <div className="absolute -right-20 -top-24 h-48 w-48 rounded-full bg-[var(--color-cyan)]/10 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <div className="flex h-full flex-col">
          <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[var(--color-accent)]/25 to-[var(--color-cyan)]/15">
            {imageFailed ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-neutral-500">
                <ImageOff className="h-6 w-6" />
                <span className="text-xs">{project.name}</span>
              </div>
            ) : (
              <motion.img
                src={project.image}
                alt=""
                loading="lazy"
                decoding="async"
                style={{ y: imageY }}
                onError={() => setImageFailed(true)}
                className="h-full w-full object-cover opacity-95 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-alt)] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-accent)]/20 via-transparent to-[var(--color-cyan)]/15 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
          <div className="relative z-10 flex flex-1 flex-col items-start p-6 md:p-8">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">{project.category}</span>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">{project.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">{project.desc}</p>
            <div className="mt-6 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="rounded-full border border-[var(--border-subtle)] px-3 py-1 text-xs text-[var(--text-secondary)] transition-colors duration-300 group-hover:border-[var(--color-cyan)]/50">{tag}</span>)}</div>
            <div className="mt-auto pt-7 flex items-center gap-2 text-sm font-medium text-[var(--foreground)]"><span>{project.status}</span><ArrowUpRight className="h-4 w-4 text-[var(--color-cyan)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" /></div>
          </div>
        </div>
      </motion.a>
    </motion.article>
    </motion.div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], [160, -180]);
  const sceneRotate = useTransform(scrollYProgress, [0, 1], [-18, 24]);

  return (
    <section ref={sectionRef} id="projects" className="relative w-full overflow-hidden border-y border-[var(--border-subtle)] bg-[var(--background-alt)] py-28 md:py-40 transition-colors duration-500">
      <motion.div aria-hidden="true" style={{ y: sceneY, rotate: sceneRotate }} className="pointer-events-none absolute right-[-16vw] top-[16%] h-[48vw] w-[48vw] rounded-full border border-[var(--color-cyan)]/20 shadow-[0_0_100px_rgba(103,232,249,0.07)]" />
      <motion.div aria-hidden="true" style={{ y: sceneY }} className="pointer-events-none absolute left-[-18vw] top-[42%] h-[38vw] w-[38vw] rounded-[3rem] border border-[var(--color-pink)]/10" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.5 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mb-16 max-w-2xl md:mb-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-cyan)]">Meus projetos</p>
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-5xl">Produtos digitais que resolvem problemas reais.</h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">Role para explorar: cada projeto se aproxima e ganha profundidade conforme entra em cena.</p>
        </motion.div>
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">Ecossistemas e projetos reais</p>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">{REAL_PROJECTS.map((project, index) => <ProjectCard key={project.name} project={project} index={index} />)}</div>

        <p className="mb-6 mt-20 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">Conceitos de interface e UI/UX</p>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">{CONCEPT_PROJECTS.map((project, index) => <ProjectCard key={project.name} project={project} index={index} />)}</div>
      </div>
    </section>
  );
}
