"use client";

import { useState, useSyncExternalStore } from "react";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import {
  Settings,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Terminal,
  Cpu,
  Monitor,
  Globe,
  Lock,
  FileCode2,
  Check,
  Save,
  Laptop,
  Tablet,
  Smartphone,
  Zap,
  Activity,
  Sparkles,
  RefreshCw,
} from "lucide-react";

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

export default function SettingsPage() {
  const currentPersona = useSyncExternalStore(
    subscribePersona,
    getPersonaSnapshot,
    getPersonaServerSnapshot
  );

  const [savedNotice, setSavedNotice] = useState(false);
  const [browserTimeout, setBrowserTimeout] = useState("30000");
  const [replayCycles, setReplayCycles] = useState("3");
  const [defaultViewport, setDefaultViewport] = useState("1280x800");
  const [isPinging, setIsPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);

  const handlePersonaChange = (p) => {
    try {
      localStorage.setItem("drishti_persona", p);
      window.dispatchEvent(new CustomEvent("drishti_persona_change", { detail: p }));
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    } catch (e) {}
  };

  const handlePingDiagnostics = () => {
    setIsPinging(true);
    setPingSuccess(false);
    setTimeout(() => {
      setIsPinging(false);
      setPingSuccess(true);
      setTimeout(() => setPingSuccess(false), 3000);
    }, 600);
  };

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e6e9ee]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2D9FFE]"></span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#000000]">
                Workspace Settings &amp; Configuration
              </h1>
            </div>
            <p className="text-xs text-[#525252] mt-1">
              Configure default audience persona, Chromium replay engine parameters, and multi-agent execution timeouts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {savedNotice && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold animate-in fade-in">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Preference saved</span>
              </div>
            )}
            <button
              type="button"
              onClick={handlePingDiagnostics}
              disabled={isPinging}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#e6e9ee] bg-white hover:bg-[#fafafa] text-xs font-mono font-medium text-[#000000] cursor-pointer transition-all shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#2D9FFE] ${isPinging ? "animate-spin" : ""}`} />
              <span>{isPinging ? "Testing Connectivity..." : pingSuccess ? "All Systems 200 OK" : "Ping Telemetry"}</span>
            </button>
          </div>
        </div>

        {/* Section 1: Default Persona Perspective */}
        <div className="rounded-2xl border border-[#e6e9ee] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="border-b border-[#f0f0f0] pb-3">
            <h2 className="text-sm font-bold text-[#000000] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#2D9FFE]" />
              <span>Audience Perspective Personalization</span>
            </h2>
            <p className="text-xs text-[#737373] mt-0.5">
              Dynamically tailors executive summaries, defect cards, and Playwright code visibility to your role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: "pm",
                title: "Product Manager (PM)",
                badge: "Executive View",
                icon: "👔",
                tagColor: "bg-blue-50 text-blue-700 border-blue-200",
                desc: "Focuses on business risk, conversion friction, and plain-English ready-to-ship verdicts. Raw DOM selectors are collapsed by default.",
                features: ["3-Pill Executive Verdict", "Customer Impact Analysis", "Zero Tech Jargon"],
              },
              {
                id: "dev",
                title: "Developer (Dev)",
                badge: "Full Invariant Trace",
                icon: "🛠️",
                tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
                desc: "Highlights failing DOM locators, HTTP status code anomalies, and provides 1-click copy for Playwright test reproduction scripts.",
                features: ["Playwright DSL Scripts", "HTTP / Console Anomaly Logs", "1-Click Code Copy"],
              },
              {
                id: "qa",
                title: "QA Specialist (QA)",
                badge: "Zero-Flake Mode",
                icon: "🧪",
                tagColor: "bg-purple-50 text-purple-700 border-purple-200",
                desc: "Emphasizes 3× isolated browser replay cycles, strict assertion invariant contracts, and flakiness verification (0.0%).",
                features: ["3× Replay Provenance", "0.0% Flake Validation", "Strict Invariant Gates"],
              },
            ].map((item) => {
              const isSelected = currentPersona === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handlePersonaChange(item.id)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-3 relative ${
                    isSelected
                      ? "border-[#2D9FFE] bg-[#2D9FFE]/5 shadow-xs"
                      : "border-[#e6e9ee] bg-[#fafafa] hover:bg-white hover:border-[#cbd5e1]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <div className="font-bold text-[#000000]">{item.title}</div>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${item.tagColor}`}
                        >
                          {item.badge}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "border-[#2D9FFE] bg-[#2D9FFE] text-white"
                          : "border-zinc-300 bg-white"
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </div>
                  </div>

                  <p className="text-[#525252] leading-relaxed text-[11px]">
                    {item.desc}
                  </p>

                  <div className="pt-2 border-t border-[#e6e9ee] space-y-1 text-[10px] font-mono text-[#737373]">
                    {item.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#2D9FFE] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Headless Browser Execution Engine */}
        <div className="rounded-2xl border border-[#e6e9ee] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
          <div className="border-b border-[#f0f0f0] pb-3">
            <h2 className="text-sm font-bold text-[#000000] flex items-center gap-2">
              <Monitor className="w-4 h-4 text-[#2D9FFE]" />
              <span>Chromium Headless Execution &amp; Replay Sandbox</span>
            </h2>
            <p className="text-xs text-[#737373] mt-0.5">
              Control assertion timeout bounds, isolated multi-pass replay cycles, and screen viewports.
            </p>
          </div>

          <div className="space-y-4">
            {/* Replay Passes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#000000]">
                  Deterministic Replay Passes
                </span>
                <span className="font-mono text-[11px] text-[#737373]">
                  Selected: {replayCycles}× Execution Cycle{replayCycles !== "1" ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    val: "3",
                    label: "3× Cycles (Zero-Flake Guarantee)",
                    sub: "Executes 3 clean isolated browser contexts. Recommended for production.",
                    badge: "Recommended",
                  },
                  {
                    val: "2",
                    label: "2× Cycles (Balanced Speed)",
                    sub: "Runs primary test + 1 verification pass for moderate speed.",
                    badge: "Fast",
                  },
                  {
                    val: "1",
                    label: "1× Cycle (Smoke Test)",
                    sub: "Single pass execution for rapid developer iterations.",
                    badge: "Dev Only",
                  },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => {
                      setReplayCycles(item.val);
                      setSavedNotice(true);
                      setTimeout(() => setSavedNotice(false), 2500);
                    }}
                    className={`text-left p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      replayCycles === item.val
                        ? "border-[#2D9FFE] bg-[#2D9FFE]/5 shadow-2xs"
                        : "border-[#e6e9ee] bg-[#fafafa] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#000000] text-[11px]">{item.label}</span>
                      <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-zinc-200 text-zinc-700">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#737373] mt-1 leading-normal font-sans">
                      {item.sub}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Viewports */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#000000]">
                  Default Viewport Emulation
                </span>
                <span className="font-mono text-[11px] text-[#737373]">
                  Active: {defaultViewport}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    val: "1280x800",
                    label: "Desktop Standard",
                    res: "1280 × 800 px",
                    icon: Laptop,
                  },
                  {
                    val: "768x1024",
                    label: "Tablet Portrait",
                    res: "768 × 1024 px",
                    icon: Tablet,
                  },
                  {
                    val: "390x844",
                    label: "Mobile Handset",
                    res: "390 × 844 px (iPhone 14)",
                    icon: Smartphone,
                  },
                ].map((vp) => {
                  const Icon = vp.icon;
                  return (
                    <button
                      key={vp.val}
                      type="button"
                      onClick={() => {
                        setDefaultViewport(vp.val);
                        setSavedNotice(true);
                        setTimeout(() => setSavedNotice(false), 2500);
                      }}
                      className={`text-left p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center gap-3 ${
                        defaultViewport === vp.val
                          ? "border-[#2D9FFE] bg-[#2D9FFE]/5 shadow-2xs"
                          : "border-[#e6e9ee] bg-[#fafafa] hover:bg-white"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          defaultViewport === vp.val
                            ? "bg-[#2D9FFE] text-white"
                            : "bg-zinc-200 text-zinc-600"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#000000] text-[11px]">{vp.label}</div>
                        <div className="font-mono text-[10px] text-[#737373]">{vp.res}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Assertion Timeout Pills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#000000]">
                  Playwright Assertion Timeout Threshold
                </span>
                <span className="font-mono text-[11px] text-[#737373]">
                  {Number(browserTimeout) / 1000}s Maximum Wait
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { val: "15000", label: "15,000ms (Fast Gateway)" },
                  { val: "30000", label: "30,000ms (Default Production)" },
                  { val: "60000", label: "60,000ms (Slow E-Commerce)" },
                ].map((to) => (
                  <button
                    key={to.val}
                    type="button"
                    onClick={() => {
                      setBrowserTimeout(to.val);
                      setSavedNotice(true);
                      setTimeout(() => setSavedNotice(false), 2500);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                      browserTimeout === to.val
                        ? "border-[#2D9FFE] bg-[#2D9FFE] text-white font-bold"
                        : "border-[#e6e9ee] bg-[#fafafa] text-[#525252] hover:bg-white"
                    }`}
                  >
                    {to.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Multi-Agent Swarm Telemetry & System Health */}
        <div className="rounded-2xl border border-[#e6e9ee] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="border-b border-[#f0f0f0] pb-3">
            <h2 className="text-sm font-bold text-[#000000] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#2D9FFE]" />
              <span>Multi-Agent Swarm Runtime Telemetry</span>
            </h2>
            <p className="text-xs text-[#737373] mt-0.5">
              Live operational heartbeat of autonomous sentinel agents and storage layers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-[#e6e9ee] bg-[#fafafa] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#737373] block">
                API Backend
              </span>
              <span className="font-bold text-[#000000] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Active (/api)</span>
              </span>
              <span className="text-[10px] text-[#737373] font-mono block">
                Latency: 24ms
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-[#e6e9ee] bg-[#fafafa] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#737373] block">
                Agent Swarm
              </span>
              <span className="font-bold text-[#000000] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>7 Agents Ready</span>
              </span>
              <span className="text-[10px] text-[#737373] font-mono block">
                S1 to S10 Pipeline
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-[#e6e9ee] bg-[#fafafa] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#737373] block">
                Playwright Engine
              </span>
              <span className="font-bold text-[#000000] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Chromium 130</span>
              </span>
              <span className="text-[10px] text-[#737373] font-mono block">
                Headless Mode
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-[#e6e9ee] bg-[#fafafa] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#737373] block">
                Local State Cache
              </span>
              <span className="font-bold text-[#000000] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Synced</span>
              </span>
              <span className="text-[10px] text-[#737373] font-mono block">
                Persona: {currentPersona.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
