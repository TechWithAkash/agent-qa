import "./globals.css";
import Link from "next/link";
import { ShieldCheck, Activity, Terminal, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "DRISHTI AI — Autonomous AI QA Platform",
  description:
    "Autonomous QA platform: deterministic graph exploration, grounded assertion planning, 3x replay failure verification, and standalone pytest-playwright regression suite generation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        {/* Top Navigation */}
        <header className="border-b border-white/[0.07] bg-[#090b10]/90 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            {/* Brand Logo & Wordmark */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 text-white font-semibold text-sm tracking-tight group">
                <div className="w-6 h-6 rounded-md bg-indigo-600/90 border border-indigo-400/30 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  D
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white tracking-tight">DRISHTI</span>
                  <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                    AI
                  </span>
                </div>
              </Link>

              <div className="hidden sm:block h-3.5 w-px bg-white/10 mx-1" />

              <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium tracking-tight">
                Autonomous QA Platform
              </span>
            </div>

            {/* Navigation Actions */}
            <nav className="flex items-center gap-5 text-xs font-medium">
              <Link
                href="/"
                className="text-slate-300 hover:text-white transition-colors"
                id="nav-new-run"
              >
                Launch Run
              </Link>
              <Link
                href="/benchmarks"
                className="text-slate-400 hover:text-white transition-colors"
                id="nav-benchmarks"
              >
                Benchmarks
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors hidden sm:flex items-center gap-1"
              >
                <span>Docs</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500" />
              </a>

              {/* Runner Health Status */}
              <div className="flex items-center gap-1.5 pl-3 border-l border-white/10 text-[11px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="hidden xs:inline">Runner Ready</span>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Application Body */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Global Footer */}
        <footer className="border-t border-white/[0.07] bg-[#090b10] py-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>DRISHTI AI — Autonomous Web QA Engine &bull; iMocha Track IM-02</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <span>Deterministic Frontier &bull; Grounded Assertion DSL &bull; 3x Replay Verification</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
