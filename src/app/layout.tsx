import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import StarTrail from "@/components/StarTrail";
import TransitionWrapper from "@/components/TransitionWrapper";
import Navbar from "@/components/Navbar";
import ColorfulBackground from "@/components/ColorfulBackground";
import FloatingObjects from "@/components/FloatingObjects";
import ScrollProgress from "@/components/ScrollProgress";
import NavigationTransition from "@/components/NavigationTransition";
import CustomCursor from "@/components/CustomCursor";
import IntroLoader from "@/components/IntroLoader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
      <body
        className={`${inter.variable} font-sans bg-transparent text-neutral-50 antialiased overflow-x-hidden selection:bg-white selection:text-black`}
      >
        <IntroLoader />
        <CustomCursor />
        <StarTrail />
        <ScrollProgress />
        <NavigationTransition />
        <ColorfulBackground />
        <FloatingObjects />
        
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
