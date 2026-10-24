"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlayCircle,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Settings,
  Plus,
  LogOut,
  ChevronRight,
  ExternalLink,
  Layers,
  Workflow,
  CheckCircle2,
  AlertTriangle,
  User,
} from "lucide-react";

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

const NAV_GROUPS = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        badge: "Live",
      },
    ],
  },
  {
    title: "TESTING WORKFLOWS",
    items: [
      {
        label: "Test Runs & Results",
        href: "/runs",
        icon: PlayCircle,
      },
    ],
  },
  {
    title: "INTELLIGENCE & ACCURACY",
    items: [
      {
        label: "AI QA & Self-Healing",
        href: "/ai-tools",
        icon: Sparkles,
        badge: "Auto",
      },
      {
        label: "Benchmarks (ShopLite)",
        href: "/benchmarks",
        icon: ShieldCheck,
      },
      {
        label: "Analytics & Trends",
        href: "/analytics",
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "GOVERNANCE & CONFIG",
    items: [
      {
        label: "Workspace Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export default function WorkspaceSidebar({ onOpenQuickLaunch, isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname();
  const router = useRouter();

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

  let user = null;
  if (authUserStr) {
    try {
      user = JSON.parse(authUserStr);
    } catch (e) {}
  }

  const handlePersonaSelect = (newPersona) => {
    try {
      localStorage.setItem("drishti_persona", newPersona);
      window.dispatchEvent(
        new CustomEvent("drishti_persona_change", { detail: newPersona })
      );
    } catch (e) {}
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem("drishti_user");
      window.dispatchEvent(new Event("drishti_auth_change"));
      router.push("/");
    } catch (e) {}
  };

  const content = (
    <div className="h-full flex flex-col justify-between bg-white text-[#262626] border-r border-[#e6e9ee]">
      {/* Top Section */}
      <div className="flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#f0f0f0]">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2D9FFE] to-[#0055FF] flex items-center justify-center text-white font-bold text-sm shadow-[0_2px_10px_rgba(45,159,254,0.35)] shrink-0 transition-transform group-hover:scale-105">
              D
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-[#000000]">
                  DRISHTI
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full bg-[#2D9FFE]/10 text-[#0b7ee6] border border-[#2D9FFE]/20">
                  AI
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#737373] block truncate">
                Autonomous QA Platform
              </span>
            </div>
          </Link>

          {/* Quick Launch Button */}
          <button
            type="button"
            onClick={onOpenQuickLaunch}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#2D9FFE] hover:bg-[#0b7ee6] text-white text-xs font-bold transition-all shadow-xs cursor-pointer group"
          >
            <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
            <span>New Test Run</span>
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="p-3 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-[#a3a3a3] font-semibold block mb-1">
                {group.title}
              </span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#2D9FFE]/10 text-[#0b7ee6] font-semibold border border-[#2D9FFE]/20 shadow-2xs"
                        : "text-[#525252] hover:text-[#000000] hover:bg-[#fafafa]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? "text-[#2D9FFE]" : "text-[#737373]"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? "bg-[#2D9FFE] text-white"
                            : "bg-[#fafafa] text-[#737373] border border-[#e6e9ee]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Section: Persona Switcher & User Profile */}
      <div className="p-4 border-t border-[#f0f0f0] space-y-3 bg-[#fafafa]/50">
        {/* Persona Perspective Dock */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1 text-[10px] font-mono text-[#737373]">
            <span className="font-semibold uppercase tracking-wider">Active Persona</span>
            <span className="text-emerald-700 font-bold">Synchronized</span>
          </div>
          <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-[#e6e9ee] shadow-2xs">
            <button
              type="button"
              onClick={() => handlePersonaSelect("pm")}
              className={`py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                persona === "pm"
                  ? "bg-[#000000] text-white shadow-2xs"
                  : "text-[#737373] hover:text-[#000000]"
              }`}
              title="Product Manager / Executive View"
            >
              👔 PM
            </button>
            <button
              type="button"
              onClick={() => handlePersonaSelect("dev")}
              className={`py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                persona === "dev"
                  ? "bg-[#000000] text-white shadow-2xs"
                  : "text-[#737373] hover:text-[#000000]"
              }`}
              title="Engineering & Locator View"
            >
              🛠️ Dev
            </button>
            <button
              type="button"
              onClick={() => handlePersonaSelect("qa")}
              className={`py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                persona === "qa"
                  ? "bg-[#000000] text-white shadow-2xs"
                  : "text-[#737373] hover:text-[#000000]"
              }`}
              title="QA Specialist & 3x Replay View"
            >
              🧪 QA
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#e6e9ee] shadow-2xs">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-full bg-[#2D9FFE]/15 text-[#0b7ee6] flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name ? user.name[0].toUpperCase() : "P"}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#000000] block truncate">
                {user?.name || "Paras"}
              </span>
              <span className="text-[10px] text-[#737373] block truncate">
                {user?.email || "Lead QA Engineer"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="p-1 rounded-lg text-[#737373] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
            title="Sign out of workspace"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer (Collapsible) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 h-full bg-white z-10 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
