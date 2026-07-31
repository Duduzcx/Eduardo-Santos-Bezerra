import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import StarTrail from "@/components/StarTrail";
import TransitionWrapper from "@/components/TransitionWrapper";
import Navbar from "@/components/Navbar";
import ColorfulBackground from "@/components/ColorfulBackground";
import ScrollProgress from "@/components/ScrollProgress";
import NavigationTransition from "@/components/NavigationTransition";
import IntroLoader from "@/components/IntroLoader";
import BackToTop from "@/components/BackToTop";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Eduardo Santos Bezerra | Art Director & Software Engineer",
  description: "Portfólio de Eduardo Santos Bezerra - Desenvolvedor Full-Stack focado em arquitetura escalável e design imersivo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preload" href="/models/hero-moon.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/draco/draco_decoder.wasm" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/draco/draco_wasm_wrapper.js" as="fetch" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-transparent text-[var(--foreground)] antialiased overflow-x-hidden selection:bg-white selection:text-black`}
      >
        <IntroLoader />
        <StarTrail />
        <ScrollProgress />
        <NavigationTransition />
        <ColorfulBackground />
        <BackToTop />

        <SmoothScroll>
          <TransitionWrapper>
            <Navbar />
            {children}
          </TransitionWrapper>
        </SmoothScroll>
      </body>
    </html>
  );
}
