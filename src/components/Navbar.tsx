"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GithubIcon, LinkedinIcon } from "./Icons";
import Link from "next/link";

export default function Navbar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY < 80);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between pointer-events-none"
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2 group">
          <span className="text-[var(--color-accent)] group-hover:text-[var(--color-cyan)] transition-colors">&lt;</span>
          Eduardo
          <span className="text-[var(--color-accent)] group-hover:text-[var(--color-cyan)] transition-colors">/&gt;</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 bg-[var(--color-surface)]/80 backdrop-blur-md px-8 py-3 rounded-full border border-[var(--color-border)] shadow-xl">
          <Link href="#about" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors">Sobre</Link>
          <Link href="#skills" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors">Skills</Link>
          <Link href="#process" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors">Processo</Link>
          <Link href="#projects" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors">Projetos</Link>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          <a href="https://github.com/Duduzcx" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-neutral-400 hover:text-[var(--color-accent-light)] hover:border-[var(--color-accent)] transition-all">
            <GithubIcon className="w-4 h-4" />
          </a>
          <a href="https://www.linkedin.com/in/eduardosantosbezerra/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-neutral-400 hover:text-[var(--color-cyan)] hover:border-[var(--color-cyan)] transition-all">
            <LinkedinIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
