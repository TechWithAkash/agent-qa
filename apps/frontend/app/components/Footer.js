"use client";

import Link from "next/link";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

export default function Footer({ onLaunchClick }) {
  return (
    <footer className="relative bg-white border-t border-[#e6e9ee] text-xs text-[#737373] overflow-hidden">
      <div className="mx-auto max-w-[980px] px-4 sm:px-6 py-14 lg:py-18">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#2D9FFE] text-white text-xs font-semibold">
                D
              </div>
              <span className="font-semibold text-sm text-[#000000] tracking-tight">
                DRISHTI
              </span>
              <span className="rounded bg-[#2D9FFE]/10 px-1.5 py-0.2 text-[10px] font-semibold text-[#0b7ee6]">
                AI
              </span>
            </div>
            <p className="text-xs text-[#525252] max-w-sm leading-relaxed">
              Autonomous AI QA Engineer. Explores web applications, uncovers edge-case defects, eliminates flakiness with 3× fresh browser replays, and compiles reusable pytest regression suites.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[#737373]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>IM-02 Specification Standard</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h5 className="font-semibold text-[#000000] text-xs">
              Product
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={onLaunchClick}
                  className="hover:text-[#000000] transition-colors cursor-pointer"
                >
                  Launchpad
                </button>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[#000000] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/benchmarks" className="hover:text-[#000000] transition-colors">
                  Benchmark Suite
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Open Source */}
          <div className="space-y-3">
            <h5 className="font-semibold text-[#000000] text-xs">
              Resources
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com/TechWithAkash/agent-qa"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#000000] transition-colors"
                >
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="h-3 w-3 text-[#a3a3a3]" />
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#000000] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#000000] transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#f0f0f0] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#a3a3a3] gap-4">
          <p>© {new Date().getFullYear()} DRISHTI AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-600 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>

      {/* Receding Isometric Grid Lines Visual at bottom */}
      <div className="w-full flex justify-center opacity-30 pointer-events-none pb-4">
        <svg viewBox="0 0 600 60" className="w-full max-w-[600px] h-10" fill="none">
          <line x1="100" y1="60" x2="300" y2="10" stroke="#E6E9EE" strokeWidth="1" />
          <line x1="200" y1="60" x2="300" y2="10" stroke="#E6E9EE" strokeWidth="1" />
          <line x1="400" y1="60" x2="300" y2="10" stroke="#E6E9EE" strokeWidth="1" />
          <line x1="500" y1="60" x2="300" y2="10" stroke="#E6E9EE" strokeWidth="1" />
          <polygon points="270,10 300,0 330,10 300,20" fill="#2D9FFE" opacity="0.4" />
        </svg>
      </div>
    </footer>
  );
}
