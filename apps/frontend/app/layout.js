import "./globals.css";
import Link from "next/link";
import { Geist, VT323 } from "next/font/google";
import { ShieldCheck, Activity, Terminal, ArrowUpRight } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
});

export const metadata = {
  title: "DRISHTI AI — Autonomous AI QA Platform",
  description:
    "Autonomous QA platform: deterministic graph exploration, grounded assertion planning, 3x replay failure verification, and standalone pytest-playwright regression suite generation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${vt323.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-[#fafafa] text-[#09090b]">
        {/* Top Navigation - Vostride Clean Light Theme */}
        <header className="border-b border-[#e4e4e7] bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            {/* Brand Logo & Wordmark */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 text-[#09090b] font-semibold text-sm tracking-tight group">
                <div className="w-6 h-6 rounded-md bg-[#000000] border border-black/10 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                  D
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[#09090b] tracking-tight">DRISHTI</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-50 text-[#FF9500] border border-orange-200/80 font-bold">
                    AI
                  </span>
                </div>
              </Link>

              <div className="hidden sm:block h-3.5 w-px bg-[#e4e4e7] mx-1" />

              <span className="hidden sm:inline-block text-[11px] text-zinc-500 font-medium tracking-tight">
                Autonomous AI QA Agent
              </span>
            </div>

            {/* Navigation Actions */}
            <nav className="flex items-center gap-5 text-xs font-medium">
              <Link
                href="/"
                className="text-zinc-600 hover:text-black transition-colors"
                id="nav-new-run"
              >
                Launch Run
              </Link>
              <Link
                href="/benchmarks"
                className="text-zinc-500 hover:text-black transition-colors"
                id="nav-benchmarks"
              >
                Benchmarks
              </Link>
              <a
                href="https://github.com/TechWithAkash/agent-qa"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 hover:text-black transition-colors hidden sm:flex items-center gap-1"
              >
                <span>Docs</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-400" />
              </a>

              {/* Runner Health Status */}
              <div className="flex items-center gap-1.5 pl-3 border-l border-[#e4e4e7] text-[11px] text-emerald-700 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="hidden xs:inline">Runner Ready</span>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Application Body */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Global Footer */}
        <footer className="border-t border-[#e4e4e7] bg-white py-6 text-xs text-zinc-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-2 text-zinc-600">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF9500]" />
              <span>DRISHTI AI — Autonomous Web QA Engine &bull; iMocha Track IM-02</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-400">
              <span>Deterministic Frontier &bull; Grounded Assertion DSL &bull; 3&times; Replay Verification</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
