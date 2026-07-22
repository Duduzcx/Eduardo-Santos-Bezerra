"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ImageOff } from "lucide-react";

const PROJECTS = [
  { name: "Plataforma Compromisso", category: "EdTech · Plataforma", desc: "Ambiente educacional com gestão de jornadas, indicadores e uma experiência simples para equipes e alunos.", tags: ["Next.js", "TypeScript", "Dashboard"], image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop", status: "Projeto desenvolvido" },
  { name: "ZcxPages", category: "Portfólio · Web", desc: "Portfólio editorial de alta performance, estruturado para apresentar trabalhos e gerar novas oportunidades.", tags: ["Next.js", "Motion", "UX"], image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop", status: "Projeto desenvolvido" },
  { name: "Orbe Finance", category: "Fintech · Conceito", desc: "Painel de controle financeiro para pequenas empresas, com visão de caixa, metas e decisões do dia a dia.", tags: ["React", "Data viz", "UI System"], image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop", status: "Projeto conceitual" },
  { name: "Verde Campo", category: "Agro · Conceito", desc: "Central de acompanhamento de operações agrícolas com alertas claros e dados de campo em tempo real.", tags: ["IoT", "Node.js", "Analytics"], image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1200&auto=format&fit=crop", status: "Projeto conceitual" },
  { name: "Nexo Saúde", category: "Healthtech · Conceito", desc: "Portal de acompanhamento para clínicas e pacientes, desenhado para reduzir atrito em cada etapa do cuidado.", tags: ["Next.js", "Acessibilidade", "UX"], image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop", status: "Projeto conceitual" },
];

type Project = (typeof PROJECTS)[number];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start 95%", "start 55%"] });
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [6, 0]);
  const imageY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const [imageFailed, setImageFailed] = useState(false);
  const [forceReveal, setForceReveal] = useState(false);
  const featured = index === 0;

  useEffect(() => {
    const timer = setTimeout(() => setForceReveal(true), 900 + index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <motion.article
      ref={cardRef}
      style={{ y, scale, rotateX, transformPerspective: 1200 }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      animate={forceReveal ? { opacity: 1 } : undefined}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
      className={featured ? "md:col-span-2" : ""}
    >
      <motion.div whileHover={{ y: -10, transition: { duration: 0.25 } }} className="group relative h-full overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--color-surface)]/40 shadow-[0_24px_70px_rgba(0,0,0,0.18)] transition-colors hover:border-[var(--color-cyan)]/40">
        <div className="absolute -right-20 -top-24 h-48 w-48 rounded-full bg-[var(--color-cyan)]/10 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <div className={`grid h-full ${featured ? "md:grid-cols-[1.15fr_0.85fr]" : "grid-cols-1"}`}>
          <div className={`relative overflow-hidden bg-gradient-to-br from-[var(--color-accent)]/25 to-[var(--color-cyan)]/15 ${featured ? "aspect-[16/9] md:aspect-auto" : "aspect-[16/9]"}`}>
            {imageFailed ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-neutral-500">
                <ImageOff className="h-6 w-6" />
                <span className="text-xs">{project.name}</span>
              </div>
            ) : (
              <motion.img
                src={project.image}
                alt=""
                style={{ y: imageY }}
                onError={() => setImageFailed(true)}
                className="h-full w-full object-cover opacity-95 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-alt)] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-accent)]/20 via-transparent to-[var(--color-cyan)]/15 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
          <div className="relative z-10 flex flex-col items-start p-6 md:p-8">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">{project.category}</span>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">{project.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">{project.desc}</p>
            <div className="mt-6 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="rounded-full border border-[var(--border-subtle)] px-3 py-1 text-xs text-[var(--text-secondary)] transition-colors duration-300 group-hover:border-[var(--color-cyan)]/50">{tag}</span>)}</div>
            <div className="mt-7 flex items-center gap-2 text-sm font-medium text-[var(--foreground)]"><span>{project.status}</span><ArrowUpRight className="h-4 w-4 text-[var(--color-cyan)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" /></div>
          </div>
        </div>
      </motion.div>
    </motion.article>
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
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mb-16 max-w-2xl md:mb-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-cyan)]">Projetos selecionados</p>
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-5xl">Produtos digitais que resolvem problemas reais.</h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">Role para explorar: cada projeto se aproxima e ganha profundidade conforme entra em cena.</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">{PROJECTS.map((project, index) => <ProjectCard key={project.name} project={project} index={index} />)}</div>
      </div>
    </section>
  );
}
