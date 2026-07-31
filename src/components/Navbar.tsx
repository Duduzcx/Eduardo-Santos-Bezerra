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
  const [activeHref, setActiveHref] = useState("");

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY < 80 || menuOpen);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  // Destaca no menu a seção que está mais visível no momento (scrollspy)
  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.querySelector(link.href)).filter((el): el is Element => !!el);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visibleEntry) setActiveHref(`#${visibleEntry.target.id}`);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

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
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm font-medium transition-colors ${activeHref === link.href ? "text-[var(--foreground)]" : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"}`}
            >
              {link.label}
              {activeHref === link.href && (
                <motion.span layoutId="navbar-active-dot" className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--color-cyan)]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
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

        {/* Botão hamburguer — só mobile, área de toque 48x48 */}
        <motion.button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          whileTap={{ scale: 0.9 }}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          className="md:hidden relative flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)] text-[var(--foreground)] overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {menuOpen ? (
              <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="absolute">
                <X className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="absolute">
                <Menu className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Painel mobile em tela cheia — abre/fecha com slide+fade suave */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-[var(--background)]/98 backdrop-blur-lg pointer-events-auto"
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
                  className={`relative flex min-h-[48px] items-center justify-center px-6 text-3xl font-semibold tracking-tight transition-colors active:scale-95 ${activeHref === link.href ? "text-[var(--color-cyan)]" : "text-[var(--foreground)]"}`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * NAV_LINKS.length, duration: 0.35 }}
              className="flex items-center gap-4 mt-6"
            >
              <a href="https://github.com/Duduzcx" target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-neutral-300 active:scale-90 transition-transform">
                <GithubIcon className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/eduardosantosbezerra/" target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-neutral-300 active:scale-90 transition-transform">
                <LinkedinIcon className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
