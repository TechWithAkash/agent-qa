"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  FileCode2,
  Maximize2,
  Terminal,
  ShieldCheck,
  Play,
  ArrowRight,
} from "lucide-react";

export default function HeroBrowserDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Controlled 6-step autonomous QA demonstration sequence
  const steps = [
    {
      id: "discover",
      phase: "01 · DISCOVERY",
      title: "Mapping Routes & DOM Hierarchy",
      action: "page.goto('https://app.demo:3001/')",
      targetText: "Discovered 14 routes, 28 interactive controls",
      status: "Verified",
      highlightLocator: "button[data-testid='btn-signup']",
      log: "Discovered form target: /auth/signup [email, password, submit]",
    },
    {
      id: "plan",
      phase: "02 · PLANNING",
      title: "Assertion DSL Scenario Generation",
      action: "planner.generate(sc_signup_boundary)",
      targetText: "Invariants: email format 400 rejection, 0 uncaught exceptions",
      status: "Verified",
      highlightLocator: "input[type='email']",
      log: "Grounding Assertion DSL: expect(status < 400).to_be_true()",
    },
    {
      id: "execute",
      phase: "03 · EXECUTION",
      title: "Synthetic Browser Action Dispatch",
      action: "page.fill('#email', 'malformed-email')",
      targetText: "Dispatching keyboard events across isolated context",
      status: "Running",
      highlightLocator: "button[type='submit']",
      log: "POST /api/signup -> HTTP 201 Created (ANOMALY DETECTED)",
    },
    {
      id: "verify",
      phase: "04 · 3× REPLAY",
      title: "Eliminating Flakiness & Transient Errors",
      action: "replay.verify_consecutive_iterations(3)",
      targetText: "Context 1/3: Match • Context 2/3: Match • Context 3/3: Match",
      status: "3x Proven",
      highlightLocator: "span[role='alert']",
      log: "Failure confirmed across 3 independent browser sandboxes",
    },
    {
      id: "report",
      phase: "05 · EVIDENCE",
      title: "Compiling Evidence Dossier & Pytest",
      action: "report.export(defect_B1_bundle)",
      targetText: "Screenshot, HAR trace, and test_b1.py synthesized",
      status: "Ready",
      highlightLocator: "div.code-export",
      log: "Generated standalone pytest regression test artifact",
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const current = steps[activeStep];

  return (
    <div className="relative w-full rounded-2xl border border-[#E5E5E5] bg-white shadow-md overflow-hidden transition-all">
      {/* Browser Chrome Header */}
      <div className="flex items-center justify-between border-b border-[#E5E5E5] bg-[#FAFAF9] px-4 py-3">
        {/* Window controls */}
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></span>
          <span className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></span>
          <span className="h-3 w-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></span>
        </div>

        {/* Address bar */}
        <div className="flex items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-3 py-1 text-xs text-[#737373] max-w-xs sm:max-w-sm w-full mx-2 font-mono">
          <Globe className="h-3.5 w-3.5 text-[#F97316] shrink-0" />
          <span className="truncate text-[#171717] font-medium">https://demo.app:3001/auth/signup</span>
          <span className="ml-auto text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
            TLS 1.3
          </span>
        </div>

        {/* Engine status indicator */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#737373]">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="hidden sm:inline font-medium text-[#171717]">DRISHTI S5</span>
        </div>
      </div>

      {/* Interactive Mock Web App Viewport */}
      <div className="relative bg-[#FAFAF9] p-5 sm:p-6 min-h-[300px] flex flex-col justify-between">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#171717 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* Simulated Web Application Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-[#E5E5E5] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-[#171717] text-white flex items-center justify-center font-bold text-xs">
              S
            </div>
            <span className="text-xs font-bold text-[#171717]">ShopLite Demo App</span>
          </div>
          <span className="text-[11px] text-[#737373] font-mono">Port 3001 • Seeded Defect Target</span>
        </div>

        {/* Simulated Web Application Form with Active Locator Highlight */}
        <div className="relative z-10 max-w-sm mx-auto w-full rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#171717]">Create Your Account</span>
            <span className="text-[10px] font-mono text-[#737373]">/signup</span>
          </div>

          {/* Form input: Email */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[#737373] flex items-center justify-between">
              <span>Email Address</span>
              {activeStep >= 1 && (
                <span className="text-[10px] font-mono text-[#F97316] font-bold">
                  input[name=&apos;email&apos;]
                </span>
              )}
            </label>
            <div
              className={`relative rounded-lg border px-3 py-1.5 text-xs transition-all ${
                activeStep >= 2
                  ? "border-[#F97316] bg-orange-50/40 text-[#171717] ring-2 ring-orange-400/20"
                  : "border-[#E5E5E5] bg-white text-[#737373]"
              }`}
            >
              <span>{activeStep >= 2 ? "invalid-user-email-domain" : "alex@company.com"}</span>
              {activeStep >= 2 && (
                <span className="absolute right-2 top-1.5 h-3.5 w-1 bg-[#F97316] animate-pulse"></span>
              )}
            </div>
          </div>

          {/* Form input: Password */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[#737373]">Password</label>
            <div className="rounded-lg border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs text-[#737373]">
              ••••••••••••
            </div>
          </div>

          {/* Action button with autonomous probe badge */}
          <div className="relative pt-1">
            <div
              className={`w-full py-2 rounded-lg text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 ${
                activeStep === 2
                  ? "bg-[#171717] text-white ring-2 ring-[#F97316]"
                  : "bg-[#171717] text-white"
              }`}
            >
              <span>Create Account</span>
            </div>

            {/* Autonomous Overlay Label */}
            {activeStep >= 3 && (
              <div className="mt-2 flex items-center justify-between rounded border border-red-200 bg-red-50 px-2 py-1 text-[11px] text-red-700">
                <span className="flex items-center gap-1 font-medium">
                  <AlertTriangle className="h-3 w-3 text-red-600 shrink-0" />
                  <span>Expected 400 validation error; received 201 redirect</span>
                </span>
                <span className="font-mono text-[9px] font-bold bg-red-100 px-1 rounded">B1 DEFECT</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Autonomous Pipeline Step Telemetry */}
        <div className="relative z-10 mt-4 rounded-xl border border-[#E5E5E5] bg-white p-3.5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E5E5] pb-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#F97316] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
                {current.phase}
              </span>
              <span className="font-bold text-[#171717]">{current.title}</span>
            </div>
            <span
              className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border self-start sm:self-auto ${
                current.status === "Verified" || current.status === "Ready" || current.status === "3x Proven"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-orange-50 text-orange-700 border-orange-200 animate-pulse"
              }`}
            >
              {current.status}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-[#737373]">
            <div className="font-mono text-[11px] text-[#171717] truncate max-w-[280px] sm:max-w-md">
              &gt; {current.log}
            </div>
            <span className="hidden sm:inline font-mono text-[10px] text-[#737373] shrink-0">
              Latency: 14ms
            </span>
          </div>
        </div>
      </div>

      {/* Step Navigation Dots & Control Toolbar */}
      <div className="flex items-center justify-between border-t border-[#E5E5E5] bg-white px-4 py-2.5 text-xs text-[#737373]">
        <div className="flex items-center gap-1.5">
          {steps.map((st, i) => (
            <button
              key={st.id}
              onClick={() => {
                setActiveStep(i);
                setIsPlaying(false);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeStep === i ? "w-6 bg-[#171717]" : "w-2 bg-[#E5E5E5] hover:bg-zinc-400"
              }`}
              title={`Switch to ${st.title}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-[#737373]">
            Sequence {activeStep + 1} of {steps.length}
          </span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 text-[11px] font-medium text-[#171717] hover:text-[#F97316] cursor-pointer"
          >
            {isPlaying ? "Pause Demo" : "Play Sequence"}
          </button>
        </div>
      </div>
    </div>
  );
}
