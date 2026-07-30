"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#about", label: "Sobre" },
  { href: "#skills", label: "Skills" },
  { href: "#process", label: "Processo" },
  { href: "#projects", label: "Projetos" },
];

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY < 80 || menuOpen);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-0 left-0 w-full z-50 px-4 sm:px-6 py-4 flex items-center justify-between pointer-events-none"
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Logo */}
        <Link href="/" className="text-lg sm:text-xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2 group shrink-0">
          <span className="text-[var(--color-accent)] group-hover:text-[var(--color-cyan)] transition-colors">&lt;</span>
          Eduardo
          <span className="text-[var(--color-accent)] group-hover:text-[var(--color-cyan)] transition-colors">/&gt;</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 bg-[var(--color-surface)]/80 backdrop-blur-md px-8 py-3 rounded-full border border-[var(--color-border)] shadow-xl">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Social Icons — só desktop, no mobile viram parte do menu */}
        <div className="hidden md:flex items-center gap-3">
          <a href="https://github.com/Duduzcx" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-neutral-400 hover:text-[var(--color-accent-light)] hover:border-[var(--color-accent)] transition-all">
            <GithubIcon className="w-4 h-4" />
          </a>
          <a href="https://www.linkedin.com/in/eduardosantosbezerra/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-neutral-400 hover:text-[var(--color-cyan)] hover:border-[var(--color-cyan)] transition-all">
            <LinkedinIcon className="w-4 h-4" />
          </a>
        </div>

        {/* Botão hamburguer — só mobile */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)] text-[var(--foreground)]"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Painel mobile em tela cheia */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-[var(--background)]/98 backdrop-blur-lg pointer-events-auto"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.35 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-3xl font-semibold text-[var(--foreground)] tracking-tight"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * NAV_LINKS.length, duration: 0.35 }}
              className="flex items-center gap-4 mt-4"
            >
              <a href="https://github.com/Duduzcx" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-neutral-300">
                <GithubIcon className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/eduardosantosbezerra/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-neutral-300">
                <LinkedinIcon className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
