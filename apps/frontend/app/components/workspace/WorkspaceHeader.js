"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Plus,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Activity,
  Layers,
} from "lucide-react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

function subscribePersona(callback) {
  window.addEventListener("drishti_persona_change", callback);
  return () => {
    window.removeEventListener("drishti_persona_change", callback);
  };
}

function getPersonaSnapshot() {
  try {
    return localStorage.getItem("drishti_persona") || "pm";
  } catch (e) {
    return "pm";
  }
}

function getPersonaServerSnapshot() {
  return "pm";
}

export default function WorkspaceHeader({ onOpenQuickLaunch, setIsMobileOpen }) {
  const pathname = usePathname();

  const persona = useSyncExternalStore(
    subscribePersona,
    getPersonaSnapshot,
    getPersonaServerSnapshot
  );

  // Compute breadcrumb path
  const getBreadcrumbs = () => {
    if (pathname === "/dashboard") {
      return [{ label: "Workspace", href: "/dashboard" }, { label: "Executive Dashboard" }];
    }
    if (pathname === "/runs") {
      return [{ label: "Workspace", href: "/dashboard" }, { label: "Test Runs & Results" }];
    }
    if (pathname.startsWith("/runs/")) {
      const runId = pathname.split("/")[2];
      return [
        { label: "Workspace", href: "/dashboard" },
        { label: "Test Runs", href: "/runs" },
        { label: runId },
      ];
    }
    if (pathname === "/ai-tools") {
      return [{ label: "Workspace", href: "/dashboard" }, { label: "AI QA & Self-Healing" }];
    }
    if (pathname === "/benchmarks") {
      return [{ label: "Quality", href: "/dashboard" }, { label: "Ground-Truth Benchmarks" }];
    }
    if (pathname === "/analytics") {
      return [{ label: "Intelligence", href: "/dashboard" }, { label: "Analytics & Quality Trends" }];
    }
    if (pathname === "/settings") {
      return [{ label: "Configuration", href: "/dashboard" }, { label: "Workspace Settings" }];
    }
    return [{ label: "Workspace", href: "/dashboard" }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-14 sm:h-16 border-b border-[#e6e9ee] bg-white sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-[#737373] hover:text-[#000000] hover:bg-[#fafafa] transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs min-w-0">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#a3a3a3] shrink-0" />}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="text-[#737373] hover:text-[#000000] transition-colors truncate font-medium"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-[#000000] truncate">
                    {crumb.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Right: Persona Badge, Status, Quick Launch */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Persona Perspective Pill */}
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fafafa] border border-[#e6e9ee] text-[11px] font-mono font-medium text-[#525252]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2D9FFE]"></span>
          <span>
            {persona === "pm" && "👔 PM View"}
            {persona === "dev" && "🛠️ Dev View"}
            {persona === "qa" && "🧪 QA View"}
          </span>
        </span>

        {/* System Swarm Status */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>7 Agents Ready</span>
        </div>

        {/* Quick Launch CTA */}
        <button
          type="button"
          onClick={onOpenQuickLaunch}
          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#2D9FFE] hover:bg-[#0b7ee6] text-white text-xs font-bold transition-all shadow-xs cursor-pointer group"
        >
          <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
          <span className="hidden sm:inline">New Audit</span>
          <span className="sm:hidden">New</span>
        </button>

        {/* Animated Theme Toggler */}
        <AnimatedThemeToggler />

        {/* Docs Link */}
        <a
          href="https://github.com/TechWithAkash/agent-qa"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#737373] hover:text-[#000000] hover:bg-[#fafafa] transition-colors"
        >
          <span>Docs</span>
          <ExternalLink className="w-3 h-3 text-[#a3a3a3]" />
        </a>
      </div>
    </header>
  );
}
