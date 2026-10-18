import "./globals.css";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "DRISHTI AI — Autonomous AI QA Engineer",
  description:
    "Autonomous QA platform: deterministic graph exploration, grounded assertion planning, 3x replay failure verification, and standalone pytest-playwright regression suite generation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col antialiased bg-[#FAFAF9] text-[#171717] selection:bg-[#F97316]/20 selection:text-[#171717]">
        {/* Top Navigation - Linear x Vercel Clean Aesthetic */}
        <header className="border-b border-[#E5E5E5] bg-[#FAFAF9]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            {/* Brand Logo & Wordmark */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2.5 text-[#171717] font-semibold text-sm tracking-tight group"
              >
                <div className="w-6 h-6 rounded-md bg-[#171717] flex items-center justify-center text-white text-xs font-bold transition-transform group-hover:scale-105">
                  D
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[#171717] tracking-tight">DRISHTI</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 border border-orange-200">
                    AI
                  </span>
                </div>
              </Link>

              <div className="hidden sm:block h-3.5 w-px bg-[#E5E5E5] mx-1" />

              <span className="hidden sm:inline-block text-xs font-medium text-[#737373] tracking-tight">
                Autonomous QA Engine
              </span>
            </div>

            {/* Navigation Destinations & Action */}
            <nav className="flex items-center gap-4 sm:gap-6 text-xs font-medium">
              <Link
                href="/#operation-workspace"
                className="text-[#737373] hover:text-[#171717] transition-colors hidden md:inline-block"
              >
                Product
              </Link>
              <Link
                href="/#how-it-works"
                className="text-[#737373] hover:text-[#171717] transition-colors hidden md:inline-block"
              >
                How It Works
              </Link>
              <Link
                href="/benchmarks"
                className="text-[#737373] hover:text-[#171717] transition-colors"
                id="nav-benchmarks"
              >
                Benchmarks
              </Link>
              <a
                href="https://github.com/TechWithAkash/agent-qa"
                target="_blank"
                rel="noreferrer"
                className="text-[#737373] hover:text-[#171717] transition-colors hidden sm:flex items-center gap-1"
              >
                <span>Docs</span>
                <ArrowUpRight className="w-3 h-3 text-[#A3A3A3]" />
              </a>

              {/* Primary Action Button */}
              <Link
                href="/#operation-workspace"
                id="nav-new-run"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171717] text-white hover:bg-black transition-all text-xs font-medium shadow-2xs group"
              >
                <span>Launch a Run</span>
                <ArrowRight className="w-3 h-3 text-[#F97316] transition-transform group-hover:translate-x-0.5" />
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Application Body */}
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
