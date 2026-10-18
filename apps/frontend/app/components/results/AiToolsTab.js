"use client";

import { useState } from "react";
import {
  Sparkles,
  Send,
  RotateCcw,
  Check,
  Wand2,
  Copy,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu,
  Zap,
} from "lucide-react";

const DEMO_DRIFT_SCENARIOS = [
  {
    id: "id_drift",
    label: "Legacy ID Drift",
    broken: "#legacy_cta_button_v1",
    strategy: "Semantic Accessible Role + Text Match",
    description: "Element ID was renamed during a frontend refactor; DOM query returned null.",
  },
  {
    id: "tailwind_drift",
    label: "Tailwind CSS Drift",
    broken: "button.bg-orange-500.hover\\:bg-orange-600.px-4.py-2.rounded-lg",
    strategy: "Accessible Button Hierarchy Recovery",
    description: "Utility classes shifted from Tailwind v3 to v4; hardcoded selector broke.",
  },
  {
    id: "hash_drift",
    label: "React Dynamic Hash",
    broken: "div[data-testid='auth-modal-v2'] > button.btn-7x9q",
    strategy: "Proximity & Accessible Name Recovery",
    description: "Bundler generated a new dynamic CSS-in-JS hash on rebuild.",
  },
  {
    id: "xpath_drift",
    label: "Brittle Structural XPath",
    broken: "/html/body/div[1]/main/section[2]/div[3]/div/button",
    strategy: "Semantic Subtree Graph Synthesis",
    description: "Wrapper div added around marketing hero section; strict XPath collapsed.",
  },
];

