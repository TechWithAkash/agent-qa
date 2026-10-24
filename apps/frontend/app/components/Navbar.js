"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  PlayCircle,
} from "lucide-react";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

function subscribeAuth(callback) {
  window.addEventListener("drishti_auth_change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("drishti_auth_change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getAuthSnapshot() {
  try {
    return localStorage.getItem("drishti_user");
  } catch (e) {
    return null;
  }
}

function getAuthServerSnapshot() {
  return null;
}

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

export default function Navbar() {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isWorkspaceRoute =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/runs") ||
    pathname?.startsWith("/ai-tools") ||
    pathname?.startsWith("/benchmarks") ||
    pathname?.startsWith("/analytics") ||
    pathname?.startsWith("/settings");

  const authUserStr = useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getAuthServerSnapshot
  );

  const persona = useSyncExternalStore(
    subscribePersona,
    getPersonaSnapshot,
    getPersonaServerSnapshot
  );

  if (isWorkspaceRoute) {
    return null;
  }

  let currentUser = null;
  if (authUserStr) {
    try {
      currentUser = JSON.parse(authUserStr);
    } catch (e) {
      currentUser = null;
    }
  }

  const handleSetPersona = (newPersona) => {
    try {
      localStorage.setItem("drishti_persona", newPersona);
      window.dispatchEvent(
        new CustomEvent("drishti_persona_change", { detail: newPersona })
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("drishti_user");
      setShowUserMenu(false);
      window.dispatchEvent(new Event("drishti_auth_change"));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed top-6 sm:top-8 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      {/* Centered Floating Capsule Dock Navbar */}
      <header className="pointer-events-auto inline-flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-xl border border-[#e6e9ee] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.08)] text-[#262626] transition-all select-none max-w-full">
        {/* DRISHTI AI Brand Emblem in Electric Sky Blue */}
        <Link
          href="/"
          className="flex items-center gap-2 pl-1 pr-2 py-0.5 rounded-full hover:opacity-90 transition-opacity group"
          title="DRISHTI AI Home"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#0b7ee6] to-[#2D9FFE] text-white font-bold text-xs shadow-md shadow-[#2D9FFE]/25 group-hover:scale-105 transition-transform">
            D
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-xs sm:text-sm tracking-tight text-[#000000]">
              DRISHTI
            </span>
            <span className="rounded-full bg-[#2D9FFE]/10 px-1.5 py-0.2 text-[10px] font-semibold text-[#0b7ee6]">
              AI
            </span>
          </div>
        </Link>

        <div className="h-4 w-px bg-[#e6e9ee] hidden sm:block" />

        {/* Center Nav Links */}
        <nav className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm font-medium">
          {currentUser && (
            <Link
              href="/dashboard"
              className="rounded-full px-2.5 sm:px-3 py-1.5 text-[#0b7ee6] bg-[#2D9FFE]/10 font-bold hover:bg-[#2D9FFE]/15 transition-colors"
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/#operation-workspace"
            className="rounded-full px-2.5 sm:px-3 py-1.5 text-[#525252] hover:text-[#000000] hover:bg-[#f8fafc] transition-colors"
          >
            Product
          </Link>
          <Link
            href="/#feature-flow"
            className="rounded-full px-2.5 sm:px-3 py-1.5 text-[#525252] hover:text-[#000000] hover:bg-[#f8fafc] transition-colors hidden md:inline-block"
          >
            How It Works
          </Link>
          <Link
            href="/benchmarks"
            className={`rounded-full px-2.5 sm:px-3 py-1.5 transition-colors ${
              pathname === "/benchmarks"
                ? "text-[#0b7ee6] bg-[#2D9FFE]/10 font-semibold"
                : "text-[#525252] hover:text-[#000000] hover:bg-[#f8fafc]"
            }`}
          >
            Benchmarks
          </Link>

          {/* Persona Switcher Pill */}
          <div className="hidden lg:flex items-center gap-0.5 rounded-full bg-[#f4f4f5] p-0.5 border border-[#e6e9ee] text-[11px]">
            <button
              type="button"
              onClick={() => handleSetPersona("pm")}
              className={`rounded-full px-2 py-0.5 transition-all cursor-pointer ${
                persona === "pm"
                  ? "bg-white text-[#000000] font-semibold shadow-2xs"
                  : "text-[#737373] hover:text-[#000000]"
              }`}
              title="PM View"
            >
              PM
            </button>
            <button
              type="button"
              onClick={() => handleSetPersona("dev")}
              className={`rounded-full px-2 py-0.5 transition-all cursor-pointer ${
                persona === "dev"
                  ? "bg-white text-[#000000] font-semibold shadow-2xs"
                  : "text-[#737373] hover:text-[#000000]"
              }`}
              title="Developer View"
            >
              Dev
            </button>
            <button
              type="button"
              onClick={() => handleSetPersona("qa")}
              className={`rounded-full px-2 py-0.5 transition-all cursor-pointer ${
                persona === "qa"
                  ? "bg-white text-[#000000] font-semibold shadow-2xs"
                  : "text-[#737373] hover:text-[#000000]"
              }`}
              title="QA View"
            >
              QA
            </button>
          </div>

          <a
            href="https://github.com/TechWithAkash/agent-qa"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1 rounded-full px-2.5 sm:px-3 py-1.5 text-[#525252] hover:text-[#000000] hover:bg-[#f8fafc] transition-colors"
          >
            <span>Docs</span>
            <ArrowUpRight className="h-3 w-3 text-[#a3a3a3]" />
          </a>

          {!currentUser && (
            <Link
              href="/login"
              className={`rounded-full px-2.5 sm:px-3 py-1.5 text-xs text-[#525252] hover:text-[#000000] transition-colors ${
                pathname === "/login" ? "text-[#000000] font-semibold bg-slate-100" : ""
              }`}
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Right CTA Button & Theme Toggler */}
        <div className="flex items-center gap-2.5">
          <AnimatedThemeToggler />
          {currentUser ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-full border border-[#e6e9ee] bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#262626] hover:bg-[#fafafa] transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2D9FFE] text-white text-[10px] font-bold">
                {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
              </div>
              <span className="truncate max-w-[100px]">{currentUser.name || "Paras"}</span>
              <ChevronDown className="h-3 w-3 text-[#737373]" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#e6e9ee] bg-white p-2 shadow-2xl text-[#262626] z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="border-b border-[#f0f0f0] px-3 py-2">
                  <div className="text-xs font-bold text-[#000000]">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] font-mono text-[#737373] truncate">
                    {currentUser.email}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 font-mono">
                    <ShieldCheck className="h-3 w-3" />
                    <span>{currentUser.role || "Staff QA Architect"}</span>
                  </div>
                </div>

                <div className="py-1 text-xs">
                  <Link
                    href="/dashboard"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-[#000000] font-semibold bg-[#2D9FFE]/10 text-[#0b7ee6] transition-colors mb-1"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-[#2D9FFE]" />
                    <span>Workspace Dashboard</span>
                  </Link>
                  <Link
                    href="/runs"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-[#525252] hover:bg-[#f8fafc] hover:text-[#000000] transition-colors"
                  >
                    <PlayCircle className="h-3.5 w-3.5 text-[#2D9FFE]" />
                    <span>Test Runs &amp; Audits</span>
                  </Link>
                  <Link
                    href="/benchmarks"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-[#525252] hover:bg-[#f8fafc] hover:text-[#000000] transition-colors"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Benchmark Scorecard</span>
                  </Link>
                </div>

                <div className="border-t border-[#f0f0f0] pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium text-[#c2453a] hover:bg-rose-50 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/#operation-workspace"
            className="inline-flex items-center justify-center rounded-full bg-[#2D9FFE] hover:bg-[#0b7ee6] text-white px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#2D9FFE]/25 active:scale-95 group"
          >
            <span>Launch a Run</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
        </div>
      </header>
    </div>
  );
}