export default function AiToolsTab({
  customStepText,
  setCustomStepText,
  executingStep,
  handleExecuteNLStep,
  stepResult,
  signupRoute,
  primaryButton,
  h1Text,
  targetHostname,
  targetUrl,
  model,
  healedChains = [],
  isHealing,
  handleTriggerSelfHealing,
  copyToClipboard,
}) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [activeDriftScenario, setActiveDriftScenario] = useState(DEMO_DRIFT_SCENARIOS[0].id);
  const [expandedTrace, setExpandedTrace] = useState(true);

  const handleCopy = (text, key) => {
    if (copyToClipboard) {
      copyToClipboard(text, key);
    } else {
      navigator.clipboard.writeText(text);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentScenario = DEMO_DRIFT_SCENARIOS.find((s) => s.id === activeDriftScenario) || DEMO_DRIFT_SCENARIOS[0];

  const suggestions = [
    `Click button "${primaryButton || "Get Started"}"`,
    `Verify signup inputs on "${signupRoute || "/auth/signup"}"`,
    `Assert primary headline "${(h1Text || "Autonomous").slice(0, 24)}..." is visible`,
    `Check responsive navigation and zero console errors`,
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* =========================================================================
          CARD 1: ASK QA AGENT (NATURAL LANGUAGE TEST EXECUTION)
          ========================================================================= */}
      <div className="lg:col-span-6 rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex items-start justify-between border-b border-[#F5F5F4] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F97316]">
                <Sparkles className="w-4 h-4 fill-[#F97316]/20" />
              </div>
              <h3 className="text-base font-bold text-[#171717] tracking-tight">
                Ask QA Agent (Natural Language Test)
              </h3>
            </div>
            <p className="text-xs text-[#737373] mt-1">
              Autonomous compiler turns plain English intent into live Playwright actions &amp; invariant checks.
            </p>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Agent Live
          </span>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] font-semibold">
            Suggested Test Prompts:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCustomStepText(s);
                  handleExecuteNLStep(s);
                }}
                className="text-[11px] font-sans px-2.5 py-1 rounded-lg border border-[#E5E5E5] bg-[#FAFAF9] hover:bg-orange-50 hover:border-orange-200 hover:text-orange-900 text-[#525252] transition-all cursor-pointer text-left truncate max-w-full"
              >
                👉 {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input & Run CTA */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={customStepText}
                onChange={(e) => setCustomStepText(e.target.value)}
                placeholder={`e.g. Verify sign-up flow on "${signupRoute || "/auth/signup"}"...`}
                onKeyDown={(e) => e.key === "Enter" && handleExecuteNLStep(customStepText)}
                className="w-full text-xs font-mono text-[#171717] placeholder-[#A3A3A3] px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] focus:bg-white focus:border-[#171717] focus:outline-hidden transition-all shadow-2xs"
              />
            </div>
            <button
              type="button"
              onClick={() => handleExecuteNLStep(customStepText)}
              disabled={executingStep || !customStepText.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-black text-white text-xs font-semibold cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-xs transition-all group"
            >
              {executingStep ? (
                <RotateCcw className="w-3.5 h-3.5 animate-spin text-[#F97316]" />
              ) : (
                <Send className="w-3.5 h-3.5 text-[#F97316] transition-transform group-hover:translate-x-0.5" />
              )}
              <span>{executingStep ? "Compiling..." : "Execute"}</span>
            </button>
          </div>
        </div>

        {/* Live Step Result Card */}
        {stepResult ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3 animate-in fade-in zoom-in-98 duration-200">
            {/* Header Telemetry */}
            <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-xs font-bold text-emerald-950 font-sans">
                  Intent Executed &amp; Verified
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  {Math.round((stepResult.confidence || 0.98) * 100)}% Confidence
                </span>
                <span className="text-emerald-700 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {stepResult.latency_ms || 24}ms
                </span>
              </div>
            </div>

            {/* Resolved Selector Banner */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-emerald-200/80 text-xs font-mono">
              <div className="flex items-center gap-2 truncate">
                <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {stepResult.action?.toUpperCase() || "ASSERT"}
                </span>
                <code className="text-zinc-800 truncate max-w-xs font-semibold">
                  {stepResult.resolved_locator || "body"}
                </code>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(stepResult.resolved_locator, "nl_loc")}
                className="text-zinc-400 hover:text-zinc-800 transition-colors p-1"
                title="Copy resolved locator"
              >
                {copiedKey === "nl_loc" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Reasoning Explanation */}
            <p className="text-xs text-emerald-900/90 leading-relaxed font-sans">
              {stepResult.reasoning}
            </p>

            {/* Generated Code Snippet */}
            <div className="rounded-lg bg-[#18181B] text-zinc-200 p-3 text-[11px] font-mono border border-zinc-800 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-zinc-400 border-b border-zinc-800 pb-1 mb-1">
                <span className="flex items-center gap-1.5 text-orange-400">
                  <Terminal className="w-3 h-3" />
                  Synthesized Playwright Action
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `await page.locator('${stepResult.resolved_locator || "body"}').${stepResult.action || "click"}()`,
                      "nl_code"
                    )
                  }
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  {copiedKey === "nl_code" ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="text-emerald-400">
                # Natural language step compiled into invariant test
              </div>
              <div>
                await page.locator(&apos;<span className="text-orange-300">{stepResult.resolved_locator || "body"}</span>&apos;).{stepResult.action === "fill" ? "fill('test@drishti.ai')" : "click()"}
              </div>
              <div className="text-zinc-400">
                expect(page.status).to_be_one_of([200, 201, 204])
              </div>
            </div>

            {/* Execution Trace Timeline Accordion */}
            {stepResult.trace && stepResult.trace.length > 0 && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setExpandedTrace(!expandedTrace)}
                  className="w-full flex items-center justify-between text-[11px] font-mono text-emerald-800 hover:text-emerald-950 font-semibold cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3 h-3 text-emerald-600" />
                    <span>Multi-Agent Sandbox Trace ({stepResult.trace.length} phases)</span>
                  </span>
                  {expandedTrace ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {expandedTrace && (
                  <div className="mt-2 space-y-1.5 pl-2 border-l-2 border-emerald-300">
                    {stepResult.trace.map((t, idx) => (
                      <div key={idx} className="text-[11px] font-mono text-emerald-950">
                        <span className="uppercase font-bold text-emerald-800">[{t.phase}]</span>{" "}
                        <span className="text-zinc-600 font-sans">{t.note}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#E5E5E5] bg-[#FAFAF9] p-5 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 text-[#F97316] mx-auto flex items-center justify-center text-xs font-bold">
              AI
            </div>
            <div className="text-xs font-semibold text-[#171717]">
              Ready for Live Prompt Validation
            </div>
            <p className="text-[11px] text-[#737373] max-w-xs mx-auto">
              Type any test command or click a prompt above to compile natural language into headless Chromium actions.
            </p>
          </div>
        )}
      </div>

      {/* =========================================================================
          CARD 2: SELF-HEALING ENGINE (LOCATOR DRIFT RECOVERY)
          ========================================================================= */}
      <div className="lg:col-span-6 rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex items-start justify-between border-b border-[#F5F5F4] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F97316]">
                <Wand2 className="w-4 h-4 fill-[#F97316]/20" />
              </div>
              <h3 className="text-base font-bold text-[#171717] tracking-tight">
                Self-Healing Engine (Locator Drift)
              </h3>
            </div>
            <p className="text-xs text-[#737373] mt-1">
              Autonomous semantic recovery intercepts broken CSS/XPath selectors and heals them on the fly.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleTriggerSelfHealing(currentScenario.broken)}
            disabled={isHealing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-xs group"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isHealing ? "animate-spin" : "transition-transform group-hover:rotate-12"}`} />
            <span>{isHealing ? "Healing..." : "Simulate Drift"}</span>
          </button>
        </div>

        {/* Drift Scenario Selector Pills */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] font-semibold">
            Choose Drift Simulation Scenario:
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {DEMO_DRIFT_SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActiveDriftScenario(s.id);
                  handleTriggerSelfHealing(s.broken);
                }}
                className={`text-left p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                  activeDriftScenario === s.id
                    ? "border-orange-500 bg-orange-50/60 text-orange-950 font-semibold shadow-2xs"
                    : "border-[#E5E5E5] bg-[#FAFAF9] hover:bg-white text-zinc-600"
                }`}
              >
                <div className="font-bold text-[11px] truncate">{s.label}</div>
                <div className="text-[10px] font-mono text-zinc-500 truncate">{s.broken}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Scenario Details */}
        <div className="p-3 rounded-xl border border-zinc-200 bg-[#FAFAF9] text-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-600 font-semibold">Simulated Failure Mode:</span>
            <span className="text-orange-700 font-bold">{currentScenario.label}</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
            {currentScenario.description}
          </p>
        </div>

        {/* Live Healed Chains List */}
        <div className="space-y-3">
          {healedChains && healedChains.length > 0 ? (
            healedChains.slice(0, 3).map((hc, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 space-y-2.5 animate-in fade-in zoom-in-98 duration-200"
              >
                {/* Header status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Auto-Repaired via Accessible Hierarchy</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {Math.round((hc.confidence || 0.99) * 100)}% Match
                  </span>
                </div>

                {/* Before vs After selector pill */}
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                    <div className="flex items-center gap-1.5 truncate">
                      <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span className="text-[10px] uppercase font-bold text-rose-700 shrink-0">Broken:</span>
                      <code className="line-through truncate text-[11px] text-rose-900">
                        {hc.broken_selector}
                      </code>
                    </div>
                    <span className="text-[10px] text-rose-600 font-bold shrink-0">FAIL 404</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-emerald-300 text-emerald-900 shadow-2xs">
                    <div className="flex items-center gap-1.5 truncate">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-[10px] uppercase font-bold text-emerald-700 shrink-0">Healed:</span>
                      <code className="font-bold truncate text-[11px] text-emerald-950">
                        {hc.healed_selector}
                      </code>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(hc.healed_selector, `heal_${idx}`)}
                      className="text-zinc-400 hover:text-zinc-800 transition-colors p-1 shrink-0"
                      title="Copy healed selector"
                    >
                      {copiedKey === `heal_${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Recovery steps trace */}
                {hc.attempts && hc.attempts.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-emerald-200/60 text-[10px] font-mono">
                    <span className="text-emerald-800 font-bold uppercase tracking-wider block">
                      Autonomous Resolution Stages:
                    </span>
                    {hc.attempts.map((att, aIdx) => (
                      <div key={aIdx} className="flex items-center gap-2 text-zinc-600">
                        {att.success ? (
                          <span className="text-emerald-600 font-bold">✓ Stage {att.attempt}:</span>
                        ) : (
                          <span className="text-rose-500 font-bold">✗ Stage {att.attempt}:</span>
                        )}
                        <span className="truncate">{att.reasoning}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-[#E5E5E5] bg-[#FAFAF9] p-6 text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-[#F97316] mx-auto flex items-center justify-center text-xs font-bold">
                <Wand2 className="w-4 h-4" />
              </div>
              <div className="text-xs font-semibold text-[#171717]">
                Zero Locator Drift Incurred
              </div>
              <p className="text-[11px] text-[#737373] max-w-xs mx-auto">
                Click &quot;Simulate Drift&quot; or select a scenario above to test autonomous locator recovery in real time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
